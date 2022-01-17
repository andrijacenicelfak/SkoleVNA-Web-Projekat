# SkoleVNA-Web-Projekat
## Projekat za Web Programiranje: Skole Van Nastavnih Aktivnosti

###### O projektu:

Aplikacija koja se koristi kao evidencija u skolama van nastavnih aktivnosti.
U gornjem delu aplikacije postoji mogućnost selekcije trenutno škole.
Sledeća je selekcija prikaza. Postoje 3 prikaza:
1. **Aktivnosti** : Prikazuje aktivnosti u trenutnoj izabranoj školi kao i selekciju aktivnosti.
Prikazuje informacije o aktivnosti kao i informacije o nastavniku za tu aktivnost.
U srednjem delu je tabela koja prikazuje informacije o učenicima koji pohadjaju trenutnu izabranu aktivnost.
Poslednji deo je kontrolni deo. U ovom delu je moguće uplatiti aktivnost za odredjenog učenika, ispisati učenika od trenutne izabrane aktivnosti,
upisati ocenu učeniku (0 - Nije ocenjen, 1 - 5).
Moguće je dodati novu aktivnost, takodje je moguće zameniti nastavnika za aktivnost i moguće je izbrisati aktivnost.
2. **Učenici** : Sa leve strane prikaza forma za dodavanje novog učenika, u sredini prikaz učenika, po default-u je prikaz učenika koji nisu upisani na aktivnost. 
Sa desne strane selekcija aktivnosti za upis učenika, i pretraživanje učenika po broju telefono kao i prikaz učenika bez aktivnosti, takođe i dugme za brisanje selektovanog učenika.
3. **Nastavnici** : Sa leve strane forma za dodavanje nogog nastavnika, u sredini prikaz nastavnika u školi i nastanika koji ne drže aktivnosti, sa desne strane prikaz za zamenu ocene nastavnika kao i dugme za brisanje nastavnika(nastavnika nije moguće obrisati ako drže neku aktivnost).


###### Problemi:
1. U slucaju browsera Edge : *GET https://localhost:5001/Skola/PreuzmiSkole net::ERR_CERT_AUTHORITY_INVALID*.Kod Firefox-a radi sve, ovde nece.

2. Textbox elementi sa type = "number" omogućuju da se u njima upise i text -> Mozda je samo problem na Firefox-u, ne mogu da testiram na Edge-u

3. Problem sa pribavljanjem informacija sa servera pri pokretanju prvi put.
