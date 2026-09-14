# 🎮 Game Library

A Java-based desktop application designed to catalog, organize, and track personal video game collections across different platforms. The project allows users to manage their game library, track completion status, and filter games by genre, platform, or progress.

---

## 🚀 Features

- **Game Management:** Add, update, and remove games from your library.
- **Progress Tracking:** Monitor playthrough statuses (e.g., *Playing*, *Completed*, *Backlog*, *Abandoned*).
- **Metadata Management:** Track key attributes such as platform (PC, PlayStation, Xbox, Switch), release year, hours played, and personal ratings.
- **Search & Filtering:**
  - Search by game title or developer/publisher.
  - Filter by platform, genre, and completion status.
- **Data Persistence:** Integrated storage for maintaining library records across sessions.

---

## 🛠️ Tech Stack & Architecture

- **Language:** Java 17+ (or Java 8+)
- **Architecture:** Layered Architecture / MVC (Model-View-Controller)
- **Design Patterns:** Repository Pattern, Interface Segregation, Custom Exception Handling
- **Database / Storage:** Supabase (PostgreSQL) / JDBC / Local JSON Persistence (depending on active profile)

### Suggested Project Structure
```text
src/
└── com/
    └── gamelibrary/
        ├── model/              # Domain entities (Game, Platform, Status enum)
        ├── repository/         # Data access interfaces & implementations (Supabase/JDBC/Memory)
        ├── service/            # Business rules and validations
        ├── exception/          # Custom exceptions (GameNotFoundException, DuplicateGameException)
        └── view/               # UI / CLI entry point (Main.java)
