---
title: Endpoints
author: Lisa Hakhoff
date: 02-06-2025
---

<!-- NOTE: When adding new endpoints to this list, please update the #versiebeheer with your changes/updates so the team can keep track. -->

## Versiebeheer
| Versie | Datum | Auteur | Wijzigingen |
| --- | --- | --- | --- |
| 1.0 | 28-05 | Lisa Hakhoff | Eerste versie |
| 1.1 | 02-06 | Lisa Hakhoff | Toegevoegd: parameters, toelichting (doel & return), port en containernaam (voor externe connecties) |

## Endpoint tabel

| Methode | Endpoint URL | Parameters | Toelichting (doel en return) | Beschrijving | Auth vereist | Controller / Service | Port | Containernaam |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | - | Retourneert een welkomstbericht in JSON-formaat | Welkomstbericht API | Nee | - | - | - |
| GET | `/token/:token` | `:token` (path param) | Controleert of het token geldig is. Geeft boolean of status terug. | Check validiteit van het token | Nee | TokenController | - | - |
| POST | `/user/change-email` | JSON-body: `newEmail` | Verzoekt wijziging van het e-mailadres. Retourneert status of foutmelding. | Verander e-mail van gebruiker | Nee | UserController | - | - |
| POST | `/user/cancel-email` | JSON-body: `emailToken` | Annuleert een eerder gestarte e-mailwijziging | Annuleer e-mail wijzigen | Nee | UserController | - | - |
| GET | `/products` | Optioneel: query params | Haalt een lijst van alle producten op als JSON-array | Verkrijg alle producten | Nee | GamesController | - | - |
| GET | `/games/:gameid` | `:gameid` (path param) | Haalt informatie op over een specifieke game op basis van ID | Verkrijg game op basis van ID | Nee | GamesController | - | - |
| GET | `/products/prices/:gameId` | `:gameId` (path param) | Haalt prijsinformatie op van producten gerelateerd aan een specifieke game | Verkrijg prijzen o.b.v. gameId | Nee | OegeDockerService | 8580 | productprices |
| POST | `/user/register` | JSON-body: `email`, `password`, etc. | Registreert een nieuwe gebruiker. Retourneert bevestiging of foutmelding | Registreer gebruiker | Nee | UserController | - | - |
| POST | `/user/login` | JSON-body: `email`, `password` | Logt de gebruiker in en maakt een sessie aan | Login gebruiker | Nee | UserController | - | - |
| GET | `/user/exists/:email` | `:email` (path param) | Controleert of een gebruiker met dit e-mailadres bestaat | Controleer of gebruiker bestaat | Nee | UserController | - | - |
| GET | `/user/:sessionID` | `:sessionID` (path param) | Haalt gebruikersdata op obv sessie-ID (let op: endpoint vereist beveiliging) | Haal user-informatie op | Ja | UserController | - | - |
| GET | `/session` | - | Geeft informatie terug over de huidige sessie (indien ingelogd) | Haal sessie-info op | Ja | WelcomeController | - | - |
| DELETE | `/session` | - | Verwijdert de huidige sessie | Uitloggen | Ja | WelcomeController | - | - |
| DELETE | `/session/expired` | - | Verwijdert verlopen sessies (admin/functie afhankelijk) | Verwijder verlopen sessies | Ja | WelcomeController | - | - |
| GET | `/welcome` | - | Geeft welkom-informatie voor ingelogde gebruiker | Welkomsttekst (privé) | Ja | WelcomeController | - | - |
| GET | `/verify` | query param: `token` | Verifieert gebruiker met opgegeven token | Verifieer gebruiker | Nee | UserService | - | - |
