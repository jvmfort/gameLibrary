package dto;

import com.jvmfort.gamelibrary.model.StatusJogo;
import jakarta.validation.constraints.*;

public record JogoRequestDTO(
        @NotBlank(message = "O nome do jogo é obrigatório")
        String nome,

        String plataforma,
        String genero,
        StatusJogo status,

        @PositiveOrZero(message = "Horas jogadas não pode ser negativo")
        Double horasJogadas,

        Boolean temHistoria,
        Boolean historiaConcluida,

        @Min(value = 0, message = "Nota mínima é 0")
        @Max(value = 10, message = "Nota máxima é 10")
        Integer notaPessoal,

        String review,
        String capaUrl,
        Integer anoLancamento,
        Long rawgId
) {}