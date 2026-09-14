package com.jvmfort.gamelibrary.controller;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.service.JogoService;
import com.jvmfort.gamelibrary.service.SteamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.jvmfort.gamelibrary.repository.JogoRepository; // 1. Certifique-se de importar o repositório


@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://game-library-teal.vercel.app/" // se suportado, ou coloque a URL exata abaixo
        },
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/jogos")

public class JogoController {

    @Autowired
    private JogoService service;
    private final SteamService steamService;
    private final JogoRepository jogoRepository;

    public JogoController(SteamService steamService, JogoRepository jogoRepository) {
        this.steamService = steamService;
        this.jogoRepository = jogoRepository;
    }

    @PostMapping("/importar-steam/{steamId}")
    public ResponseEntity<List<Jogo>> importarSteam(@PathVariable String steamId) {
        // Chamada usando a instância injetada (minúscula)
        List<Jogo> jogosImportados = steamService.importarJogosSteam(steamId);
        return ResponseEntity.ok(jogosImportados);
    }

    @GetMapping
    public List<Jogo> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Jogo buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Jogo> criar(@Valid @RequestBody Jogo jogo) {
        Jogo criado = service.criar(jogo);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public Jogo editar(@PathVariable Long id, @Valid @RequestBody Jogo dados) {
        return service.editar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Jogo> listar(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId == null || userId.isBlank()) {
            return List.of(); // Retorna lista vazia caso não haja usuário logado
        }
        return jogoRepository.findByUserId(userId);
    }

    @PostMapping
    public Jogo salvar(@RequestBody Jogo jogo, @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId != null) {
            jogo.setUserId(userId);
        }
        return jogoRepository.save(jogo);
    }

}