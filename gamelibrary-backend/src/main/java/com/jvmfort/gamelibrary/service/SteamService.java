package com.jvmfort.gamelibrary.service;


import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.model.StatusJogo; // Import do seu enum
import com.jvmfort.gamelibrary.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class SteamService {

    @Value("${steam.api.key:}")
    private String steamApiKey;

    private final JogoRepository jogoRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SteamService(JogoRepository jogoRepository) {
        this.jogoRepository = jogoRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<Jogo> sincronizarJogos(String steamId, String userId) {
        if (steamApiKey == null || steamApiKey.isBlank()) {
            throw new IllegalStateException("A chave steam.api.key não foi configurada nas variáveis de ambiente!");
        }

        String url = String.format(
                "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&format=json&include_appinfo=true&include_played_free_games=true",
                steamApiKey, steamId
        );

        List<Jogo> jogosNovos = new ArrayList<>();

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode gamesNode = root.path("response").path("games");

            if (gamesNode.isArray()) {
                for (JsonNode g : gamesNode) {
                    long appId = g.path("appid").asLong();
                    String nome = g.path("name").asText();
                    double minutos = g.path("playtime_forever").asDouble();
                    double horas = Math.round((minutos / 60.0) * 10.0) / 10.0;

                    String capa = String.format("https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/%d/header.jpg", appId);

                    Jogo jogo = new Jogo();
                    jogo.setNome(nome);
                    jogo.setPlataforma("PC (Steam)");
                    jogo.setUserId(userId);
                    jogo.setCapaUrl(capa);
                    jogo.setHorasJogadas(horas);

                    // Usa o enum StatusJogo em vez de String
                    jogo.setStatus(horas > 0 ? StatusJogo.EM_ANDAMENTO : StatusJogo.NAO_INICIADO);

                    jogosNovos.add(jogo);
                }
                return jogoRepository.saveAll(jogosNovos);
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha ao comunicar com a Steam: " + e.getMessage(), e);
        }

        return List.of();
    }
}