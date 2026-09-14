package com.jvmfort.gamelibrary.repository;

import com.jvmfort.gamelibrary.model.Jogo;
import com.jvmfort.gamelibrary.model.StatusJogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long> {

    List<Jogo> findByPlataformaIgnoreCase(String plataforma);

    List<Jogo> findByStatus(StatusJogo status);

    List<Jogo> findByNomeContainingIgnoreCase(String trecho);

    List<Jogo> findByNotaPessoalGreaterThanEqual(Integer nota);

    Optional<Jogo> findByNomeIgnoreCase(String nome);

    List<Jogo> findByUserId(String userId);
}