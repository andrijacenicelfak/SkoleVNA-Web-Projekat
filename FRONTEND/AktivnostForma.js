import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
export class AktivnostForma {
    constructor() {
        this.listaAktivnosti = [];
        this.listaUcenika = [];
    }
    updateListuAktivnosti() {
        let selectAktivnost = document.getElementsByClassName("selectAktivnost").item(0);
        let aktivnost;
        this.listaAktivnosti.forEach(akt => {
            aktivnost = document.createElement("option");
            aktivnost.innerHTML = akt.Naziv;
            aktivnost.value = akt.ID;
            selectAktivnost.appendChild(aktivnost);
        });
        this.nadjiUcenikeUpisaneNaAktivnost(selectAktivnost.options[selectAktivnost.selectedIndex].value);

    }

    pribaviAktivnosti() {
        let slSkole = document.getElementsByClassName("selectKontrola").item(0);
        //console.log(slSkole.options[slSkole.selectedIndex].value);
        let skolaID = slSkole.options[slSkole.selectedIndex].value;

        fetch("https://localhost:5001/Aktivnost/VratiAktivnostiZaSkolu/" + skolaID).then(p => {
            p.json().then(aktivnosti => {
                aktivnosti.forEach(a => {
                    let akt = new Aktivnost(a.aktivnostID, a.aktivnostNaziv, a.aktivnostCena, a.nastavnikID, a.aktivnostBrojDana);
                    this.listaAktivnosti.push(akt);
                    //console.log(akt);
                });
                this.updateListuAktivnosti();
            });
        });

    }
    nadjiUcenikeUpisaneNaAktivnost(idAktivnosti) {
        this.listaUcenika.length = 0;
        fetch("https://localhost:5001/Ucenik/PreuzmiUcenikeUpisaneNaAktivnost/" + idAktivnosti).then(p => {
            p.json().then(ucenici => {
                ucenici.forEach(ucenik => {
                    let uc = new Ucenik(ucenik.ucenikID, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, idAktivnosti, ucenik.poslednjiDatumPlacanje);
                    this.listaUcenika.push(uc);
                    //console.log(uc);
                });
                this.updateListuUcenika();
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
        aktivnostSelectDiv.classList += "divUKotrola";
        kontrola.appendChild(aktivnostSelectDiv);

        let lblAktivnost = document.createElement("label");
        lblAktivnost.innerHTML = "Aktivnost";
        lblAktivnost.classList += "lblKontrola";
        aktivnostSelectDiv.appendChild(lblAktivnost);

        let selectAktivnosti = document.createElement("select");
        selectAktivnosti.classList += "selectAktivnost";
        selectAktivnosti.onchange = (ev) => {
            this.nadjiUcenikeUpisaneNaAktivnost(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        }
        aktivnostSelectDiv.appendChild(selectAktivnosti);

        let btnPretraziDiv = document.createElement("div");
        btnPretraziDiv.className = "divUKontrola";
        kontrola.appendChild(btnPretraziDiv);

        /*
        //Dugme za testiranje
        let testbtn = document.createElement("button");
        kontrola.appendChild(testbtn);
        testbtn.innerHTML = "test";
        testbtn.onclick = () => {
            
        }
        */
    }

    dodajZaglavljaTabeli(tabela) {
        //Napravi zaglavlje

        let red = document.createElement("tr");
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
    crtaj(host) {

        let kontrola = document.createElement("div");
        kontrola.classList += "kontrola";
        host.appendChild(kontrola);

        this.dodajKontrolu(kontrola);

        let divTabela = document.createElement("div");
        divTabela.classList += "tableDiv";
        host.appendChild(divTabela);

        this.dodajTabelu(divTabela);

        this.pribaviAktivnosti();
    }
}