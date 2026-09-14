package com.jvmfort.gamelibrary.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Objects;

@Entity
@Table(name = "jogos")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do jogo é obrigatório")
    @Column(nullable = false, length = 150)
    private String nome;

    // Aumentado para 255 para suportar listas vindas da RAWG (ex: "PC, PS5, Xbox Series")
    @Column(length = 255)
    private String plataforma;

    // Aumentado para 255 para comportar múltiplos gêneros (ex: "Action, Adventure, RPG")
    @Column(length = 255)
    private String genero;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatusJogo status = StatusJogo.NAO_INICIADO;

    @PositiveOrZero(message = "Horas jogadas não pode ser negativo")
    @Column(name = "horas_jogadas")
    private Double horasJogadas = 0.0;

    @Column(name = "tem_historia")
    private Boolean temHistoria = false;

    @Column(name = "historia_concluida")
    private Boolean historiaConcluida = false;

    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 10, message = "Nota máxima é 10")
    @Column(name = "nota_pessoal")
    private Integer notaPessoal;

    @Column(columnDefinition = "TEXT")
    private String review;

    // --- Novos campos para integração com RAWG ---

    // URLs da CDN do RAWG passam facilmente de 100 caracteres; 500 garante segurança
    @Column(name = "capa_url", length = 500)
    private String capaUrl;

    @Column(name = "ano_lancamento")
    private Integer anoLancamento;

    @Column(name = "rawg_id")
    private Long rawgId;

    public Jogo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public StatusJogo getStatus() { return status; }
    public void setStatus(StatusJogo status) { this.status = status; }

    public Double getHorasJogadas() { return horasJogadas; }
    public void setHorasJogadas(Double horasJogadas) { this.horasJogadas = horasJogadas; }

    public Boolean getTemHistoria() { return temHistoria; }
    public void setTemHistoria(Boolean temHistoria) { this.temHistoria = temHistoria; }

    public Boolean getHistoriaConcluida() { return historiaConcluida; }
    public void setHistoriaConcluida(Boolean historiaConcluida) { this.historiaConcluida = historiaConcluida; }

    public Integer getNotaPessoal() { return notaPessoal; }
    public void setNotaPessoal(Integer notaPessoal) { this.notaPessoal = notaPessoal; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }

    public String getCapaUrl() { return capaUrl; }
    public void setCapaUrl(String capaUrl) { this.capaUrl = capaUrl; }

    public Integer getAnoLancamento() { return anoLancamento; }
    public void setAnoLancamento(Integer anoLancamento) { this.anoLancamento = anoLancamento; }

    public Long getRawgId() { return rawgId; }
    public void setRawgId(Long rawgId) { this.rawgId = rawgId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Jogo)) return false;
        Jogo jogo = (Jogo) o;
        return Objects.equals(id, jogo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Jogo{id=" + id + ", nome='" + nome + "', status=" + status + "}";
    }
}