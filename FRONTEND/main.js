import { Ucenik } from "./Ucenik.js";
import { Skola } from "./Skola.js";
import { AktivnostForma } from "./AktivnostForma.js";
import { UcenikForma } from "./UcenikForma.js";
import { kreirajDivButton } from "./funkcije.js";
import { kreirajOpcijuZaSelekt } from "./funkcije.js";
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
    naslovDiv.className = "divGBNaslov";

    let naslov = document.createElement("label");
    naslov.innerHTML = "Skole van nastavnih aktivnosti";
    naslov.className = "lblNaslov";
    naslovDiv.appendChild(naslov);
    gornjiBar.appendChild(naslovDiv);

    let divSelectSkole = document.createElement("div");
    divSelectSkole.className = "divKontrola";
    gornjiBar.appendChild(divSelectSkole);

    let lblSkole = document.createElement("label");
    lblSkole.innerHTML = "Skole "
    lblSkole.className = "lblGornjiBar";
    divSelectSkole.appendChild(lblSkole);

    let selectSkole = document.createElement("select");
    selectSkole.className = "selKontrola";
    selectSkole.id = "selectSkole";
    selectSkole.onchange = (ev) => {
        prikazZaAktivnosti();
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
}
function kreairajNavigaciju(nav) {
    /*
        nav.appendChild(kreirajDivButton("btnKontrola", "Aktivnosti", "divKontrola", prikazZaAktivnosti));
    
        nav.appendChild(kreirajDivButton("btnKontrola", "Ucenici", "divKontrola", prikazZaUcenike));
    
        nav.appendChild(kreirajDivButton("btnKontrola", "Nastavnici", "divKontrola", prikazNastavnici));
        */
    let selekcija = document.createElement("select");
    selekcija.className = "selKontrola";
    selekcija.appendChild(kreirajOpcijuZaSelekt("Aktivnosti", 1));
    selekcija.appendChild(kreirajOpcijuZaSelekt("Ucenici", 2));
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
    let btn = document.getElementsByClassName("btnKontrola");
    /*
    btn.item(2).className = "btnKontrola btnSelected";
    btn.item(0).className = "btnKontrola";
    btn.item(1).className = "btnKontrola";
*/
    let nastForma = new NastavnikForma();
    nastForma.crtaj(sadrzaj);
}
function prikazZaAktivnosti() {
    let sadrzaj = document.getElementById("sadrzaj");
    removeAllChildNodes(sadrzaj);
    /*
    let btn = document.getElementsByClassName("btnKontrola");
    btn.item(0).className = "btnKontrola btnSelected";
    btn.item(1).className = "btnKontrola";
    btn.item(2).className = "btnKontrola";*/

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
    /*
    let btn = document.getElementsByClassName("btnKontrola");
    btn.item(1).className = "btnKontrola btnSelected";
    btn.item(0).className = "btnKontrola";
    btn.item(2).className = "btnKontrola";
*/
    let ucenikForma = new UcenikForma();
    ucenikForma.crtaj(sadrzaj);

    //console.log("UCENICI");
}
