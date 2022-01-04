import { Ucenik } from "./Ucenik.js";
import { Skola } from "./Skola.js";
import { AktivnostForma } from "./AktivnostForma.js";
import { UcenikForma } from "./UcenikForma.js";
import { kreirajDivButton } from "./funkcije.js";
import { NastavnikForma } from "./NastavnikForma.js";

let sveSkole = [];

ucitajSkole();
kreirajStranicu();
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function kreirajStranicu() {
    let stranica = document.createElement("div");
    stranica.className = "stranica";
    document.body.appendChild(stranica);

    let gornjiBar = document.createElement("div");
    gornjiBar.className = "gornjiBar";
    stranica.appendChild(gornjiBar);
    let naslovDiv = document.createElement("div");

    let naslov = document.createElement("label");
    naslov.innerHTML = "Skole van nastavnih aktivnosti";
    naslovDiv.appendChild(naslov);
    gornjiBar.appendChild(naslovDiv);

    let divSelectSkole = document.createElement("div");
    gornjiBar.appendChild(divSelectSkole);

    let lblSkole = document.createElement("label");
    lblSkole.innerHTML = "Skole "
    lblSkole.classList += "lblKontrola";
    divSelectSkole.appendChild(lblSkole);

    let selectSkole = document.createElement("select");
    selectSkole.className = "selectKontrola";
    selectSkole.id = "selectSkole";
    selectSkole.onchange = (ev) => {
        prikazZaAktivnosti();
    }
    divSelectSkole.appendChild(selectSkole);

    let sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);

    let navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    sredina.appendChild(navigacija);

    let sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sadrzaj.id = "sadrzaj";
    sredina.appendChild(sadrzaj);
    kreairajNavigaciju(navigacija);

    let donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);
}
function kreairajNavigaciju(nav) {

    nav.appendChild(kreirajDivButton("btnKontrola", "Aktivnosti", "divKontrola", prikazZaAktivnosti));

    nav.appendChild(kreirajDivButton("btnKontrola", "Ucenici", "divKontrola", prikazZaUcenike));

    nav.appendChild(kreirajDivButton("btnKontrola", "Nastavnici", "divKontrola", prikazNastavnici));
}
function prikazNastavnici() {
    let sadrzaj = document.getElementById("sadrzaj");
    removeAllChildNodes(sadrzaj);

    let nastForma = new NastavnikForma();
    nastForma.crtaj(sadrzaj);
}
function prikazZaAktivnosti() {
    let sadrzaj = document.getElementById("sadrzaj");
    removeAllChildNodes(sadrzaj);

    let aktForma = new AktivnostForma();
    aktForma.crtaj(sadrzaj);

}
function upisiSkole() {
    let slSkole = document.getElementById("selectSkole");

    sveSkole.forEach(sk => {
        let skola = document.createElement("option");
        skola.innerHTML = sk.Naziv;
        skola.value = sk.ID;
        slSkole.appendChild(skola);
    })
}
function ucitajSkole() {
    fetch("https://localhost:5001/Skola/PreuzmiSkole").then(s => {
        s.json().then(skole => {
            skole.forEach(skola => {
                let sk = new Skola(skola.id, skola.naziv, skola.tip);
                sveSkole.push(sk);
            });
            upisiSkole();
            prikazZaAktivnosti();
        });

    });
}

function prikazZaUcenike() {
    let sadrzaj = document.getElementById("sadrzaj");
    removeAllChildNodes(sadrzaj);

    let ucenikForma = new UcenikForma();
    ucenikForma.crtaj(sadrzaj);

    //console.log("UCENICI");
}
