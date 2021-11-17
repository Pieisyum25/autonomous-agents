
window.addEventListener("load", insertHeader, true);

function insertHeader(){
    const header = document.createElement("header");
    header.innerHTML = "Hiiii";
    document.body.prepend(header);
}