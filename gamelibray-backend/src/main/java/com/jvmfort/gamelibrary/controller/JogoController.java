package com.jvmfort.gamelibrary.controller;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.service.JogoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jogos")
public class JogoController {

    @Autowired
    private JogoService service;

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
}