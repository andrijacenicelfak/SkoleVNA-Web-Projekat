import { Ucenik } from "./Ucenik.js";
import { Skola } from "./Skola.js";
import { Aktivnost } from "./Aktivnost.js";
var i = 1;

kreirajStranicu();

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function kreirajStranicu() {
    var stranica = document.createElement("div");
    stranica.className = "stranica";
    document.body.appendChild(stranica);

    var gornjiBar = document.createElement("div");
    gornjiBar.className = "gornjiBar";
    stranica.appendChild(gornjiBar);
    var naslov = document.createElement("label");
    naslov.innerHTML = "Skole van nastavnih aktivnosti";
    gornjiBar.appendChild(naslov);

    var sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);

    var navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    sredina.appendChild(navigacija);

    var sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sredina.appendChild(sadrzaj);
    kreairajNavigaciju(navigacija);

    var donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);
}
function kreairajNavigaciju(nav) {
    var uceniciDiv = document.createElement("div");
    uceniciDiv.className = "navigacijaDugme";
    nav.appendChild(uceniciDiv);

    var uceniciDugme = document.createElement("button");
    uceniciDugme.innerHTML = "Ucenici";
    uceniciDugme.className = "btnNavigacija";
    uceniciDugme.onclick = prikazZaUcenike;
    uceniciDiv.appendChild(uceniciDugme);

    var aktDiv = document.createElement("div");
    aktDiv.className = "navigacijaDugme";
    nav.appendChild(aktDiv);

    var aktivnostDugme = document.createElement("button");
    aktivnostDugme.innerHTML = "Aktivnosti";
    aktivnostDugme.className = "btnNavigacija";
    aktivnostDugme.onclick = prikazZaAktivnosti;
    aktDiv.appendChild(aktivnostDugme);
}

function prikazZaUcenike() {
    var sadrzaj = document.getElementsByClassName("sadrzaj").item(0);
    removeAllChildNodes(sadrzaj);

    console.log("UCENICI");
}
function prikazZaAktivnosti() {
    console.log("AKTIVNOSTI")
}


/*
fetch("https://localhost:5001/Ucenik/PreuzmiUcenike").then(p =>
    p.json().then(ucenici => {
        ucenici.forEach(ucenik => {

            var ime = ucenik.ime;
            var prezime = ucenik.prezime;
            var imeRod = ucenik.imeRoditelja;
            var brojTelefonaRoditelja = ucenik.brojTelefonaRoditelja;
            var id = ucenik.id;
            ucenik.listaAktivnosti.forEach(akt => {
                var ucAkt = new Ucenik(id, ime, prezime, brojTelefonaRoditelja, imeRod, akt.id);
                console.log(ucAkt);
            })
            console.log(ucenik);
        });
    })
)

var sveSkole = [];
var sveAktivnosti = [];
fetch("https://localhost:5001/Skola/PreuzmiSkole").then(p => {
    p.json().then(skole => {
        skole.forEach(sk => {
            var skola = new Skola(sk.id, sk.naziv, sk.tip);
            sveSkole.push(skola);
        });
    });
});

function UcitajAktivnosti() {
    fetch("https://localhost:5001/Aktivnost/PreuzmiAktivnostiZaSkolu/" + sveSkole[0].ID).then(p => {
        p.json().then(aktivnosti => {
            aktivnosti.forEach(akt => {
                var aktivnost = new Aktivnost(akt.id, akt.naziv, akt.cena, akt.nastavnikID, akt.brojDanaUNedelji);
                sveAktivnosti.push(aktivnost);
            });
        });
    });
}
UcitajAktivnosti();
console.log(sveSkole);
console.log(sveAktivnosti);
*/
