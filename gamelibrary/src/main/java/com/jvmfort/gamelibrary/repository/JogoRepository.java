package com.jvmfort.gamelibrary.repository;

import com.jvmfort.gamelibrary.model.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long> {
}