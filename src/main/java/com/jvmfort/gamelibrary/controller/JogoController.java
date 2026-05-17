package com.jvmfort.gamelibrary.controller;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/jogos")
@CrossOrigin(origins = "*")
public class JogoController {

    @Autowired
    private JogoRepository repository;

    @GetMapping
    public List<Jogo> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Jogo buscar(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping
    public Jogo criar (@RequestBody Jogo jogo) {
        return repository.save(jogo);
    }

    @PutMapping("/{id}")
    public Jogo editar (@PathVariable Long id, @RequestBody Jogo dados) {
        dados.setId(id);
        return repository.save(dados);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
