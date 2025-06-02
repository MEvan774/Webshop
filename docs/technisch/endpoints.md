---
title: Endpoints
---

## In dit bestand staat een overzicht van alle huidige API-endpoints (dit bestand kan worden bijgewerkt)

| Methode | Endpoint URL | Beschrijving | Auth vereist | Controller / Service | Port | Containernaam |
| --- | --- | --- | --- | --- |
| GET | `/` | Welkomstbericht API | Nee | - | - | - |
| GET | `/token/:token` | Check validiteit van het token | Nee | TokenController | - | - |
| POST | `/user/change-email` | Verander e-mail van gebruiker | Nee | UserController | - | - |
| POST | `/user/cancel-email` | Annulleer e-mail wijzigen | Nee | UserController | - | - |
| GET | `/products` | Verkrijg alle producten | Nee | GamesController | - | - |
| GET | `/games/:gameid` | Verkrijg games o.b.v ID | Nee | GamesController | - | - |
| GET | `/products/prices/:gameId` | Verkrijg de prijzen o.b.v. gameId | Nee | OegeDockerService | 8580 | productPrice |
