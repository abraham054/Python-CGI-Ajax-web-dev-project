//Script encargado de cargar los avistamientos del listado avistamiento
let avistamientos;
let detalleAvis;
let fotos;
let pagina = 0;

function startTable(avis,detAvis,foto){
    avistamientos = avis;
    detalleAvis = detAvis;
    fotos = foto;
    if(avistamientos.length === 0){
        return
    }
    insertList();
    if(avistamientos.length > 5){
        document.getElementById("bSig").hidden = false;
    }
}

function insertList(){
    let listTable = document.getElementById("listTable");
    listTable.innerHTML =`
         <tr>
            <th>Fecha hora</th>
            <th>Comuna</th>
            <th>Sector</th>
            <th>Nombre contacto</th>
            <th>Total avistamientos</th>
            <th>Total fotos</th>
        </tr>
    `
    let max = pagina + 5;
    if(max > avistamientos.length){
        max = avistamientos.length;
    }
    for(let i = pagina; i < max; i++){
        insertAvisTable(avistamientos[i], listTable);
    }
}

function insertAvisTable(data, listTable){
    let column = document.createElement("tr");
    column.onclick = function (){return showInfoAvistamiento(data[0])};
    column.innerHTML += `
        <td>${data[2]}</td>
        <td>${data[1]}</td>
        <td>${data[3]}</td>
        <td>${data[4]}</td>
        <td>${data[7]}</td>
        <td>${data[8]}</td>
    `
    listTable.appendChild(column);
}

function showInfoAvistamiento(id_av){
    document.getElementById("listTable").hidden = true;
    document.getElementById("pagBotones").hidden = true;
    let detalleIdTable = document.getElementById("detalleIdTable");
    detalleIdTable.hidden = false;
    for(let i = 0; i < detalleAvis.length; i++){
        if(detalleAvis[i][4] === id_av){
            insertDetAvTable(detalleAvis[i],detalleIdTable);
        }
    }
}

function insertDetAvTable(detalleAvis,detalleIdTable){
    let column = document.createElement("tr");
    column.innerHTML = `
        <td>${detalleAvis[1]}</td>
        <td>${detalleAvis[2]}</td>
        <td>${detalleAvis[3]}</td>
    `
    let detalleId = detalleAvis[0];
    foto = "<td>"
    for(let i = 0; i < fotos.length; i++){
        if(fotos[i][0] === detalleId){
            foto += "<img src='../media/"+fotos[i][1]+"' height='320' width='240' onclick='resizeFoto(this)' alt='foto_avistamiento'>"
        }
    }
    foto += "</td>"
    column.innerHTML += foto;
    detalleIdTable.appendChild(column);
}

function resizeFoto(foto){
    if(foto.height === 320){
        foto.height = 800;
        foto.width = 600;
    }
    else {
        foto.height = 320;
        foto.width = 240;
    }
}

function siguiente(){
    pagina +=5;
    if(pagina > 0){
        document.getElementById("bAnt").hidden = false;
    }
    if(pagina + 5 > avistamientos.length){
        document.getElementById("bSig").hidden = true;
    }
    insertList()
}

function anterior(){
    pagina -=5;
    if(pagina === 0){
        document.getElementById("bAnt").hidden = true;
    }
    if(pagina < avistamientos.length){
        document.getElementById("bSig").hidden = false;
    }
    insertList()
}