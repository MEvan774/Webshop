---
title: Functioneel ontwerp
children:
    - processen.md
---
# Functioneel ontwerp

## Titelpagina
- **Projectnaam**: StarShop
- **Versie**: v1.0
- **Datum**: [10-04-2024]
- **Auteur(s)**: 1-mula
- **Goedgekeurd door**: 

## Inhoudsopgave
1. [Inleiding](#inleiding)
2. [Processen in kaart brengen](#processen-in-kaart-brengen)
   - [Klantenregistratie](#klantenregistratie)
   - [Inloggen](#inloggen)
   - [Uitloggen](#uitloggen)
   - [Account verwijderen](#account-verwijderen)
   - [Producten bestellen](#producten-bestellen)
   - [Producten afrekenen en coupons gebruiken](#producten-afrekenen-en-coupons-gebruiken)
   - [Producten verzenden (digitaal)](#producten-verzenden-digitaal)
   - [Contact opnemen met de klantenservice](#contact-opnemen-met-de-klantenservice)
   - [Producten toevoegen aan wishlist](#producten-toevoegen-aan-wishlist)
3. [BPMN](#bpmn)
4. [Requirements, User Stories en Acceptatiecriteria](#requirements-user-stories-en-acceptatiecriteria)
5. [User Interface Ontwerpen](#user-interface-ontwerpen)

## Inleiding
- **Doel van het ontwerp**: Dit document bevat een overzicht van de processen en functionaliteiten van de webshop.
- **Achtergrondinformatie**: [Context en achtergrond van het project]
- **Reikwijdte**: Dit ontwerp betreft de essentiële processen voor klantenregistratie, inloggen, bestelling en verzendprocessen, en klantenservice.

## Processen in kaart brengen
We hebben de volgende processen geïdentificeerd die essentieel zijn voor de webshop:

### Klantenregistratie
- **Beschrijving**: Gebruikers kunnen zich registreren om een account aan te maken in de webshop.
- **Acties**:
  1. Vul het registratieformulier in.
  2. Verstuur registratiegegevens.
  3. Bevestig registratie via e-mail.

- **BPMN Diagram**:
  ![BPMN Klantenregistratie](link_naar_bpmn_klantenregistratie.png)

### Inloggen
- **Beschrijving**: Gebruikers loggen in met hun gebruikersnaam en wachtwoord om toegang te krijgen tot hun account.
- **Acties**:
  1. Vul gebruikersnaam en wachtwoord in.
  2. Verstuur de gegevens naar de backend.
  3. Ontvang authenticatie-token als het succesvol is.

- **BPMN Diagram**:
  ![BPMN Inloggen](link_naar_bpmn_inloggen.png)

### Uitloggen
- **Beschrijving**: Gebruikers loggen uit om hun sessie te beëindigen.
- **Acties**:
  1. Klik op de uitlogknop.
  2. Backend verwijdert sessie-informatie en de gebruiker wordt uitgelogd.

- **BPMN Diagram**:
  ![BPMN Uitloggen](link_naar_bpmn_uitloggen.png)

### Account verwijderen
- **Beschrijving**: Gebruikers kunnen hun account verwijderen om hun gegevens uit de webshop te verwijderen.
- **Acties**:
  1. Klik op accountinstellingen.
  2. Verzoek om account te verwijderen.
  3. Verwijdering van accountbevestiging en gegevens uit de database.

- **BPMN Diagram**:
  ![BPMN Account Verwijderen](link_naar_bpmn_account_verwijderen.png)

### Producten bestellen
- **Beschrijving**: Gebruikers kunnen producten aan hun winkelmand toevoegen en een bestelling plaatsen.
- **Acties**:
  1. Voeg producten toe aan winkelmand.
  2. Controleer winkelmand.
  3. Bevestig bestelling en ontvang bevestigingsmail.

- **BPMN Diagram**:
  ![BPMN Bestellen](link_naar_bpmn_bestellen.png)

### Producten afrekenen en coupons gebruiken
- **Beschrijving**: Gebruikers kunnen hun producten afrekenen en een kortingscode toepassen.
- **Acties**:
  1. Vul verzendinformatie in.
  2. Voeg betaalmethode toe.
  3. Pas kortingscode toe.
  4. Bevestig betaling en voltooi de bestelling.

- **BPMN Diagram**:
  ![BPMN Afrekenen en Coupons](link_naar_bpmn_afrekenen_en_coupons.png)

### Producten verzenden (digitaal)
- **Beschrijving**: Na de bestelling worden producten digitaal verzonden naar de klant (voor digitale producten).
- **Acties**:
  1. Bevestig bestelling.
  2. Verstuur digitale producten naar de klant via e-mail of downloadlink.

- **BPMN Diagram**:
  ![BPMN Verzenden Digitaal](link_naar_bpmn_verzenden_digitaal.png)

### Contact opnemen met de klantenservice
- **Beschrijving**: Gebruikers kunnen contact opnemen met de klantenservice voor hulp of vragen.
- **Acties**:
  1. Vul contactformulier in.
  2. Stuur aanvraag naar klantenservice.
  3. Ontvang antwoord via e-mail of andere communicatiemiddelen.

- **BPMN Diagram**:
  ![BPMN Klantenservice](link_naar_bpmn_klantenservice.png)

### Producten toevoegen aan wishlist
- **Beschrijving**: Gebruikers kunnen producten aan hun wishlist toevoegen voor toekomstige aankopen.
- **Acties**:
  1. Voeg producten toe aan de wishlist.
  2. Beheer wishlist en verwijder producten indien gewenst.

- **BPMN Diagram**:
  ![BPMN Wishlist](link_naar_bpmn_wishlist.png)

## BPMN
Voor elk proces is er een bijbehorend BPMN-diagram dat de verschillende stappen, actoren, en gegevensstromen visualiseert. Dit biedt een duidelijk overzicht van hoe elk proces functioneert.

## Requirements, User Stories en Acceptatiecriteria
- **Requirements formuleren en vastleggen**:
  - Gebaseerd op gesprekken met stakeholders en mogelijke gebruikers.

- **User Stories**:
  1. **Als klant wil ik mijn account kunnen registreren, zodat ik een account kan aanmaken en mijn bestellingen kan beheren.**
     - **Acceptatiecriteria**:
       - Het registratieformulier accepteert naam, e-mail, en wachtwoord.
       - Een bevestigingsmail wordt gestuurd na registratie.
  
  2. **Als klant wil ik mijn producten kunnen afrekenen en een kortingscode kunnen toepassen, zodat ik korting kan krijgen op mijn bestellingen.**
     - **Acceptatiecriteria**:
       - De kortingscode wordt toegepast en het totaalbedrag wordt aangepast.
       - Betaling wordt succesvol verwerkt.

## User Interface Ontwerpen
- **Kleurenpalet en Stijl**:
  - Analyse van kleurenpalet van het LucaStars-logo
  - Gebruikersinteractie en stijl van bestaande webshops
  
- **Wireframes en UI-ontwerpen**:
  - Lo-fi, Medium-fi, en High-fi ontwerpen in Figma
  - CSS op basis van de huisstijl van LucaStars
  - **Voorbeeld wireframe van inlogscherm**:
    ![Inlogscherm Wireframe](link_naar_wireframe.png)

## Belangrijkste Beloftes en Wensen van de Product Owner
De product owner heeft een aantal wensen geuit voor de webshop, die van invloed zullen zijn op het ontwerp en de functionaliteit:

- **Spellen zijn online** en moeten binnen 2 uur spelen en binnen 2 weken beschikbaar zijn.
- De **webshop moet in het Nederlands** zijn, met een mogelijkheid voor toekomstige tweetaligheid.
- **Kleurenschema en Fonts** moeten consistent zijn en passen bij de stijl van LucaStars.
- **Abonnementen** kunnen worden toegevoegd, maar zijn geen prioriteit.
- **Betaald spel** moet een link naar het spel bevatten na aankoop.
- **Bevestiging via e-mail** na aankoop met een link naar het spel.
- **Profieloverzicht** moet spellen en links naar spellen tonen.
- **Wensenlijst en favorieten** moeten beschikbaar zijn voor gebruikers.
- **Nieuwsbrief** is optioneel.
- **Recensies**: Gebruikers moeten spellen kunnen beoordelen met sterren en later met tekst.
- **Dubbel kopen**: Het moet onmogelijk zijn om hetzelfde spel twee keer te kopen, tenzij als cadeau.
- **Klantenservice**: Dit is geen must voor de eerste versie, maar kan later worden toegevoegd.
