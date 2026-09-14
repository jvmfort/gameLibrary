package com.jvmfort.gamelibrary.service;

import com.jvmfort.gamelibrary.exception.JogoNaoEncontradoException;
import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JogoService {

    @Autowired
    private JogoRepository repository;

    public List<Jogo> listarTodos() {
        return repository.findAll();
    }

    public Jogo buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new JogoNaoEncontradoException(id));
    }

    public Jogo criar(Jogo jogo) {
        return repository.save(jogo);
    }

    public Jogo editar(Long id, Jogo dados) {
        Jogo existente = buscarPorId(id);
        dados.setId(existente.getId());
        return repository.save(dados);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }
}