# 🎮 Game Library

Aplicação full-stack para gerenciamento e catálogo pessoal de jogos, desenvolvida com backend em **Spring Boot (Java)** e frontend em **React (Vite)** estilizado com **Tailwind CSS**. A interface segue a identidade visual **Onyx & Amber**, inspirada em launchers nativos e plataformas de colecionismo.

---

## 🚀 Funcionalidades

- **CRUD Completo de Jogos:** Cadastro, edição, listagem e remoção com confirmação em modal dedicado.
- **Integração RAWG API:** Autocompletar com busca de metadados, gênero, plataformas e pôsteres verticais em alta resolução.
- **Sincronização com a Steam:** Importação direta da biblioteca de jogos via SteamID64, calculando horas jogadas e puxando as capas verticais oficiais da CDN da Valve.
- **Interface Desktop-Native:**
  - Pôsteres travados na proporção física de mídia (3:4) para evitar distorções.
  - Badges de status com ponto luminoso/LED dinâmico (com efeito perolado reluzente para platinas).
  - Modais customizados (sem alertas ou prompts nativos do navegador).
  - Estrutura modular com Custom Hook (`useJogos`).

---

## 🛠️ Tecnologias

### Backend
- **Java 21**
- **Spring Boot** (Spring Web, Spring Data JPA)
- **Banco de Dados:** H2 / PostgreSQL / MySQL
- **RestClient** (consumo da Steam Web API)
- **Lombok / Jackson**

### Frontend
- **React 18 / 19**
- **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Custom Hook Pattern**

---

## 📂 Estrutura do Projeto

```text
gamelibrary/
├── gamelibray-backend/
│   ├── src/main/java/com/jvmfort/gamelibrary/
│   │   ├── controller/      # Endpoints REST (CRUD e Steam)
│   │   ├── dto/             # DTOs de requisição e mapeamento da Steam
│   │   ├── model/           # Entidades (Jogo, StatusJogo)
│   │   ├── repository/      # Interfaces Spring Data JPA
│   │   └── service/         # Regras de negócio e integração Steam
│   └── src/main/resources/
│       └── application.properties
│
└── gamelibrary-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── icons/       # SVGs minimalistas (Logo, Disc, Edit, Trash)
    │   │   ├── GameCard.jsx
    │   │   ├── GameFormModal.jsx
    │   │   ├── GameGrid.jsx
    │   │   ├── GameSearchInput.jsx
    │   │   └── Header.jsx
    │   ├── config/          # Configuração de status, cores e badges
    │   ├── hooks/           # useJogos.js (lógica de estado e API)
    │   ├── App.jsx          # Orquestrador da aplicação
    │   ├── index.css        # Import Tailwind + animações CSS
    │   └── main.jsx
    ├── .env.example
    └── vite.config.js