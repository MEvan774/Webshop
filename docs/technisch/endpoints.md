---
title: Endpoints
---

## In dit bestand staat een overzicht van alle huidige API-endpoints (dit bestand kan worden bijgewerkt)

| Methode | Endpoint | Beschrijving | Auth vereist | Controller / Service |
| --- | --- | --- | --- | --- |
| GET | `/` | Welkomstbericht API | Nee | - |
| GET | `/token/:token` | Check validiteit van het token | Nee | TokenController |
| POST | `/user/change-email` | Verander e-mail van gebruiker | Nee | UserController | <- Het zou logischer zijn als hier een login-sessie voor nodig is.
| POST | `/user/cancel-email` | Annulleer e-mail wijzigen | Nee | UserController | <- Het zou logischer zijn als hier een login-sessie voor nodig is.
