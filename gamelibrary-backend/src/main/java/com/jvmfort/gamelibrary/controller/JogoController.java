package com.jvmfort.gamelibrary.controller;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.repository.JogoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/jogos")
public class JogoController {

    private final JogoRepository jogoRepository;

    public JogoController(JogoRepository jogoRepository) {
        this.jogoRepository = jogoRepository;
    }

    // ÚNICO MÉTODO GET - apague qualquer outro listar() que estiver no arquivo
    @GetMapping
    public List<Jogo> listar(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(value = "userId", required = false) String paramUserId
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