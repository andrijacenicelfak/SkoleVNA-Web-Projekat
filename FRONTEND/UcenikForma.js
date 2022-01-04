import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
import { Nastavnik } from "./Nastavnik.js";
import { kreirajDivTextITextBox } from "./funkcije.js";
import { kreirajDivButton } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";

export class UcenikForma {
    constructor() {
        this.listaUcenika = [];
        this.listaAktivnosti = [];
    }

    pribaviAktivnosti() {
        let slSkole = document.getElementsByClassName("selectKontrola").item(0);
        let skolaID = slSkole.options[slSkole.selectedIndex].value;
        this.listaAktivnosti.length = 0;

        fetch("https://localhost:5001/Aktivnost/VratiAktivnostiZaSkolu/" + skolaID).then(p => {
            p.json().then(aktivnosti => {
                aktivnosti.forEach(a => {
                    let akt = new Aktivnost(a.aktivnostID, a.aktivnostNaziv, a.aktivnostCena, a.nastavnikID, a.aktivnostBrojDana);
                    this.listaAktivnosti.push(akt);
                });

                let selectAktivnost = document.getElementById("selAktivnost");
                let aktivnost;
                this.listaAktivnosti.forEach(akt => {
                    aktivnost = document.createElement("option");
                    aktivnost.innerHTML = akt.Naziv;
                    aktivnost.value = akt.ID;
                    selectAktivnost.appendChild(aktivnost);
                });
            });
        });
    }

    pribaviUcenikeBezAktivnosti() {
        this.listaUcenika.length = 0;
        fetch("https://localhost:5001/Pohadja/VratiUcenikeKojiNisuUpisani").then(p => p.json().then(ucenici => {
            ucenici.forEach(ucenik => {
                let uc = new Ucenik(ucenik.id, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, -1, "");
                this.listaUcenika.push(uc);
            });
            this.updateTabeluUcenika();
        }));
    }

    dodajUcenika() {
        let Ime = document.getElementById("tbxImeKontrola").value;
        let Prezime = document.getElementById("tbxPrezimeKontrola").value;
        let BrojTelefonaRoditelja = document.getElementById("tbxBrojKontrola").value;
        let ImeRoditelja = document.getElementById("tbxImeRoditeljaKontrola").value;
        /* Treba Provara TODO */
        document.getElementById("tbxImeKontrola").value = "";
        document.getElementById("tbxPrezimeKontrola").value = "";
        document.getElementById("tbxBrojKontrola").value = "";
        document.getElementById("tbxImeRoditeljaKontrola").value = "";
        fetch("https://localhost:5001/Ucenik/DodajUcenika/" + Ime + "/" + Prezime + "/" + ImeRoditelja + "/" + BrojTelefonaRoditelja, { method: "POST" }).then(p => {
            this.pribaviUcenikeBezAktivnosti();
        });
    }
    upisiUcenika(AktivnostID) {
        let red = document.getElementById("selektovanRed");
        if (red != null) {
            let UcenikID = red.value;
            fetch("https://localhost:5001/UpisiUcenika/" + UcenikID + "/" + AktivnostID, { method: "POST" }).then(p => {
                this.pribaviUcenikeBezAktivnosti();
            });
        } else {
            window.alert("Selektuj Ucenika!");
        }
    }
    pretraziUcenika() {
        let brTel = document.getElementById("tbxBrojTelefonaPretraga").value;
        if (brTel.length === 0) {
            window.alert("Unesi broj telefona roditelja za pretragu!");
        } else {
            fetch("https://localhost:5001/Ucenik/PretraziUcenike/" + brTel).then(p => {
                if (p.status === 204) {
                    window.alert("Nema takvog ucenika!");
                } else {
                    p.json().then(ucenik => {
                        this.listaUcenika.length = 0;
                        this.listaUcenika.push(new Ucenik(ucenik.id, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, -1, ""));
                        this.updateTabeluUcenika();
                    });
                }
            });
        }
    }
    obrisiUcenika() {
        if (confirm("Da li zelis da izbrises ucenika?")) {
            let red = document.getElementById("selektovanRed");
            if (red != null) {
                let UcenikID = red.value;
                fetch("https://localhost:5001/Ucenik/ObrisiUcenika/" + UcenikID, { method: "DELETE" }).then(p => {
                    console.log(p);
                    this.pribaviUcenikeBezAktivnosti();
                });
            } else {
                window.alert("Selektuj Ucenika!");
            }
        }
    }
    //Crtanje
    crtajDivDodaj(host) {
        host.appendChild(kreirajDivTextITextBox("Ime", "lblKontrola", "tbxKontrola", "tbxImeKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Prezime", "lblKontrola", "tbxKontrola", "tbxPrezimeKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Broj Telefona Roditelja", "lblKontrola", "tbxKontrola", "tbxBrojKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Ime Roditelja", "lblKontrola", "tbxKontrola", "tbxImeRoditeljaKontrola", "divKontrola"));

        let divBtnDodaj = document.createElement("div");
        divBtnDodaj.className = "divKontrola";
        let btnDodaj = document.createElement("button");
        btnDodaj.className = "btnKontrola";
        btnDodaj.innerHTML = "Dodaj Ucenika";
        btnDodaj.onclick = (ev) => { this.dodajUcenika(); }
        divBtnDodaj.appendChild(btnDodaj);
        host.appendChild(divBtnDodaj);

    }
    crtajTabelu(host) {
        let tabela = document.createElement("table");
        tabela.className = "tabela";
        tabela.id = "tabela"
        host.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);
    }

    dodajZaglavljaTabeli(tabela) {
        //Napravi zaglavlje

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

        //Ime roditelja

        el = document.createElement("th");
        el.innerHTML = "Ime Roditelja"
        red.appendChild(el);

        //Broj telefona rod

        el = document.createElement("th");
        el.innerHTML = "Broj Telefona Roditelja";
        red.appendChild(el);
    }

    updateTabeluUcenika() {
        let tabelaUcenika = document.getElementById("tabela");
        removeAllChildNodes(tabelaUcenika);

        //Brise se sve iza tabele, cak i zaglavlja pa moramo da ponovo dodamo
        this.dodajZaglavljaTabeli(tabelaUcenika);

        this.listaUcenika.forEach((ucenik) => {
            var red = document.createElement("tr");
            red.className = "redUTabeli";

            red.value = ucenik.ID;

            //Za selekciju, da vidmo ko je red selektovan
            red.addEventListener("click", () => {
                tabelaUcenika.childNodes.forEach(p => {
                    if (p.className != "zaglavlje") {
                        p.className = "redUTabeli";
                        p.id = "";
                    }
                });
                red.classList += " selektovanRed";
                red.id = "selektovanRed";
            });

            tabelaUcenika.appendChild(red);
            //Ime

            let ime = document.createElement("td");
            ime.innerHTML = ucenik.Ime;
            red.appendChild(ime);

            //Prezime

            let prezime = document.createElement("td");
            prezime.innerHTML = ucenik.Prezime;
            red.appendChild(prezime);

            //Ime roditelja

            let irod = document.createElement("td");
            irod.innerHTML = ucenik.ImeRoditelja;
            red.appendChild(irod);

            //Broj telefona roditelja

            let br = document.createElement("td");
            br.innerHTML = ucenik.BrojTelefonaRoditelja;
            red.appendChild(br);
        });
    }
    crtajKontrolu(host) {
        //selekcija aktivnosti za upis
        let divAktivnost = document.createElement("div");
        divAktivnost.className = "divKontrola";
        host.appendChild(divAktivnost);

        let lblAktivnost = document.createElement("label");
        lblAktivnost.className = "lblKontrola";
        lblAktivnost.innerHTML = "Aktivnost";
        divAktivnost.appendChild(lblAktivnost);

        let selAktivnost = document.createElement("select");
        selAktivnost.className = "selKontrola";
        selAktivnost.id = "selAktivnost";
        divAktivnost.appendChild(selAktivnost);

        //dugme upisi
        host.appendChild(kreirajDivButton("btnKontrola", "Upisi Ucenika", "divKontrola", (ev) => { this.upisiUcenika(selAktivnost.options[selAktivnost.selectedIndex].value); }));

        // broj telefona za pretragu
        host.appendChild(kreirajDivTextITextBox("Broj Telefona", "lblKontrola", "tbxKontrola", "tbxBrojTelefonaPretraga", "divKontrola"));

        //dugme za pretragu
        host.appendChild(kreirajDivButton("btnKontrola", "Pretrazi", "divKontrola", (ev) => { this.pretraziUcenika() }))

        // dugme za prikaz ucenika bez aktivnosti
        host.appendChild(kreirajDivButton("btnKontrola", "Prikazi Ucenike bez Aktivnosti", "divKontrola", (ev) => { this.pribaviUcenikeBezAktivnosti(); }));

        //izbrisi selektovanog ucenika iz skole
        host.appendChild(kreirajDivButton("btnKontrola", "Obrisi Ucenika", "divKontrola", (ev) => { this.obrisiUcenika(); }));

    }
    crtaj(host) {
        let divDodaj = document.createElement("div");
        divDodaj.className = "kontrola";
        host.appendChild(divDodaj);
        this.crtajDivDodaj(divDodaj);

        let divTabela = document.createElement("div");
        divTabela.className = "tabela";
        host.appendChild(divTabela);
        this.crtajTabelu(divTabela);

        let divKontrola = document.createElement("div");
        divKontrola.className = "kontrola";
        host.appendChild(divKontrola);
        this.crtajKontrolu(divKontrola);

        this.pribaviAktivnosti();
        this.pribaviUcenikeBezAktivnosti();
    }
}