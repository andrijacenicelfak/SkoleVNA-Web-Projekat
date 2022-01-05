import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
import { Nastavnik } from "./Nastavnik.js";
import { kreirajDivTextITextBox } from "./funkcije.js";
import { kreirajDivButton } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { kreirajDiviLabel } from "./funkcije.js";


export class NastavnikForma {
    constructor() {
        this.listaNastavnika = [];
    }
    izbrisiNastavnika() {
        let NastavnikID = document.getElementById("selektovanRed").value;
        fetch("https://localhost:5001/Nastavnik/IzbrisiNastavnika/" + NastavnikID, { method: "DELETE" }).then(p => {
            if (!p.ok) {
                alert("Nije moguce obrisati nastavnika!");
            } else {
                this.pribaviNastavnike();
            }
        });
    }
    zameniIskustvo() {
        let tbxIskustvo = document.getElementById("iskustvoNastavnikaNovo");
        let iskustvo = tbxIskustvo.value;
        tbxIskustvo.value = "";
        let NastavnikID = document.getElementById("selektovanRed").value;

        fetch("https://localhost:5001/Nastavnik/ZameniIskustvo/" + NastavnikID + "/" + iskustvo, { method: "PUT" }).then(p => {
            this.pribaviNastavnike();
        });
    }
    pribaviNastavnike() {
        let slSkole = document.getElementById("selectSkole");
        let skolaID = slSkole.options[slSkole.selectedIndex].value;
        this.listaNastavnika.length = 0;
        fetch("https://localhost:5001/Nastavnik/VratiNastavnike/" + skolaID).then(p => {
            p.json().then(nastavnici => {
                nastavnici.forEach(nastavnik => {
                    this.listaNastavnika.push(new Nastavnik(nastavnik.id, nastavnik.ime, nastavnik.prezime, nastavnik.iskustvo, nastavnik.brojAktivnosti));

                });
                this.updateTabelu();
            });
        })
    }
    dodajNastavnika() {
        let ime = document.getElementById("imeNastavnika").value;
        let prezime = document.getElementById("prezimeNastavnika").value;
        let iskustvo = document.getElementById("iskustvoNastavnika").value;
        document.getElementById("imeNastavnika").value = "";
        document.getElementById("prezimeNastavnika").value = "";
        document.getElementById("iskustvoNastavnika").value = "";
        fetch("https://localhost:5001/Nastavnik/DodajNastavnika/" + ime + "/" + prezime + "/" + iskustvo, { method: "POST" }).then(p => { this.pribaviNastavnike(); });
    }

    crtajDivDodaj(host) {
        host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Dodaj novog Nastavnika", "lblKontrola lblKontrolaNaslov"));
        host.appendChild(kreirajDivTextITextBox("Ime", "lblKontrola", "tbxKontrola", "imeNastavnika", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Prezime", "lblKontrola", "tbxKontrola", "prezimeNastavnika", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Iskustvo", "lblKontrola", "tbxKontrola", "iskustvoNastavnika", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Dodaj Nastavnika", "divKontrola", (ev) => { this.dodajNastavnika(); }));
    }

    updateTabelu() {
        let tabelaNastavnika = document.getElementById("tabela");
        removeAllChildNodes(tabelaNastavnika);

        //Brise se sve iza tabele, cak i zaglavlja pa moramo da ponovo dodamo
        this.dodajZaglavljaTabeli(tabelaNastavnika);

        this.listaNastavnika.forEach((nastavnik) => {
            var red = document.createElement("tr");
            red.className = "redUTabeli";

            red.value = nastavnik.ID;

            //Za selekciju, da vidmo ko je red selektovan
            red.addEventListener("click", () => {
                tabelaNastavnika.childNodes.forEach(p => {
                    if (p.className != "zaglavlje") {
                        p.className = "redUTabeli";
                        p.id = "";
                    }
                });
                red.classList += " selektovanRed";
                red.id = "selektovanRed";
            });

            tabelaNastavnika.appendChild(red);
            //Ime

            let ime = document.createElement("td");
            ime.innerHTML = nastavnik.Ime;
            red.appendChild(ime);

            //Prezime

            let prezime = document.createElement("td");
            prezime.innerHTML = nastavnik.Prezime;
            red.appendChild(prezime);

            //Iskustvo

            let irod = document.createElement("td");
            irod.innerHTML = nastavnik.Iskustvo / 1000;
            red.appendChild(irod);

            //Broj Aktivnosti

            let br = document.createElement("td");
            br.innerHTML = nastavnik.BrojAktivnosti;
            red.appendChild(br);
        });
    }

    crtajTabelu(divTabela) {
        let tabela = document.createElement("table");
        tabela.className = "tabela";
        tabela.id = "tabela"
        divTabela.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);
    }
    dodajZaglavljaTabeli(tabela) {

        let red = document.createElement("tr");
        red.className = "zaglavlje"
        tabela.appendChild(red);

        //Ime

        let el = document.createElement("th");
        el.innerHTML = "Ime"
        red.appendChild(el);

        //Prezime

        el = document.createElement("th");
        el.innerHTML = "Prezime"
        red.appendChild(el);

        //Iskustvo

        el = document.createElement("th");
        el.innerHTML = "Iskustvo (x / 10)"
        red.appendChild(el);

        //Broj aktivnosti

        el = document.createElement("th");
        el.innerHTML = "Broj Aktivnosti";
        red.appendChild(el);
    }
    crtajKontrolu(host) {
        host.appendChild(kreirajDivTextITextBox("Iskustvo", "lblKontrola", "tbxKontrola", "iskustvoNastavnikaNovo", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Zameni Iskustvo", "divKontrola", (e) => { this.zameniIskustvo(); }));
        host.appendChild(kreirajDivButton("btnKontrola", "Izbrisi Nastavnika", "divKontrola", (e) => { this.izbrisiNastavnika(); }))
    }
    crtaj(host) {
        let divDodaj = document.createElement("div");
        divDodaj.className = "kontrola";
        host.appendChild(divDodaj);
        this.crtajDivDodaj(divDodaj);

        let divTabela = document.createElement("div");
        divTabela.className = "divTabela";
        host.appendChild(divTabela);
        this.crtajTabelu(divTabela);

        let divKontrola = document.createElement("div");
        divKontrola.className = "kontrola";
        host.appendChild(divKontrola);
        this.crtajKontrolu(divKontrola);

        this.pribaviNastavnike();
    }
}