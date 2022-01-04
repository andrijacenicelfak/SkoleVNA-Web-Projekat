export function kreirajDivTextITextBox(lblText, lblClass, tbxClass, tbxID, divClass) {
    let lbl = document.createElement("label");
    lbl.className = lblClass;
    lbl.innerHTML = lblText;

    let tbx = document.createElement("input");
    tbx.type = "text";
    tbx.className = tbxClass;
    tbx.id = tbxID;

    let div = document.createElement("div");
    div.className = divClass;
    div.appendChild(lbl);
    div.appendChild(tbx);
    return div;
}

export function kreirajDivButton(btnClass, btnText, divClass, func) {
    let divBtn = document.createElement("div");
    divBtn.className = divClass;

    let btn = document.createElement("button");
    btn.innerHTML = btnText;
    btn.className = btnClass;
    btn.onclick = func;
    divBtn.appendChild(btn);
    return divBtn;
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}