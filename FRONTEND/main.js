import { Ucenik } from "./Ucenik.js";
import { Skola } from "./Skola.js";
import { AktivnostForma } from "./AktivnostForma.js";
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
    let naslov = document.createElement("label");
    naslov.innerHTML = "Skole van nastavnih aktivnosti";
    gornjiBar.appendChild(naslov);

    let sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);

    let navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    sredina.appendChild(navigacija);

    let sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sredina.appendChild(sadrzaj);
    kreairajNavigaciju(navigacija);

    let donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);
}
function kreairajNavigaciju(nav) {
    let skoleSelectDiv = document.createElement("div");
    skoleSelectDiv.className = "skoleSelectDiv";
    nav.appendChild(skoleSelectDiv);

    let lblSkole = document.createElement("label");
    lblSkole.innerHTML = "Skole "
    lblSkole.classList += "lblKontrola";
    skoleSelectDiv.appendChild(lblSkole);

    let selectSkole = document.createElement("select");
    selectSkole.classList += "selectKontrola";
    selectSkole.onchange = (ev) => {
        prikazZaAktivnosti();
    }
    skoleSelectDiv.appendChild(selectSkole);

    let aktDiv = document.createElement("div");
    aktDiv.className = "navigacijaDugme";
    nav.appendChild(aktDiv);

    let aktivnostDugme = document.createElement("button");
    aktivnostDugme.innerHTML = "Aktivnosti";
    aktivnostDugme.className = "btnNavigacija";
    aktivnostDugme.onclick = prikazZaAktivnosti;
    aktDiv.appendChild(aktivnostDugme);

    let uceniciDiv = document.createElement("div");
    uceniciDiv.className = "navigacijaDugme";
    nav.appendChild(uceniciDiv);

    let uceniciDugme = document.createElement("button");
    uceniciDugme.innerHTML = "Ucenici";
    uceniciDugme.className = "btnNavigacija";
    uceniciDugme.onclick = prikazZaUcenike;
    uceniciDiv.appendChild(uceniciDugme);
}

function prikazZaAktivnosti() {
    let sadrzaj = document.getElementsByClassName("sadrzaj").item(0);
    removeAllChildNodes(sadrzaj);

    let aktForma = new AktivnostForma();
    aktForma.crtaj(sadrzaj);

}
function upisiSkole() {
    let slSkole = document.getElementsByClassName("selectKontrola").item(0);

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
    let sadrzaj = document.getElementsByClassName("sadrzaj").item(0);
    removeAllChildNodes(sadrzaj);


    //console.log("UCENICI");
}