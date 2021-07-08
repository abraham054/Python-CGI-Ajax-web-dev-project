let chile = [];
fetch('../static/json/chile.json').then(results => results.json()).then(function (data){
    chile = data['chile'];
});

/** @type {map}*/
let map;

let avIds = {};

let data = {};

function showMap_t3(){
    map = L.map('mapid').setView([-38.7333,-72.6667],3);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWJyYWhhbTA1NCIsImEiOiJja3BkaDB4aWsxZjBwMnhwZ21kaXB2dnA3In0.O42y3IYGY80EHeP7_GOvoA'
    }).addTo(map);
}

function loadAvsLocation(){
    console.log("Cargando localizaciones de los avistamientos en la base de datos")
    let request  = new XMLHttpRequest();
    request.open('GET','../cgi-bin/map_t3.py');
    request.timeout = 1000;
    request.onload = function (data){
        /** @type {string} */
        let datatext = data.currentTarget.responseText;
        if (datatext.includes('ERROR') || datatext.includes('Error')) {
            console.log("Error el extraer datos de la db");
            return;
        }
        let message = JSON.parse(datatext);
        setMarkers(message);
        setMapMarkers(message["count_comuna"],message["det_comunas"]);
    }
    request.ontimeout = function () {
        console.log('Se excedió el tiempo máximo de comunicación con el servidor')
    }
    request.onerror = function () {
        console.log('Error al cargar los mensajes desde la base de datos')
    }
    request.send();
}

function setMarkers(message){
    for(let i = 0; i < message["comunas"].length; i += 1){
        if(!(message["comunas"][i] in avIds)){
            let pos = getComData(message["comunas"][i]);
            let marker = createMarker(pos)
            if(marker === false){
                console.log(`La comuna ${message['comunas'][i]} esta mal escrita en el chile.json!`);
                return;
            }
            avIds[message["comunas"][i]] = marker.bindPopup();
        }
    }
}

function setMapMarkers(dFoto_Com,dAv_Com){
    let keys = Object.keys(dFoto_Com);
    for(let i = 0; i < keys.length; i += 1){
        let comuna = keys[i];
        setOnMousePopup(dFoto_Com[comuna],keys[i]);
        setOnClickPopup(dAv_Com[comuna],keys[i]);
    }
}

function setOnClickPopup(avist, comuna){
    let popup = avIds[comuna];
    if(popup === undefined){
        return;
    }
    let content = '';
    for(let i = 0; i < avist.length; i +=1){
        let detAv = avist[i];
        data[detAv[3]] = detAv;
        content += `<p>Avistamiento ${i+1}: <br>Fecha: ${detAv[0]} <br>Tipo: ${detAv[1]}<br>Estado: ${detAv[2]}<br>
                    <button type='button' onclick='showDetAv(${detAv[3]})'>Ver mas</button></p>`;
    }
    if(popup.getPopup().content !== content){
        popup.on('click',function (e){
            this.getPopup().setContent(content);
            this.update();
            this.openPopup();
        })
    }
}

function setOnMousePopup(fotos, comuna){
    let popup = avIds[comuna];
    if(popup === undefined){
        return;
    }
    let content;
    if(fotos === 1){
        content = `<p>En ${comuna} fue tomada ${fotos} foto</p>`;
    }else{
        content = `<p>En ${comuna} fueron tomadas ${fotos} fotos</p>`
    }
    if(popup.getPopup().content !== content){
        popup.on('mouseover',function (e){
            this.getPopup().setContent(content);
            this.openPopup();
        });
        popup.on('mouseout',function (e){
            if(this.getPopup().getContent() === content){
                this.closePopup();
            }
        });
    }
}

function createMarker(com_location){
    if(com_location === undefined){
        return false;
    }
    let lat = com_location['lat'];
    let lng = com_location['lng'];
    return L.marker([lat,lng]).addTo(map);
}

function removeAccent(com_str){
    let nfkd_form = com_str.normalize('NFD');
    return nfkd_form.replace(/[\u0300-\u036f]/g, "");
}

function getComData(comuna){
    for(let i = 0; i < chile.length; i += 1){
        if(removeAccent(chile[i].name) === comuna){
            return chile[i];
        }
    }
}

function showDetAv(info){
    let detContainer = document.getElementById("det_av_container");
    detContainer.className = 'active';
    let av = data[info];
    let dataHtml = `<p>Fecha: ${av[0]} <br>Tipo: ${av[1]} <br>Estado: ${av[2]} <br>Foto(s):<br>`
    for(let i = 0; i < av[4].length; i += 1){
        dataHtml += `<img src="../media/${av[4][i]}" alt="foto_avistamiento" height="300" width="200"> `
    }
    dataHtml += '<br><button onclick="closeInfo()">Cerrar</p>'
    detContainer.innerHTML = dataHtml
}

function closeInfo(){
    let detContainer = document.getElementById("det_av_container");
    detContainer.innerHTML = '';
    detContainer.className = 'inactive'
}

function startApp(){
    console.log("Iniciando portada de avistamiento animal");
    loadAvsLocation();
    showMap_t3();
    setInterval(function (){
        loadAvsLocation();
    },1000);
}
