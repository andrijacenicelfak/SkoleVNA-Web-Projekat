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

    dodajUcenikaKontrola(sadrzaj);
    dodajTabeluUcenik(sadrzaj);

    //console.log("UCENICI");
}

function dodajUcenikaKontrola(host) {
    let kontrola = document.createElement("div");
    kontrola.className = "kontrola";
    host.appendChild(kontrola);
    //Ime
    let red = document.createElement("div");
    red.className = "red";
    kontrola.appendChild(red);

    let lblIme = document.createElement("label");
    lblIme.innerHTML = "Ime "
    lblIme.className = "lblKontrola";
    red.appendChild(lblIme);

    let txtBoxIme = document.createElement("input");
    txtBoxIme.type = "text";
    txtBoxIme.classList += "txtBoxKontrola";
    txtBoxIme.id = "txtBoxIme";
    red.appendChild(txtBoxIme);
    //Prezime
    red = document.createElement("div");
    red.className = "red";
    kontrola.appendChild(red);

    let lblPrezime = document.createElement("label");
    lblPrezime.innerHTML = "Prezime";
    red.appendChild(lblPrezime);

    let txtBoxPrezime = document.createElement("input");
    txtBoxPrezime.type = "text";
    txtBoxPrezime.classList += "txtBoxKontrola";
    txtBoxPrezime.id = "txtBoxPrezime"
    red.appendChild(txtBoxPrezime);
    //Broj telefona
    red = document.createElement("div");
    red.className = "red";
    kontrola.appendChild(red);

    let lblBrojTelefona = document.createElement("label");
    lblBrojTelefona.innerHTML = "Broj telefona roditelja";
    red.appendChild(lblBrojTelefona);

    let txtBoxBrTel = document.createElement("input");
    txtBoxBrTel.type = "text";
    txtBoxBrTel.classList += "txtBoxKontrola";
    txtBoxBrTel.id = "txtBoxBrTel";
    red.appendChild(txtBoxBrTel);

    //Dugme pretraga
    red = document.createElement("div");
    red.className = "red";
    kontrola.appendChild(red);

    let btnPretraga = document.createElement("button");
    btnPretraga.className = "btnKontrola";
    btnPretraga.innerText = "Pretrazi";
    btnPretraga.onclick = () => {
        while (listaUcenikaIAktivnostima.length > 0)
            listaUcenikaIAktivnostima.pop();

        fetch("https://localhost:5001/Ucenik/NadjiUcenika/" + txtBoxIme.value + "/" + txtBoxPrezime.value + "/" + txtBoxBrTel.value).then(p => {
            p.json().then(ucenici => {
                ucenici.forEach(uc => dodajUcenikaUTabelu(uc.id, uc.ime, uc.prezime, uc.brojTelefonaRoditelja, uc.imeRoditelja, uc.aktivnostID));
            });

        });

        updateTabeluUcenika();
    };
    red.appendChild(btnPretraga);

}

function updateTabeluUcenika() {
    let tabela = document.getElementsByClassName("tabelaZaPodatkeUcenika").item(0);
    console.log("Updejtusem");
    listaUcenikaIAktivnostima.forEach(ucenik => {
        //console.log(ucenik);
        const red = document.createElement("tr");
        tabela.appendChild(red);

        let e = document.createElement("td");
        e.innerHTML = ucenik.ime;
        red.appendChild(e);

        e = document.createElement("td");
        e.innerHTML = ucenik.prezime;
        red.appendChild(e);

        e = document.createElement("td");
        e.innerHTML = ucenik.brojTelefonaRoditelja;
        red.appendChild(e);

        e = document.createElement("td");
        e.innerHTML = ucenik.imeRoditelja;
        red.appendChild(e);

        e = document.createElement("td");
        e.innerHTML = ucenik.idAktivnosti; //BIG NO NO
        red.appendChild(e);
    });
}
function dodajUcenikaUTabelu(id, ime, prezime, brojTelefonaRoditelja, imeRoditelja, idAktivnosti) {
    let ucenik = new Ucenik(id, ime, prezime, brojTelefonaRoditelja, imeRoditelja, idAktivnosti);
    listaUcenikaIAktivnostima.push(ucenik);
    //console.log(listaUcenikaIAktivnostima);
}

function dodajTabeluUcenik(host) {
    let tabelaDiv = document.createElement("div");
    tabelaDiv.className = "tabelaDiv";
    host.appendChild(tabelaDiv);

    let tabela = document.createElement("table");
    tabela.className = "tabelaZaPodatkeUcenika";
    tabelaDiv.appendChild(tabela);
    crtajZaglavljeUcenikForma(tabela);


}

function crtajZaglavljeUcenikForma(host) {

    const red = document.createElement("tr");
    host.appendChild(red);

    let e = document.createElement("th");
    e.innerHTML = "Ime";
    red.appendChild(e);


    e = document.createElement("th");
    e.innerHTML = "Prezime";
    red.appendChild(e);

    e = document.createElement("th");
    e.innerHTML = "Broj Telefona Roditelja";
    red.appendChild(e);

    e = document.createElement("th");
    e.innerHTML = "Ime Roditelja";
    red.appendChild(e);

    e = document.createElement("th");
    e.innerHTML = "Aktivnost";
    red.appendChild(e);

}
/*
fetch("https://localhost:5001/Ucenik/PreuzmiUcenike").then(p =>
    p.json().then(ucenici => {
        ucenici.forEach(ucenik => {

            let ime = ucenik.ime;
            let prezime = ucenik.prezime;
            let imeRod = ucenik.imeRoditelja;
            let brojTelefonaRoditelja = ucenik.brojTelefonaRoditelja;
            let id = ucenik.id;
            ucenik.listaAktivnosti.forEach(akt => {
                let ucAkt = new Ucenik(id, ime, prezime, brojTelefonaRoditelja, imeRod, akt.id);
                console.log(ucAkt);
            })
            console.log(ucenik);
        });
    })
)

let sveSkole = [];
let sveAktivnosti = [];
fetch("https://localhost:5001/Skola/PreuzmiSkole").then(p => {
    p.json().then(skole => {
        skole.forEach(sk => {
            let skola = new Skola(sk.id, sk.naziv, sk.tip);
            sveSkole.push(skola);
        });
    });
});

function UcitajAktivnosti() {
    fetch("https://localhost:5001/Aktivnost/PreuzmiAktivnostiZaSkolu/" + sveSkole[0].ID).then(p => {
        p.json().then(aktivnosti => {
            aktivnosti.forEach(akt => {
                let aktivnost = new Aktivnost(akt.id, akt.naziv, akt.cena, akt.nastavnikID, akt.brojDanaUNedelji);
                sveAktivnosti.push(aktivnost);
            });
        });
    });
}
UcitajAktivnosti();
console.log(sveSkole);
console.log(sveAktivnosti);
*/