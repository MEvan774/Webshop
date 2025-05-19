---
title: Technisch ontwerp
children:
    - erd.md
    - eerd.md
    - mermaid.md
    - flowchart.md
    - classdiagram.md
---
# Technisch ontwerp

## Titelpagina
- **Projectnaam**: StarShop
- **Versie**: v1.0
- **Datum**: [10-04-2024]
- **Auteur(s)**: 1-mula
- **Goedgekeurd door**: 

## Inhoudsopgave
1. [Class Structuur](#class-structuur)
2. [Endpoint Overzicht](#endpoint-overzicht)
3. [Database Ontwerp](#database-ontwerp)
4. [Infrastructuur](#infrastructuur)
5. [Documentatie en Implementatie](#documentatie-en-implementatie)

## Class Structuur
Het systeem zal een objectgeoriënteerde benadering volgen. De belangrijkste entiteiten en hun relaties worden hieronder beschreven.

### Entiteiten en hun functies
1. **User**:
   - **Beschrijving**: Vertegenwoordigt een klant van de webshop.
   - **Attribuut**: 
     - `id`: Unieke identificator.
     - `naam`: Naam van de klant.
     - `email`: E-mailadres van de klant.
     - `wachtwoord`: Gehashed wachtwoord van de klant.
     - `adres`: Adres van de klant voor verzending.
   - **Methoden**:
     - `registreer()`: Registreert een nieuwe gebruiker.
     - `inloggen()`: Verwerkt het inlogproces.
     - `uitloggen()`: Beëindigt de sessie.
     - `verwijderAccount()`: Verwijdert het account van de klant.

2. **Product**:
   - **Beschrijving**: Vertegenwoordigt een product in de webshop.
   - **Attribuut**: 
     - `id`: Unieke product-ID.
     - `naam`: Naam van het product.
     - `beschrijving`: Beschrijving van het product.
     - `prijs`: Prijs van het product.
     - `voorraad`: Hoeveelheid van het product in voorraad.
   - **Methoden**:
     - `toevoegenAanWinkelmand()`: Voegt het product toe aan de winkelmand van de gebruiker.
     - `verwijderenUitWinkelmand()`: Verwijdert het product uit de winkelmand.

3. **Winkelmand**:
   - **Beschrijving**: Houdt de producten bij die een gebruiker heeft toegevoegd aan hun winkelmand.
   - **Attribuut**: 
     - `producten`: Lijst van producten in de winkelmand.
     - `klant`: Koppeling naar de klant die de winkelmand gebruikt.
   - **Methoden**:
     - `toevoegenProduct(product)`: Voegt een product toe aan de winkelmand.
     - `verwijderenProduct(product)`: Verwijdert een product uit de winkelmand.
     - `berekenTotaal()`: Bereken het totaalbedrag van de producten in de winkelmand.

4. **Bestelling**:
   - **Beschrijving**: Vertegenwoordigt een bestelling die is geplaatst door een klant.
   - **Attribuut**: 
     - `id`: Unieke bestellings-ID.
     - `klant`: Koppeling naar de klant die de bestelling heeft geplaatst.
     - `producten`: Lijst van bestelde producten.
     - `status`: Status van de bestelling (bijv. "in behandeling", "verzonden").
     - `totaalbedrag`: Het totaalbedrag van de bestelling.
   - **Methoden**:
     - `verwerkBestelling()`: Verwerkt de bestelling en verstuurt deze naar het betalingssysteem.
     - `verzendProducten()`: Verzendt de producten naar de klant.

### Architectuur Lagen
De architectuur van de webshop volgt de **Model-View-Controller (MVC)** structuur:

- **Model**: Bevat de logica en interacties met de database, zoals de entiteiten (User, Product, Bestelling).
- **View**: De frontend die de data weergeeft en de interactie met de gebruiker regelt (bijv. HTML, CSS, JavaScript).
- **Controller**: Behandelt verzoeken van de frontend en stuurt de gegevens van het model naar de view. Het werkt ook de logica bij het verwerken van aanvragen van de gebruiker, zoals het plaatsen van een bestelling of inloggen.

**Frontend**: De frontend is "dun", wat betekent dat de logica voornamelijk in de backend zit. De frontend houdt zich vooral bezig met het weergeven van data die wordt opgehaald via API-aanroepen.

### Visueel Class Diagram
```plaintext
+---------------------+            +-----------------------+
|        User         |<---------->|     Bestelling        |
|---------------------|            |-----------------------|
| id                  |            | id                    |
| naam                |            | klant_id              |
| email               |            | producten             |
| wachtwoord          |            | status                |
| adres               |            | totaalbedrag          |
+---------------------+            +-----------------------+
        ^                                ^
        |                                |
        v                                v
+--------------------+          +----------------------+
|   Winkelmand       |<-------->|     Product          |
|--------------------|          |----------------------|
| producten          |          | id                   |
| klant_id           |          | naam                 |
+--------------------+          | prijs                |
                                | voorraad             |
                                +----------------------+