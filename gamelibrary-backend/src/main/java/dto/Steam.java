package dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class Steam {

        public record SteamResponse(
                SteamGamesResponse response
        ) {}

        public record SteamGamesResponse(
                @JsonProperty("game_count")
                Integer gameCount,
                List<SteamGameItem> games
        ) {}

        public record SteamGameItem(
                Integer appid,
                String name,
                @JsonProperty("playtime_forever")
                Integer playtimeForever,
                @JsonProperty("img_icon_url")
                String imgIconUrl
        ) {}
}