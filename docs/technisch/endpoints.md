---
title: Endpoints
---

## In dit bestand staat een overzicht van alle huidige API-endpoints (dit bestand kan worden bijgewerkt)

| Methode | Endpoint URL | Parameters | Toelichting (doel en return)   | Beschrijving   | Auth vereist | Controller / Service | Port | Containernaam  |
| --- | --- |  --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | - | Retourneert een welkomstbericht in JSON-formaat | Welkomstbericht API  | Nee | - | - | - |
| GET | `/token/:token` | `:token` (path param)  | Controleert of het token geldig is. Geeft boolean of status terug. | Check validiteit van het token | Nee | TokenController | - | - |
| POST | `/user/change-email` | JSON-body: `newEmail` | Verzoekt wijziging van het e-mailadres. Retourneert status of foutmelding. | Verander e-mail van gebruiker | Nee | UserController  | - | - |
| POST | `/user/cancel-email` | JSON-body: `emailToken` | Annuleert een eerder gestarte e-mailwijziging. | Annuleer e-mail wijzigen | Nee | UserController | - | - |
| GET | `/products` | Optioneel: query params | Haalt een lijst van alle producten op als JSON-array. | Verkrijg alle producten | Nee | GamesController | - | - |
| GET | `/games/:gameid` | `:gameid` (path param) | Haalt informatie op over een specifieke game op basis van ID. | Verkrijg games op basis van ID  | Nee | GamesController | - | - |
| GET | `/products/prices/:gameId` | `:gameId` (path param) | Haalt prijsinformatie op van producten gerelateerd aan een specifieke game. | Verkrijg prijzen o.b.v. gameId | Nee | OegeDockerService  | 8580 | productprices |
