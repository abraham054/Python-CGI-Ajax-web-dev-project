
function startApp(){
    console.log("Iniciando pagina de estadisticas")
    loadStats()
    setInterval(function (){
        loadStats()
    },1000);
}

function loadStats(){
    console.log("Cargando estadisticas con informacion del servidor");
    let request = new XMLHttpRequest();
    request.open('GET', 'cgi-bin/stats_t3.py');
    request.timeout = 1000;
    request.onload = function (data) {
        /** @type {string} */
        let datatext = data.currentTarget.responseText;
        if (datatext.includes('ERROR') || datatext.includes('Error')) {
            console.log("Error el extraer datos de la db");
            return;
        }
        let messages = JSON.parse(datatext);
        let keys = Object.keys(messages);
        grafLineas(messages[keys[0]])
        grafTorta(messages[keys[1]])
        grafBarra(messages[keys[2]])
    }
    request.ontimeout = function () {
        mostrarError('Se excedió el tiempo máximo de comunicación con el servidor');
    }
    request.onerror = function () {
        mostrarError('Error al cargar los mensajes desde la base de datos');
    }
    request.send();
}

function mostrarError(error){
    let error_cont =document.getElementById('error-container');
    error_cont.innerHTML = error;
    error_cont.style.display = 'block';
    error_cont.style.fontWeight = '800';
    setTimeout(function () {
        error_cont.style.display = 'none';
    }, 5000); // Después de 5 segundos se oculta el error
}

function grafLineas(datos){
    let dataGraf = {
        x: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
        y: datos,
        type: 'scatter'
    }
    let layout = {
        title: 'Avistamientos segun dias de la semana',
        height: 400,
        width: 500,
    }
    Plotly.newPlot('line-container',[dataGraf],layout);
}

function grafTorta(datos){
    let dataGraf = {
        values: [datos['no sé'], datos['insecto'], datos['arácnido'], datos['miriápodo']],
        labels: ['no sé', 'insecto', 'arácnido', 'miriápodo'],
        type: 'pie'
    };
    let layout = {
        title: 'Avistamientos segun dias de la semana',
        height: 400,
        width: 500
    };
    Plotly.newPlot('pie-container',[dataGraf],layout);
}

function grafBarra(datos){
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let dataGrafN = {
        x: meses,
        y: datos['no sé'],
        name: 'No sé',
        type: 'bar'
    };
    let dataGrafV = {
        x: meses,
        y: datos['vivo'],
        name: 'Vivo',
        type: 'bar'
    }
    let dataGrafM = {
        x: meses,
        y: datos['muerto'],
        name: 'Muerto',
        type: 'bar'
    }
    let data = [dataGrafV,dataGrafM,dataGrafN]
    let layout = {
        title: 'Estado de avistamientos por meses',
        barmode: 'group',
        bargroupgap: 0.1,
        bargap: 0.15,
        height: 400,
        width: 500
    }
    Plotly.newPlot('bar-container',data,layout)
}