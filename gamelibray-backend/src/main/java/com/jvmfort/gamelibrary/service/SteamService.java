package com.jvmfort.gamelibrary.service;

import dto.Steam.SteamGameItem;
import dto.Steam.SteamResponse;
import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.model.StatusJogo;
import com.jvmfort.gamelibrary.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class SteamService {

    @Value("${steam.api.key}")
    private String apiKey;

    private final JogoRepository jogoRepository;
    private final RestClient restClient;

    public SteamService(JogoRepository jogoRepository) {
        this.jogoRepository = jogoRepository;
        this.restClient = RestClient.create();
    }

    public List<Jogo> importarJogosSteam(String steamId) {
        String url = String.format(
                "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&format=json&include_appinfo=true&include_played_free_games=true",
                apiKey, steamId
        );

        SteamResponse resposta = restClient.get()
                .uri(url)
                .retrieve()
                .body(SteamResponse.class);

        if (resposta == null || resposta.response() == null || resposta.response().games() == null) {
            return List.of();
        }

        List<Jogo> salvos = new ArrayList<>();

        for (SteamGameItem item : resposta.response().games()) {
            // Converte minutos para horas com 1 casa decimal
            double horas = Math.round((item.playtimeForever() / 60.0) * 10.0) / 10.0;

            // Busca se o jogo já existe para não duplicar
            Jogo jogo = jogoRepository.findByNomeIgnoreCase(item.name())
                    .orElse(new Jogo());

            if (jogo.getId() == null) {
                jogo.setNome(item.name());
                jogo.setPlataforma("PC (Steam)");
                jogo.setGenero("Geral");
                // Capa vertical em alta resolução da Steam
                jogo.setCapaUrl(String.format(
                        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/%d/library_600x900.jpg",
                        item.appid()
                ));
            }

            jogo.setHorasJogadas(horas);

            // Define status inicial baseado nas horas se ainda não iniciado
            if (jogo.getStatus() == null || jogo.getStatus() == StatusJogo.NAO_INICIADO) {
                jogo.setStatus(horas > 0 ? StatusJogo.EM_ANDAMENTO : StatusJogo.NAO_INICIADO);
            }

            salvos.add(jogoRepository.save(jogo));
        }

        return salvos;
    }
}