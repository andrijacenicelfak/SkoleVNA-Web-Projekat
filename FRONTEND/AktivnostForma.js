import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
import { Nastavnik } from "./Nastavnik.js";
import { kreirajDivTextITextBox } from "./funkcije.js";
import { kreirajDivButton } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";

export class AktivnostForma {
    constructor() {
        this.listaAktivnosti = [];
        this.listaUcenika = [];
        this.nastavnik = new Nastavnik(-1, "", "", 0);
    }
    updateListuAktivnosti() {
        let selectAktivnost = document.getElementById("selectAktivnost");
        let aktivnost;
        this.listaAktivnosti.forEach(akt => {
            aktivnost = document.createElement("option");
            aktivnost.innerHTML = akt.Naziv;
            aktivnost.value = akt.ID;
            selectAktivnost.appendChild(aktivnost);
        });
        this.nadjiUcenikeUpisaneNaAktivnost(selectAktivnost.options[selectAktivnost.selectedIndex].value);
        this.updateInfoNastavnik();
    }

    pribaviAktivnosti() {
        let slSkole = document.getElementsByClassName("selectKontrola").item(0);
        //console.log(slSkole.options[slSkole.selectedIndex].value);
        let skolaID = slSkole.options[slSkole.selectedIndex].value;
        this.listaAktivnosti.length = 0;

        fetch("https://localhost:5001/Aktivnost/VratiAktivnostiZaSkolu/" + skolaID).then(p => {
            p.json().then(aktivnosti => {
                aktivnosti.forEach(a => {
                    let akt = new Aktivnost(a.aktivnostID, a.aktivnostNaziv, a.aktivnostCena, a.nastavnikID, a.aktivnostBrojDana);
                    this.listaAktivnosti.push(akt);
                    //console.log(akt);
                });
                this.updateListuAktivnosti();
                this.updateInfo();
            });
        });

    }
    nadjiUcenikeUpisaneNaAktivnost(idAktivnosti) {
        this.listaUcenika.length = 0;
        fetch("https://localhost:5001/Pohadja/PreuzmiUcenikeUpisaneNaAktivnost/" + idAktivnosti).then(p => {
            p.json().then(ucenici => {
                ucenici.forEach(ucenik => {
                    let uc = new Ucenik(ucenik.ucenikID, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, idAktivnosti, ucenik.poslednjiDatumPlacanje);
                    this.listaUcenika.push(uc);
                    //console.log(uc);
                });
                this.updateListuUcenika();
                this.updateInfo();
            });
        });

    }
    updateListuUcenika() {
        let tabelaUcenika = document.getElementsByClassName("tabela").item(0);
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

        let divBrojDana = document.createElement("div");
        divBrojDana.className = "divKontrola";

        let lblBrDana = document.createElement("label");
        lblBrDana.className = "lblKontrola";
        lblBrDana.innerHTML = "Broj dana :";
        divBrojDana.appendChild(lblBrDana);

        let lblBrDanaAkt = document.createElement("label");
        lblBrDanaAkt.className = "lblKontrola";
        lblBrDanaAkt.id = "lblBrojDanaAktivnost";
        divBrojDana.appendChild(lblBrDanaAkt);

        kontrola.appendChild(divBrojDana);

        let divCena = document.createElement("div");
        divCena.className = "divKontrola";

        let lblCena = document.createElement("label");
        lblCena.className = "lblKontrola";
        lblCena.innerHTML = "Cena :";
        divCena.appendChild(lblCena);

        let lblCenaAkt = document.createElement("label");
        lblCenaAkt.className = "lblKontrola";
        lblCenaAkt.id = "lblCenaAkt";
        divCena.appendChild(lblCenaAkt);

        kontrola.appendChild(divCena);

        let naslovDiv = document.createElement("div");
        naslovDiv.className = "divInfoNaslov";
        kontrola.appendChild(naslovDiv);

        let lblNaslov = document.createElement("label");
        naslovDiv.appendChild(lblNaslov);
        lblNaslov.className = "lblInfoNaslov";
        lblNaslov.innerHTML = "Nastavnik";


        let imeDiv = document.createElement("div");
        imeDiv.className = "divInfo";
        kontrola.appendChild(imeDiv);
        let lblIme = document.createElement("label");
        lblIme.innerHTML = "Ime : ";
        imeDiv.appendChild(lblIme);
        lblIme.className = "lblInfo";
        let lblNastavnikIme = document.createElement("label");
        lblNastavnikIme.id = "imeNastavnik";
        lblNastavnikIme.className = "lblInfo"
        lblNastavnikIme.innerHTML = this.nastavnik.Ime;
        imeDiv.appendChild(lblNastavnikIme);

        let prezimeDiv = document.createElement("div");
        prezimeDiv.className = "divInfo";
        kontrola.appendChild(prezimeDiv);
        let lblPrezime = document.createElement("label");
        lblPrezime.innerHTML = "Prezime : ";
        lblPrezime.className = "lblInfo";
        prezimeDiv.appendChild(lblPrezime);

        let lblNastavnikPrezime = document.createElement("label");
        lblNastavnikPrezime.id = "prezimeNastavnik";
        lblNastavnikPrezime.className = "lblInfo";
        lblNastavnikPrezime.innerHTML = this.nastavnik.Prezime;
        prezimeDiv.appendChild(lblNastavnikPrezime);

        let iskustvoDiv = document.createElement("div");
        iskustvoDiv.className = "divInfo";
        kontrola.appendChild(iskustvoDiv);

        let lblIskustvo = document.createElement("label");
        lblIskustvo.className = "lblInfo";
        lblIskustvo.innerHTML = "Iskustvo: "
        iskustvoDiv.appendChild(lblIskustvo);

        let lblNastavnikIskustvo = document.createElement("label");
        lblNastavnikIskustvo.className = "lblInfo";
        lblNastavnikIskustvo.id = "iskustvoNastavnik";
        lblNastavnikIskustvo.innerHTML = this.nastavnik.Iskustvo / 1000 + "  /10";
        iskustvoDiv.appendChild(lblNastavnikIskustvo);


        /*
        //Dugme za testiranje
        let testbtn = document.createElement("button");
        kontrola.appendChild(testbtn);
        testbtn.innerHTML = "test";
        testbtn.onclick = () => {
            
        }
        */
    }
    uplatiZaUcenika(aktivnostID) {
        let ucenikID = document.getElementsByClassName("selektovanRed").item(0);
        if (ucenikID != null) {
            fetch("https://localhost:5001/Pohadja/Uplati/" + ucenikID.value + "/" + aktivnostID, { method: 'PUT' })
                .then(p => { this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID); });
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
    }
    ispisiUcenika(aktivnostID) {
        let ucenikID = document.getElementsByClassName("selektovanRed").item(0);
        if (ucenikID != null) {
            if (confirm("Da li stvarno zelis da ispises ucenika?")) {
                fetch("https://localhost:5001/Pohadja/IspisiUcenikaOdAktivnosti/" + ucenikID.value + "/" + aktivnostID, { method: 'DELETE' })
                    .then(p => { this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID); });
            }
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
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

        //Datum posljednje uplate

        el = document.createElement("th");
        el.innerHTML = "Datum Poslednje Uplate"
        red.appendChild(el);
    }
    dodajTabelu(divTabela) {
        let tabela = document.createElement("table");
        tabela.classList += "tabela";
        divTabela.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);

    }

    updateInfo() {
        let selectAktivnost = document.getElementById("selectAktivnost");
        let index = selectAktivnost.selectedIndex;
        let aktivnost = this.listaAktivnosti[index];

        fetch("https://localhost:5001/Nastavnik/VratiNastavnika/" + aktivnost.NastavnikID).then(p => {
            p.json().then(n => {
                this.nastavnik.ID = n.id;
                this.nastavnik.Ime = n.ime;
                this.nastavnik.Prezime = n.prezime;
                this.nastavnik.Iskustvo = n.iskustvo;
                this.dodajInfo();
            });

        });

    }
    dodajInfo() {
        let ime = document.getElementById("imeNastavnik");
        ime.innerHTML = this.nastavnik.Ime;

        let prezime = document.getElementById("prezimeNastavnik");
        prezime.innerHTML = this.nastavnik.Prezime;

        let isk = document.getElementById("iskustvoNastavnik");
        isk.innerHTML = this.nastavnik.Iskustvo / 1000 + "/ 10";
    }

    dodajInfoKontrolu(host) {

        let selectAktivnosti = document.getElementById("selectAktivnost");
        host.appendChild(kreirajDivButton("btnKontrola", "Uplati", "divKontrola", (ev) => {
            this.uplatiZaUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        }));

        host.appendChild(kreirajDivButton("btnKontrola", "Ispisi sa aktivnosti", "divKontrola", (ev) => {
            this.ispisiUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        }));


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