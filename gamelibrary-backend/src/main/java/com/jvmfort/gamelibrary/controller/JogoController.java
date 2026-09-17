package com.jvmfort.gamelibrary.controller;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.repository.JogoRepository;
import com.jvmfort.gamelibrary.service.SteamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/jogos")
public class JogoController {

    private final JogoRepository jogoRepository;
    private final SteamService steamService;

    public JogoController(JogoRepository jogoRepository, SteamService steamService) {
        this.jogoRepository = jogoRepository;
        this.steamService = steamService;
    }

    @GetMapping
    public List<Jogo> listar(
            @RequestParam(value = "userId", required = false) String paramUserId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        String userId = (paramUserId != null && !paramUserId.isBlank()) ? paramUserId : headerUserId;

        if (userId == null || userId.isBlank()) {
            return List.of();
        }

        return jogoRepository.findByUserId(userId);
    }

    @PostMapping
    public Jogo salvar(
            @RequestBody Jogo jogo,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        if (jogo.getUserId() == null || jogo.getUserId().isBlank()) {
            jogo.setUserId(headerUserId);
        }
        return jogoRepository.save(jogo);
    }

    @PostMapping("/steam")
    public ResponseEntity<?> sincronizarSteam(
            @RequestParam String steamId,
            @RequestParam(required = false) String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        String finalUserId = (userId != null && !userId.isBlank()) ? userId : headerUserId;

        if (finalUserId == null || finalUserId.isBlank()) {
            return ResponseEntity.badRequest().body("Usuário não identificado.");
        }

        List<Jogo> importados = steamService.sincronizarJogos(steamId, finalUserId);
        return ResponseEntity.ok(importados);
    }

    @PutMapping("/{id}")
    public Jogo atualizar(
            @PathVariable Long id,
            @RequestBody Jogo jogo,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId
    ) {
        jogo.setId(id);
        if (jogo.getUserId() == null || jogo.getUserId().isBlank()) {
            jogo.setUserId(headerUserId);
        }
        return jogoRepository.save(jogo);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        jogoRepository.deleteById(id);
    }
}
