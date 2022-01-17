import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
import { Nastavnik } from "./Nastavnik.js";
import { kreirajDiviLabel, kreirajDivTextITextBox } from "./funkcije.js";
import { kreirajDivButton } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { kreirajDivDvaDugmeta } from "./funkcije.js";
import { kreirajDivSaLbliLblSaIDjem } from "./funkcije.js";

export class AktivnostForma {
    constructor() {
        this.listaAktivnosti = [];
        this.listaUcenika = [];
        this.nastavnik = new Nastavnik(-1, "", "", 0, 0);
        this.listaNastavnika = [];
    }
    izbrisiAktivnost(AktivnostID) {
        if (confirm("Stvarno zelis da obrises ovu aktivnost?")) {
            fetch("https://localhost:5001/Aktivnost/ObrisiAktivnost/" + AktivnostID, { method: "DELETE" }).then(p => {
                if (!p.ok) {
                    window.alert("Nije moguce obrisati aktivnost!");
                }
                this.pribaviAktivnosti();
            });
        }
    }
    dodajAktivnost() {
        let slSkole = document.getElementById("selectSkole");
        let skolaID = slSkole.options[slSkole.selectedIndex].value;

        let selNastavnik = document.getElementById("selectNastavnik");
        let NastavnikID = selNastavnik.options[selNastavnik.selectedIndex].value;

        let Naziv = document.getElementById("aktivnostNaziv");
        let BrojDana = document.getElementById("aktivnostBrojDana");
        let Cena = document.getElementById("aktivnostCena");

        fetch("https://localhost:5001/Aktivnost/DodajAktivnost/" + Naziv.value + "/" + Cena.value + "/" + skolaID + "/" + BrojDana.value + "/" + NastavnikID, { method: "POST" }).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce dodati aktivnost!");
            }
            this.pribaviAktivnosti();
            Naziv.value = "";
            BrojDana.value = "";
            Cena.value = "";
        });

    }
    pribaviNastavnike() {
        let slSkole = document.getElementById("selectSkole");
        let skolaID = slSkole.options[slSkole.selectedIndex].value;
        this.listaNastavnika.length = 0;
        fetch("https://localhost:5001/Nastavnik/VratiNastavnike/" + skolaID).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti nastavnike!");
            } else {
                p.json().then(nastavnici => {
                    nastavnici.forEach(nastavnik => {
                        this.listaNastavnika.push(new Nastavnik(nastavnik.id, nastavnik.ime, nastavnik.prezime, nastavnik.ocena, nastavnik.brojAktivnosti));

                    });
                    let selNastavnik = document.getElementById("selectNastavnik");
                    removeAllChildNodes(selNastavnik);
                    this.listaNastavnika.forEach(nastavnik => {
                        let nop = document.createElement("option");
                        nop.innerHTML = nastavnik.Ime + " " + nastavnik.Prezime;
                        nop.value = nastavnik.ID;
                        selNastavnik.appendChild(nop);
                    });
                });
            }
        });
    }
    zameniNastavnikaTr(AktivnostID) {
        let selNastavnik = document.getElementById("selectNastavnik");
        let NastavnikID = selNastavnik.options[selNastavnik.selectedIndex].value;

        fetch("https://localhost:5001/Aktivnost/ZameniNastavnika/" + AktivnostID + "/" + NastavnikID, { method: "PUT" }).then(p => {
            if (!p.ok) {
                window.alert("Nijem oguce zameniti trenutnog nastavnika!");
            }
            this.pribaviAktivnosti();
        });

    }
    upisiOcenuUceniku(AktivnostID) {
        let ucenikID = document.getElementById("selektovanRed");
        let ocena = document.getElementById("ocenaUpis");
        if (ucenikID != null) {
            fetch("https://localhost:5001/Pohadja/UpisiOcenu/" + ucenikID.value + "/" + AktivnostID + "/" + ocena.value, { method: 'PUT' })
                .then(p => {
                    if (!p.ok) {
                        window.alert("Nije moguce upisati ocenu uceniku!");
                    }
                    this.nadjiUcenikeUpisaneNaAktivnost(AktivnostID);
                    ocena.value = "";
                });
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
    }
    pribaviAktivnosti() {
        let slSkole = document.getElementById("selectSkole");
        let skolaID = slSkole.options[slSkole.selectedIndex].value;
        this.listaAktivnosti.length = 0;

        fetch("https://localhost:5001/Aktivnost/VratiAktivnostiZaSkolu/" + skolaID).then(p => {
            p.json().then(aktivnosti => {
                if (!p.ok) {
                    window.alert("Nije moguce privaviti aktivnosti!");
                } else {
                    aktivnosti.forEach(a => {
                        let akt = new Aktivnost(a.aktivnostID, a.aktivnostNaziv, a.aktivnostCena, a.nastavnikID, a.aktivnostBrojDana);
                        this.listaAktivnosti.push(akt);
                    });
                    this.updateListuAktivnosti();
                    this.updateInfo();
                }
            });
        });

    }
    nadjiUcenikeUpisaneNaAktivnost(idAktivnosti) {
        this.listaUcenika.length = 0;
        fetch("https://localhost:5001/Pohadja/PreuzmiUcenikeUpisaneNaAktivnost/" + idAktivnosti).then(p => {
            p.json().then(ucenici => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti ucenike!");
                } else {
                    ucenici.forEach(ucenik => {
                        let placanje = "";
                        if (ucenik.trebaDaPlati > 0)
                            placanje = " ----- treba da plati!";
                        let uc = new Ucenik(ucenik.ucenikID, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, idAktivnosti, ucenik.poslednjiDatumPlacanje + placanje, ucenik.ocena);
                        this.listaUcenika.push(uc);
                    });
                    this.updateListuUcenika();
                    this.updateInfo();
                }
            });
        });

    }
    uplatiZaUcenika(aktivnostID) {
        let ucenikID = document.getElementById("selektovanRed");
        if (ucenikID != null) {
            fetch("https://localhost:5001/Pohadja/Uplati/" + ucenikID.value + "/" + aktivnostID, { method: 'PUT' })
                .then(p => {
                    if (!p.ok) {
                        window.alert("Nije moguce uplatiti aktivnost za ucenika!");
                    }
                    this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID);
                });
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
    }
    ispisiUcenika(aktivnostID) {
        let ucenikID = document.getElementById("selektovanRed");
        if (ucenikID != null) {
            if (confirm("Da li stvarno zelis da ispises ucenika?")) {
                fetch("https://localhost:5001/Pohadja/IspisiUcenikaOdAktivnosti/" + ucenikID.value + "/" + aktivnostID, { method: 'DELETE' })
                    .then(p => {
                        if (!p.ok) {
                            window.alert("Nije moguce ispisati ucenika!");
                        }
                        this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID);
                    });
            }
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
    }
    updateInfo() {
        let selectAktivnost = document.getElementById("selectAktivnost");
        let index = selectAktivnost.selectedIndex;
        let aktivnost = this.listaAktivnosti[index];

        fetch("https://localhost:5001/Nastavnik/VratiNastavnika/" + aktivnost.NastavnikID).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti nastavnika!");
            } else {
                p.json().then(n => {
                    this.nastavnik.ID = n.id;
                    this.nastavnik.Ime = n.ime;
                    this.nastavnik.Prezime = n.prezime;
                    this.nastavnik.ocena = n.ocena;
                    this.dodajInfo();
                });
            }
        });

    }
    updateListuAktivnosti() {
        let selectAktivnost = document.getElementById("selectAktivnost");
        removeAllChildNodes(selectAktivnost);
        let aktivnost;
        this.listaAktivnosti.forEach(akt => {
            aktivnost = document.createElement("option");
            aktivnost.innerHTML = akt.Naziv;
            aktivnost.value = akt.ID;
            selectAktivnost.appendChild(aktivnost);
        });
        this.nadjiUcenikeUpisaneNaAktivnost(selectAktivnost.options[selectAktivnost.selectedIndex].value);
        this.updateInfoNastavnik();
        this.updateInfo();
    }
    updateListuUcenika() {
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
                    if (p.className != "zaglavlje")
                        p.className = "redUTabeli";
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

            //Ocena

            let ocena = document.createElement("td");
            if (ucenik.Ocena === 0) {
                ocena.innerHTML = "Nije ocenjen!";
            } else {
                ocena.innerHTML = ucenik.Ocena;
            }
            red.appendChild(ocena);

            //Ime roditelja

            let irod = document.createElement("td");
            irod.innerHTML = ucenik.ImeRoditelja;
            red.appendChild(irod);

            //Broj telefona roditelja

            let br = document.createElement("td");
            br.innerHTML = ucenik.BrojTelefonaRoditelja;
            red.appendChild(br);

            //Datum poslednje uplate

            let dtm = document.createElement("td");
            dtm.innerHTML = ucenik.datumPoslednjegPlacanja;
            red.appendChild(dtm);
        });
    }
    dodajKontrolu(kontrola) {
        let aktivnostSelectDiv = document.createElement("div");
        aktivnostSelectDiv.classList += "divKontrola";
        kontrola.appendChild(aktivnostSelectDiv);

        let lblAktivnost = document.createElement("label");
        lblAktivnost.innerHTML = "Aktivnost";
        lblAktivnost.classList += "lblKontrola";
        aktivnostSelectDiv.appendChild(lblAktivnost);


        let selectAktivnosti = document.createElement("select");
        selectAktivnosti.className += "selKontrola";
        selectAktivnosti.id = "selectAktivnost"
        selectAktivnosti.onchange = (ev) => {
            let aktivnostID = selectAktivnosti.options[selectAktivnosti.selectedIndex].value;
            this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID);
            this.updateInfoNastavnik();
        }
        aktivnostSelectDiv.appendChild(selectAktivnosti);

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Broj dana :", "lblBrojDanaAktivnost", "lblKontrola"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Cena :", "lblCenaAkt", "lblKontrola"));

        kontrola.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Nastavnik", "lblKontrola lblKontrolaNaslov"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Ime :", "imeNastavnik", "lblKontrola"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Prezime :", "prezimeNastavnik", "lblKontrola"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Ocena :", "ocenaNastavnik", "lblKontrola"));

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

        //Ocena

        el = document.createElement("th");
        el.innerHTML = "Ocena"
        red.appendChild(el);

        //Ime roditelja

        el = document.createElement("th");
        el.innerHTML = "Ime Roditelja"
        red.appendChild(el);

        //Broj telefona rod

        el = document.createElement("th");
        el.innerHTML = "Broj Telefona Roditelja";
        red.appendChild(el);

        //Datum posljednje uplate

        el = document.createElement("th");
        el.innerHTML = "Datum Poslednje Uplate"
        red.appendChild(el);
    }
    dodajTabelu(divTabela) {
        let tabela = document.createElement("table");

        tabela.className = "tabela";
        tabela.id = "tabela";
        divTabela.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);

    }
    dodajInfo() {
        let ime = document.getElementById("imeNastavnik");
        ime.innerHTML = this.nastavnik.Ime;

        let prezime = document.getElementById("prezimeNastavnik");
        prezime.innerHTML = this.nastavnik.Prezime;

        let isk = document.getElementById("ocenaNastavnik");
        isk.innerHTML = this.nastavnik.ocena + "/ 10";
    }
    dodajInfoKontrolu(host) {

        let selectAktivnosti = document.getElementById("selectAktivnost");
        host.appendChild(kreirajDivButton("btnKontrola", "Uplati", "divKontrola", (ev) => {
            this.uplatiZaUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        }));

        host.appendChild(kreirajDivButton("btnKontrola", "Ispisi sa aktivnosti", "divKontrola", (ev) => {
            this.ispisiUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        }));

        host.appendChild(kreirajDivTextITextBox("Ocena", "lbKontrola", "tbxKontrola", "number", "ocenaUpis", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Upiši Ocenu", "divKontrola", (ev) => { this.upisiOcenuUceniku(selectAktivnosti.options[selectAktivnosti.selectedIndex].value); }));

        host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Aktivnosti", "lblKontrola lblKontrolaNaslov"));

        host.appendChild(kreirajDivTextITextBox("Naziv", "lblKontrola", "tbxKontrola", "text", "aktivnostNaziv", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Broj Dana", "lblKontrola", "tbxKontrola", "number", "aktivnostBrojDana", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Cena", "lblKontrola", "tbxKontrola", "numver", "aktivnostCena", "divKontrola"));

        let divSelNastavnik = document.createElement("div");
        divSelNastavnik.className = "divKontrola";

        let lblSelNastavnik = document.createElement("label");
        lblSelNastavnik.className = "lblKontrola";
        lblSelNastavnik.innerHTML = "Nastavnik";
        divSelNastavnik.appendChild(lblSelNastavnik);

        let selNastavnik = document.createElement("select");
        selNastavnik.className = "selKontrola";
        selNastavnik.id = "selectNastavnik";
        divSelNastavnik.appendChild(selNastavnik);

        host.appendChild(divSelNastavnik);

        host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Dodaj Aktivnost", (e) => { this.dodajAktivnost(); }, "btnKontrola", "Zameni Nastavnika Trenutnoj Aktivnosti", (e) => { this.zameniNastavnikaTr(selectAktivnosti.options[selectAktivnosti.selectedIndex].value); }));
        host.appendChild(kreirajDivButton("btnKontrola", "Izbriši Aktivnost", "divKontrola", (e) => { this.izbrisiAktivnost(selectAktivnosti.options[selectAktivnosti.selectedIndex].value); }));
        this.pribaviNastavnike();
    }
    updateInfoNastavnik() {
        let lblBrDanaAkt = document.getElementById("lblBrojDanaAktivnost");
        let lblCena = document.getElementById("lblCenaAkt");
        let selectAktivnost = document.getElementById("selectAktivnost");
        let index = selectAktivnost.selectedIndex;
        let aktivnost = this.listaAktivnosti[index];
        lblBrDanaAkt.innerHTML = aktivnost.BrojDanaUNedelji;
        lblCena.innerHTML = aktivnost.Cena;
    }
    crtaj(host) {

        let kontrola = document.createElement("div");
        kontrola.classList += "kontrola";
        host.appendChild(kontrola);

        this.dodajKontrolu(kontrola);

        let divTabela = document.createElement("div");
        divTabela.classList += "divTabela";
        host.appendChild(divTabela);

        this.dodajTabelu(divTabela);

        let info = document.createElement("div");
        info.className = "kontrola";
        host.appendChild(info);

        this.dodajInfoKontrolu(info);

        this.pribaviAktivnosti();
    }
}