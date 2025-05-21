## Wat zijn best practices voor het veilig en ethisch opslaan van persoonsgegevens binnen een webshop, met oog op privacy, gebruikersbelang en toestemming?

### (Beroeps)ethiek en de toepassing binnen de webshop Starshop
Ethiek betreft het nadenken van gevolgen van handelingen, zowel positief als negatief. In de IT is dit vooral relevant voor het gebruik van kunstmatige intelligentie, het verzamelen van persoonsgegevens en de toegankelijkheid van techniek. Dit wordt beroepsethiek genoemd.

Voor de webshop Starshop moeten er afspraken gemaakt worden over het verzamelen van persoonsgegevens van gebruikers, met oog op privacy, gebruikersbelang en toestemming, die in toestemming zijn met de product owners en die toegestaan zijn volgens de wet.

### Vereisten van de product owners
10 april 2025 heeft er een gesprek plaats gevonden tussen de product owners en het ontwikkelteam van Starshop. Tijdens dit gesprek zijn verschillende vereisten opgesteld voor de webshop, waaronder het verzamelen van persoonsgegevens van de gebruikers.

De product owners willen de volledige naam, email, het wachtwoord, het geslacht en de haar-, oog- en huidskleur van de gebruikers verzamelen. De laatste 4 gegevens riepen vraagtekens bij het ontwikkelteam op met betrekking tot privacy en ethiek. Er werd geadviseerd onderzoek te doen naar de noodzaak van het verzamelen van persoonsgegevens, en de AVG hierbij te pakken.

### Gebruikersonderzoek
Om gebruikersmeningen te verzamelen werd er een Engelstalige online enquête via Google Forms uitgebracht. De enquête vraagt de gebruikers hun mening bij het verzamelen van bepaalde gegevens, op een schaal van 1-4 waarbij 1 ‘Don’t mind’ en 4 ‘Would stop me from using the webshop’ representeert. De enquête, verspreidt via Reddit, leverde 16 reacties op, die de volgende bevindingen gaf:

Persoonsgegevens met merendeels schaalwaarde 1 of 2:
-	Voornaam (87%)
-	Volledige naam (61%)
-	Email (100%)
-	Land (80%)
-	Geslacht (81%)

Persoonsgegevens met merendeels schaalwaarde 3 of 4:
-	Telefoonnummer (74%)
-	Huidskleur (57%)

Een gedetailleerd overzicht van de uitkomst van de enquête is te vinden in bijlage 1.

### Algemene Verordening Gegevensbescherming
De AVG is een EU-wet die regels stelt over het verzamelen, behouden en opslaan van persoonsgegevens. Deze wet is geldig voor bedrijven binnen de EU en bedrijven buiten de EU die gegevens van inwoners van de EU verzamelen.

Persoonsgegevens zijn gegevens waardoor je de identiteit van de betrokkene kan achterhalen. Dit zijn bijvoorbeeld de naam, het adres, het inkomen of de medische gegevens. Bepaalde gegevens vallen onder de speciale categorieën persoonsgegevens die nooit zomaar verzameld mogen worden, zoals:

-	Ras of etnische afkomst
-	Seksualiteit
-	Politieke meningen
-	Religie of filosofische overtuigingen
-	Lidmaatschap van vakbonden
-	Genetische, biometrische en gezondheidsaspecten
-	Strafrechtelijke veroordelingen of overtredingen

Persoonsgegevens mogen alleen verzameld worden als minstens één van deze gevallen van toepassing is:
-	De betrokkene heeft toestemming gegeven en het is duidelijk gemaakt aan de betrokkene wat er precies met de gegevens gedaan wordt
-	Het verzamelen van de gegevens is nodig voor wettelijke of contractuele verplichtingen, of is van levensbelang voor de betrokkene
-	De gegevens worden verwerkt voor een opdracht van openbaar belang (bijvoorbeeld een bank of verzekering)
-	Er wordt gehandeld met legitiem belang voor de onderneming en heeft geen gevolgen voor de rechten en vrijheid van de betrokkene. Het belang van de betrokkene gaat voor het belang van het bedrijf, dus als deze niet overeen komen, mogen er geen gegevens verzameld worden.

Bij het vragen om toestemming voor het verzamelen en gebruiken van persoonsgegevens, moet er heel duidelijk aan de betrokkene verteld worden welke gegevens er verzameld worden, door wie dit wordt gedaan, waarom deze gegevens verzameld worden en naar wie de gegevens gestuurd worden. Dit wordt vaak gedaan in de vorm van een privacyverklaring.

Voor minderjarigen (in Nederland tot 16) is toestemming van een ouder/voogd vereist.

### Gegevensverzameling voor Starshop
Volgens de AVG mag Starshop de volgende gegevens verzamelen:
-	Volledige naam
-	Emailadres
-	Wachtwoord (vergrendeld in hashing)
-	Adres (indien bezorging fysieke producten)

Deze gegevens mogen verzameld worden indien er een geldige reden hiervoor is:
-	Geslacht
-	Land
-	Haar- en oogkleur

De huidskleur mag nooit verzameld worden aangezien deze valt onder de speciale categorieën persoonsgegevens. Aangezien 1-mula geen geldige reden heeft om de haar- en oogkleur te verzamelen, is dit ook niet toegestaan. Er moet overlegd worden met de product owners, of er een geldige reden is het geslacht en het land te verzamelen.

Er moet een privacyverklaring worden opgesteld, waarin aan de klant wordt uitgelegd welke gegevens verzameld worden bij het maken van een account, wat hiermee precies gedaan wordt, wie hier toestemming tot heeft en hoelang de gegevens opgeslagen blijven. Hier moet de gebruiker mee akkoord gaan voordat zij een account aan kunnen maken.

### Gesprek met de product owner
8 mei 2025 heeft er een gesprek plaats gevonden tussen Folkert, een van de product owners van Starshop, en Anne Bakker, een van de developers van Starshop. Hierin is alles besproken wat er uit het onderzoek is gekomen, en is er gevraagd om de reden van het verzamelen van gegevens, en wat er met deze gegevens gedaan wordt. De product owner is het eens met het verzamelen van de volledige naam, de email en het wachtwoord in hashing. Het adres is op dit moment niet nodig, aangezien er geen fysieke producten verkocht worden. De product owner is het ook eens met het verzamelen van het geslacht en het land van de gebruiker, en wil dit gebruiken om gebruikers gepersonaliseerde aanbiedingen te geven. De product owners gaan overleggen of er ook iets anders mee gedaan gaat worden. De huids-, haar- en oogkleur worden niet verzameld. Er worden voorwaarden geschreven waarin alles wordt omschreven, en hier moet de gebruiker mee akkoord gaan om een account aan te maken.

### Conclusie
Uit het onderzoek blijken de volgende best practices voor de gegevensverzameling bij een webshop:

1.	Minimale gegevensverzameling
-	Alleen noodzakelijke gegevens verzamelen
-	Bij alle verzamelde gegevens een aantoonbaar doel hebben

2.	Transparantie
-	Volledige openheid over de verzamelde gegevens
-	Privacyverklaring die makkelijk te vinden is voor gebruikers
-	Duidelijke communicatie over het gebruik van de gegevens

3.	Gebruikers toegang geven tot eigen gegevens
-	Mogelijkheid tot het inzien en bekijken van gegevens
-	Eenvoudige manier om gegevens te verwijderen
-	Toestemming verzameling gegevens verplicht om een account aan te maken

4.	Bescherming van gegevens
-	Gevoelige gegevens versleuteld opslaan
-	Beperkte toegang tot gegevens

5.	Naleving van de wet
-	AVG-richtlijnen volgen
-	Speciale categorieën gegevens niet verzamelen
-	Minderjarigen beschermen door toestemming ouder/voogd te vragen

Door deze practices te blijven volgen, kan Starshop de gegevensverzameling uitvoeren op een manier die ethisch verantwoord is en gefocust is op de bescherming van privacy, toestemming en gebruikersbelang.

## Bronnen
Interview met PO (Anne, Milan, Lisa, Francesco [1-Mula], Interviewer). (2025, April 4). Gitlab. https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/student-projecten/2024-2025/out-f-cs-se/blok-4/naagooxeekuu77/-/blob/main/docs/testresultaten/interviewPO.md?ref_type=heads

Fellinger, E. (n.d.). Ethiek - Knowledgebase. https://knowledgebase.hbo-ict-hva.nl/2_professional_skills/toekomstgericht_organiseren/ethiek/0_to_ethiek/

AVG | Algemene Verordening Gegevensbescherming - Your Europe. (2022, January 1). Your Europe. https://europa.eu/youreurope/business/dealing-with-customers/data-protection/data-protection-gdpr/index_nl.htm

Ministerie van Algemene Zaken. (2024, November 18). Handleiding Algemene verordening gegevensbescherming (AVG). Rapport | Rijksoverheid.nl. https://www.rijksoverheid.nl/documenten/rapporten/2018/01/22/handleiding-algemene-verordening-gegevensbescherming

## Bijlagen
### Bijlage 1: Gebruikersonderzoek gegevensverzameling
![Image](Images/firstName.png)\
![Image](Images/fullName.png)\
![Image](Images/email.png)\
![Image](Images/phoneNumber.png)\
![Image](Images/gender.png)\
![Image](Images/country.png)\
![Image](Images/haircolor.png)\
![Image](Images/eyecolor.png)\
![Image](Images/skincolor.png)
