package com.jvmfort.gamelibrary.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jogos")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String plataforma;
    private String genero;
    private String status;
    private Double horasJogadas;
    private Boolean temHistoria;
    private Boolean historiaConcluida;
    private Integer notaPessoal;
    private String review;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPlataforma() {
        return plataforma;
    }

    public void setPlataforma(String plataforma) {
        this.plataforma = plataforma;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getHorasJogadas() {
        return horasJogadas;
    }

    public void setHorasJogadas(Double horasJogadas) {
        this.horasJogadas = horasJogadas;
    }

    public Boolean getTemHistoria() {
        return temHistoria;
    }

    public void setTemHistoria(Boolean temHistoria) {
        this.temHistoria = temHistoria;
    }

    public Boolean getHistoriaConcluida() {
        return historiaConcluida;
    }

    public void setHistoriaConcluida(Boolean historiaConcluida) {
        this.historiaConcluida = historiaConcluida;
    }

    public Integer getNotaPessoal() {
        return notaPessoal;
    }

    public void setNotaPessoal(Integer notaPessoal) {
        this.notaPessoal = notaPessoal;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}