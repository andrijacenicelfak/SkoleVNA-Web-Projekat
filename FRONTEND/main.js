import { Skola } from "./Skola.js";
import { AktivnostForma } from "./AktivnostForma.js";
import { UcenikForma } from "./UcenikForma.js";
import { kreirajOpcijuZaSelekt } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { NastavnikForma } from "./NastavnikForma.js";

let sveSkole = [];

ucitajSkole();
kreirajStranicu();

function kreirajStranicu() {
    let stranica = document.createElement("div");
    stranica.className = "stranica";
    document.body.appendChild(stranica);

    let gornjiBar = document.createElement("div");
    gornjiBar.className = "gornjiBar";
    stranica.appendChild(gornjiBar);

    let naslovDiv = document.createElement("div");
    naslovDiv.className = "divGBNaslov";

    let naslov = document.createElement("label");
    naslov.innerHTML = "Škole van nastavnih aktivnosti";
    naslov.className = "lblNaslov";
    naslovDiv.appendChild(naslov);
    gornjiBar.appendChild(naslovDiv);

    let divSelectSkole = document.createElement("div");
    divSelectSkole.className = "divKontrola";
    gornjiBar.appendChild(divSelectSkole);

    let divLblSkole = document.createElement("div");
    divLblSkole.className = "divKontrolaNaslov";
    let lblSkole = document.createElement("label");
    lblSkole.innerHTML = "Škole "
    lblSkole.className = "lblKontrolaNaslov";
    divLblSkole.appendChild(lblSkole);
    divSelectSkole.appendChild(divLblSkole);

    let selectSkole = document.createElement("select");
    selectSkole.className = "selKontrola";
    selectSkole.id = "selectSkole";
    selectSkole.onchange = (ev) => {
        let sel = document.getElementById("selectKontrolee");
        switch (sel.selectedIndex) {
            case 0:
                prikazZaAktivnosti();
                break;
            case 1:
                prikazZaUcenike();
                break;
            default:
                prikazNastavnici();
                break;
        }

    }
    divSelectSkole.appendChild(selectSkole);

    let navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    gornjiBar.appendChild(navigacija);
    kreairajNavigaciju(navigacija);

    let sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);



    let sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sadrzaj.id = "sadrzaj";
    sredina.appendChild(sadrzaj);
    let donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);

    let lblDB = document.createElement("label");
    lblDB.innerHTML = "Copyright © 2021 - 2022 Andrija Cenic 18042";
    donjiBar.appendChild(lblDB);
}
function kreairajNavigaciju(nav) {
    let selekcija = document.createElement("select");
    selekcija.className = "selKontrola";
    selekcija.id = "selectKontrolee"
    selekcija.appendChild(kreirajOpcijuZaSelekt("Aktivnosti", 1));
    selekcija.appendChild(kreirajOpcijuZaSelekt("Učenici", 2));
    selekcija.appendChild(kreirajOpcijuZaSelekt("Nastavnici", 3));

    selekcija.onchange = (e) => {
        switch (selekcija.selectedIndex) {
            case 0:
                prikazZaAktivnosti();
                break;
            case 1:
                prikazZaUcenike();
                break;
            default:
                prikazNastavnici();
                break;
        }
    };
    nav.appendChild(selekcija);
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
        if (!s.ok) {
            window.alert("Nije moguce ucitati skole!");
        } else {
            s.json().then(skole => {
                skole.forEach(skola => {
                    let sk = new Skola(skola.id, skola.naziv, skola.tip);
                    sveSkole.push(sk);
                });
                upisiSkole();
                prikazZaAktivnosti();
            });
        }
    });
}

function prikazZaUcenike() {
    let sadrzaj = document.getElementById("sadrzaj");
    removeAllChildNodes(sadrzaj);

    let ucenikForma = new UcenikForma();
    ucenikForma.crtaj(sadrzaj);
}
