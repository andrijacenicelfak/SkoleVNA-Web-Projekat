import { Aktivnost } from "./Aktivnost.js";
import { Ucenik } from "./Ucenik.js";
import { Nastavnik } from "./Nastavnik.js";

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
export class AktivnostForma {
    constructor() {
        this.listaAktivnosti = [];
        this.listaUcenika = [];
        this.nastavnik = new Nastavnik(-1, "", "", 0);
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
        this.listaAktivnosti.length = 0;

        fetch("https://localhost:5001/Aktivnost/VratiAktivnostiZaSkolu/" + skolaID).then(p => {
            p.json().then(aktivnosti => {
                aktivnosti.forEach(a => {
                    let akt = new Aktivnost(a.aktivnostID, a.aktivnostNaziv, a.aktivnostCena, a.nastavnikID, a.aktivnostBrojDana);
                    this.listaAktivnosti.push(akt);
                    //console.log(akt);
                });
                this.listaAktivnosti.push(new Aktivnost(-1, "Nije upisan", 0, -1, 0));
                this.updateListuAktivnosti();
                //this.updateInfo();

                if (this.listaAktivnosti.length > 1) {
                    let btnUpisi = document.getElementById("btnUplati");
                    btnUpisi.disabled = false;
                    let btnIspisi = document.getElementById("btnIspisi");
                    btnIspisi.disabled = false;
                }
            });
        });

    }
    nadjiUcenikeUpisaneNaAktivnost(idAktivnosti) {
        this.listaUcenika.length = 0;
        if (idAktivnosti == -1) {
            this.listaUcenika.length = 0;
            fetch("https://localhost:5001/Pohadja/VratiUcenikeKojiNisuUpisani").then(p => p.json().then(ucenici => {
                ucenici.forEach(ucenik => {
                    let uc = new Ucenik(ucenik.id, ucenik.ime, ucenik.prezime, ucenik.brojTelefonaRoditelja, ucenik.imeRoditelja, idAktivnosti, "");
                    this.listaUcenika.push(uc);
                    //console.log(uc);
                });
                this.updateListuUcenika();
            }));
            this.updateListuUcenika();
        } else {
            fetch("https://localhost:5001/Pohadja/PreuzmiUcenikeUpisaneNaAktivnost/" + idAktivnosti).then(p => {
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
        aktivnostSelectDiv.classList += "divUKotrola";
        kontrola.appendChild(aktivnostSelectDiv);

        let lblAktivnost = document.createElement("label");
        lblAktivnost.innerHTML = "Aktivnost";
        lblAktivnost.classList += "lblKontrola";
        aktivnostSelectDiv.appendChild(lblAktivnost);

        let btnUplatiDiv = document.createElement("div");
        let btnUplati = document.createElement("button");
        btnUplati.className = "btnKontrola";
        btnUplati.innerHTML = "Uplati";
        btnUplati.id = "btnUplati";
        btnUplati.onclick = (ev) => {
            this.uplatiZaUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        };
        btnUplati.disabled = true;
        btnUplatiDiv.appendChild(btnUplati);

        let btnIspisiDiv = document.createElement("div");
        let btnIspisi = document.createElement("button");
        btnIspisi.innerHTML = "Ipisi sa aktivnosti";
        btnIspisi.className = "btnKontrola";
        btnIspisi.id = "btnIspisi";
        btnIspisi.disabled = true;
        btnIspisi.onclick = (ev) => {
            this.ispisiUcenika(selectAktivnosti.options[selectAktivnosti.selectedIndex].value);
        };
        btnIspisiDiv.appendChild(btnIspisi);


        let selectAktivnosti = document.createElement("select");
        selectAktivnosti.classList += "selectAktivnost";
        selectAktivnosti.onchange = (ev) => {
            let aktivnostID = selectAktivnosti.options[selectAktivnosti.selectedIndex].value;
            if (aktivnostID == -1) {
                btnUplati.disabled = true;
                btnIspisi.disabled = true;
            }
            else {
                btnUplati.disabled = false;
                btnIspisi.disabled = false;
            }
            //this.updateInfo();
            this.nadjiUcenikeUpisaneNaAktivnost(aktivnostID);
        }
        aktivnostSelectDiv.appendChild(selectAktivnosti);

        kontrola.appendChild(btnUplatiDiv);

        kontrola.appendChild(btnIspisiDiv);

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

    /*updateInfo() {
        let selectAktivnost = document.getElementsByClassName("selectAktivnost").item(0);
        let index = selectAktivnost.selectedIndex;
        let aktivnost = this.listaAktivnosti[index];
        console.log(aktivnost);
        console.log(aktivnost.ID);

        if (aktivnost.ID == -1) {
            this.nastavnik.ID = -1;
            this.nastavnik.Ime = "/";
            this.nastavnik.Prezime = "/";
            this.nastavnik.Iskustvo = 0;

            let imeNastavnik = document.getElementById("imeNastavnik");
            imeNastavnik.innerHTML = this.nastavnik.Ime;

            let prezimeNastavnik = document.getElementById("prezimeNastavnik");
            prezimeNastavnik.innerHTML = this.nastavnik.Prezime;

            let iskustvoNastavnik = document.getElementById("iskustvoNastavnik");
            iskustvoNastavnik.innerHTML = this.nastavnik.Iskustvo + "   ";
        } else {
            fetch("https://localhost:5001/Nastavnik/VratiNastavnika/" + aktivnost.NastavnikID).then(p => {
                p.json().then(n => {
                    this.nastavnik.ID = n.id;
                    this.nastavnik.Ime = n.ime;
                    this.nastavnik.Prezime = n.prezime;
                    this.nastavnik.Iskustvo = n.iskustvo;
                });
                let imeNastavnik = document.getElementById("imeNastavnik");
                imeNastavnik.innerHTML = this.nastavnik.Ime;

                let prezimeNastavnik = document.getElementById("prezimeNastavnik");
                prezimeNastavnik.innerHTML = this.nastavnik.Prezime;

                let iskustvoNastavnik = document.getElementById("iskustvoNastavnik");
                iskustvoNastavnik.innerHTML = this.nastavnik.Iskustvo + "   ";
            });
        }
    }
    dodajInfo(info) {
        let naslovDiv = document.createElement("div");
        naslovDiv.className = "divInfoNaslov";
        info.appendChild(naslovDiv);

        let lblNaslov = document.createElement("label");
        naslovDiv.appendChild(lblNaslov);
        lblNaslov.className = "lblInfoNaslov";
        lblNaslov.innerHTML = "Nastavnik";


        let imeDiv = document.createElement("div");
        imeDiv.className = "divInfo";
        info.appendChild(imeDiv);
        let lblIme = document.createElement("label");
        lblIme.innerHTML = "Ime : ";
        imeDiv.appendChild(lblIme);
        lblIme.className = "lblInfo";
        let lblNastavnikIme = document.createElement("label");
        lblNastavnikIme.id = "imeNastavnik";
        lblNastavnikIme.className = "lblInfo"
        imeDiv.appendChild(lblNastavnikIme);

        let prezimeDiv = document.createElement("div");
        prezimeDiv.className = "divInfo";
        info.appendChild(prezimeDiv);
        let lblPrezime = document.createElement("label");
        lblPrezime.innerHTML = "Prezime : ";
        lblPrezime.className = "lblInfo";
        prezimeDiv.appendChild(lblPrezime);

        let lblNastavnikPrezime = document.createElement("label");
        lblNastavnikPrezime.id = "prezimeNastavnik";
        lblNastavnikPrezime.className = "lblInfo";
        prezimeDiv.appendChild(lblNastavnikPrezime);

        let iskustvoDiv = document.createElement("div");
        iskustvoDiv.className = "divInfo";
        info.appendChild(iskustvoDiv);

        let lblIskustvo = document.createElement("label");
        lblIskustvo.className = "lblInfo";
        lblIskustvo.innerHTML = "Iskustvo: "
        iskustvoDiv.appendChild(lblIskustvo);

        let lblNastavnikIskustvo = document.createElement("label");
        lblNastavnikIskustvo.className = "lblInfo";
        lblNastavnikIskustvo.id = "iskustvoNastavnik";
        iskustvoDiv.appendChild(lblNastavnikIskustvo);
        let lblIskustvoM = document.createElement("label");
        lblIskustvoM.className = "lblInfo";
        lblIskustvoM.innerHTML = "poena";
        iskustvoDiv.appendChild(lblIskustvoM);
    }*/


    crtaj(host) {

        let kontrola = document.createElement("div");
        kontrola.classList += "kontrola";
        host.appendChild(kontrola);

        this.dodajKontrolu(kontrola);

        let divTabela = document.createElement("div");
        divTabela.classList += "tableDiv";
        host.appendChild(divTabela);

        this.dodajTabelu(divTabela);

        let info = document.createElement("div");
        info.className = "info";
        host.appendChild(info);

        //this.dodajInfo(info);

        this.pribaviAktivnosti();

    }
}