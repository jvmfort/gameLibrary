package com.jvmfort.gamelibrary.exception;

public class JogoNaoEncontradoException extends RuntimeException {
    public JogoNaoEncontradoException(Long id) {
        super("Jogo com ID " + id + " não encontrado");
    }
}