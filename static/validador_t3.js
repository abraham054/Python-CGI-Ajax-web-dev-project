//Script encargado de generar los cambios en el formulario de informar avistamiento

function setForm(){
    let fechaForm = document.getElementById("fecha");
    let fecha = new Date();
    fechaForm.value = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}`;
    insertForm();
}

function insertForm() {
    let numforms = document.getElementsByClassName("formblock").length
    let form = document.getElementById('formulario');
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="formblock">
        <div class='leyenda'>Informacion de avistamiento</div>
        <div class="subform">
            <div>Tipo: 
                <select name='tipo-avistamiento' required='required'>
                    <option value='' selected='selected'>Seleccione una opcion</option> 
                    <option value='No se'>No se</option> 
                    <option value='Insecto'>Insecto</option> 
                    <option value='Aracnido'>Aracnido</option> 
                    <option value='Miriapodo'>Miriapodo</option> 
                </select>
            </div>
            <div>Estado: 
                <select name='estado-avistamiento' required='required'>
                    <option value='' selected='selected'>Seleccione una opcion</option>
                    <option value='No se'>No se</option>
                    <option value='Vivo'>Vivo</option>
                    <option value='Muerto'>Muerto</option>
                </select>
            </div>
            <div> Foto: 
                <div id='fotos'>
                    <input type='file' name='foto-avistamiento-${numforms}' required='required' accept="image/*"> <br> 
                </div>
                <input type='button' value='agregar otra foto' id='mas-fotos' onclick='insertFoto(this)'>
            </div>
        </div>
    </div>
    `;
    let boton = document.getElementById('enviar');
    form.insertBefore(div,boton);
}

function insertFoto(boton){
    let div = boton.parentNode.childNodes[1];
    let count =div.childElementCount;
    let newFoto = document.createElement('input');
    newFoto.type = 'file';
    newFoto.name = div.childNodes[1].name;
    newFoto.required = true;
    newFoto.accept = 'image';
    div.appendChild(newFoto);
    div.appendChild(document.createElement('br'));
    if(count === 8){
        boton.parentNode.removeChild(boton);
    }
}

function confimacion(boton){
    boton.style.display = 'none';
    document.getElementById('confirmacion').style.display = '';
}

function send(){
    let region = document.getElementsByName("region");
    let comuna = document.getElementsByName("comuna");
    let sector = document.getElementsByName("sector");
    let nombre = document.getElementsByName("nombre");
    let email = document.getElementsByName("email");
    let celular = document.getElementsByName("celular");
    let diaHora = document.getElementsByName("dia-hora-avistamiento");
    let tipoAv = document.getElementsByName("tipo-avistamiento");
    let estadoAv = document.getElementsByName("estado-avistamiento");
    let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let celularRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    let diaHoraRegex = /[0-9]{4}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[0-1][0-9]|[0-9]):([0-5][0-9]|[0-9])/;
    if(region[0].value === '' || comuna[0].value === ''){
        window.alert("Hay un error en la seleccion de region o comuna")
        return false;
    }
    if(sector[0].value.length > 100){
        window.alert("El nombre del sector es demasiado largo")
        return false;
    }
    if(nombre[0].value.length > 200){
        window.alert("Tu nombre es demasiado largo")
        return false;
    }
    if(!emailRegex.test(email[0].value)){
        window.alert("Hay un error en su email");
        return false;
    }
    if(!celularRegex.test(celular[0].value)){
        window.alert("Hay un error en su numero de celular");
        return false;
    }
    if(!diaHoraRegex.test(diaHora[0].value)){
        window.alert("Hay un error en la dia hora especificada");
        return false;
    }
    for(let i = 0; i < email.length;i++){
        if(tipoAv[i].value === ''){
            window.alert("Hay un arror en uno de los tipos de avistamientos");
            return false;
        }
        if(estadoAv[i].value === ''){
            window.alert("Hay un arror en uno de los tipos de avistamientos");
            return false;
        }
    }
    for(let i=0; i < document.getElementsByClassName("formblock").length; i++){
        let fotoName = `foto-avistamiento-${i+1}`;
        let fotoContainer = document.getElementsByName(fotoName);
        for(let j=0; j < fotoContainer.length; j++){
            if(fotoContainer[j].files[0] === undefined){
                window.alert("Falta agregar fotoa");
                return false;
            }
        }
    }
    console.log("todo correcto mi pana")
    return true;
}

function cancelar(){
    document.getElementById('enviar').style.display = '';
    document.getElementById('confirmacion').style.display = 'none';
}

function fillRegion(selectRegion){
    selectRegion.childNodes[1].disabled = true;
    if(selectRegion.childElementCount === 1){
        for(let i in regiones){
            let opcion = document.createElement('option');
            opcion.value = i;
            opcion.innerHTML = i;
            selectRegion.appendChild(opcion);
        }
    }
}

function fillComuna(valor,selectRegion){
    let selectComuna = selectRegion.parentNode.parentNode.childNodes[3];
    let lastSelect = selectComuna.childNodes[1];
    let opciones = document.createElement('select');
    opciones.name = 'comuna';
    opciones.required = true;
    for(let i =0; i < regiones[valor].length; i++){
        let opcion = document.createElement('option');
        opcion.value = regiones[valor][i];
        opcion.innerHTML = regiones[valor][i];
        opciones.appendChild(opcion);
    }
    selectComuna.replaceChild(opciones,lastSelect);
}

let regiones = {
    "Region de Tarapaca": ['Camiña','Huara','Pozo Almonte','Iquique','Pica','Colchane','Alto Hospicio'],
    "Region de Antofagasta": ['Tocopilla','Maria Elena','Ollague','Calama','San Pedro Atacama','Sierra Gorda','Mejillones','Antofagasta','Taltal'],
    "Region de Atacama": ['Diego de Almagro','Chañaral','Caldera','Copiapo','Tierra Amarilla','Huasco','Freirina','Vallenar','Alto del Carmen'],
    "Region de Coquimbo": ['La Higuera','La Serena','Vicuña','Paihuano','Coquimbo','Andacollo','Rio Hurtado','Ovalle','Monte Patria','Punitaqui','Combarbala','Mincha','Illapel','Salamanca','Los Vilos'],
    "Region de Valparaiso": ['Petorca','Cabildo','Papudo','La Ligua','Zapallar','Putaendo','Santa Maria','San Felipe','Pencahue','Catemu','Llay Llay','Nogales','La Calera','Hijuelas','La Cruz','Quillota','Olmue','Limache','Los Andes','Rinconada','Calle Larga','San Esteban','Puchuncavi','Quintero','Viña del Mar','Villa Alemana','Quilpue','Valparaiso','Juan Fernandez','Casablanca','Concon','Isla de Pascua','Algarrobo','El Quisco','El Tabo','Cartagena','San Antonio','Santo Domingo'],
    "Region del Libertador Bernardo Ohiggins": ['Mostazal','Codegua','Graneros','Machali','Rancagua','Olivar','Doñihue','Requinoa','Coinco','Coltauco','Quinta Tilcoco','Las Cabras','Rengo','Peumo','Pichidegua','Malloa','San Vicente','Navidad','La Estrella','Marchigue','Pichilemu','Litueche','Paredones','San Fernando','Peralillo','Placilla','Chimbarongo','Palmilla','Nancagua','Santa Cruz','Pumanque','Chepica','Lolol'],
    "Region del Maule": ['Teno','Romeral','Rauco','Curico','Sagrada Familia','Hualañe','Vichuquen','Molina','Licanten','Rio Claro','Curepto','Pelarco','Talca','Pencahue','San Clemente','Constitucion','Maule','Empedrado','San Rafael','San Javier','Colbun','Villa Alegre','Yerbas Buenas','Linares','Longavi','Retiro','Parral','Chanco','Pelluhue','Cauquenes'],
    "Region del Biobio": ['Tome','Florida','Penco','Talcahuano','Concepcion','Hualqui','Coronel','Lota','Santa Juana','Chiguayante','San Pedro de la Paz','Hualpen','Cabrero','Yumbel','Tucapel','Antuco','San Rosendo','Laja','Quilleco','Los Angeles','Nacimiento','Negrete','Santa Barbara','Quilaco','Mulchen','Alto Bio Bio','Arauco','Curanilahue','Los Alamos','Lebu','Cañete','Contulmo','Tirua'],
    "Region de La Araucania": ['Renaico','Angol','Collipulli','Los Sauces','Puren','Ercilla','Lumaco','Victoria','Traiguen','Curacautin','Lonquimay','Perquenco','Galvarino','Lautaro','Vilcun','Temuco','Carahue','Melipeuco','Nueva Imperial','Puerto Saavedra','Cunco','Freire','Pitrufquen','Teodoro Schmidt','Gorbea','Pucon','Villarrica','Tolten','Curarrehue','Loncoche','Padre Las Casas','Cholchol'],
    "Region de Los Lagos": ['San Pablo','San Juan','Osorno','Puyehue','Rio Negro','Purranque','Puerto Octay','Frutillar','Fresia','Llanquihue','Puerto Varas','Los Muermos','Puerto Montt','Maullin','Calbuco','Cochamo','Ancud','Quemchi','Dalcahue','Curaco de Velez','Castro','Chonchi','Queilen','Quellon','Quinchao','Puqueldon','Chaiten','Futaleufu','Palena','Hualaihue'],
    "Region Aisen del General Carlos Ibanez del Campo": ['Guaitecas','Cisnes','Aysen','Coyhaique','Lago Verde','Rio Ibañez','Chile Chico','Cochrane','Tortel',"O'Higins"],
    "Region de Magallanes y la Antartica Chilena": ['Torres del Paine','Puerto Natales','Laguna Blanca','San Gregorio','Rio Verde','Punta Arenas','Porvenir','Primavera','Timaukel','Antartica'],
    "Region Metropolitana de Santiago": ['Tiltil','Colina','Lampa','Conchali','Quilicura','Renca','Las Condes','Pudahuel','Quinta Normal','Providencia','Santiago','La Reina','Ñuñoa','San Miguel','Maipu','La Cisterna','La Florida','La Granja','Independencia','Huechuraba','Recoleta','Vitacura','Lo Barrenechea','Macul','Peñalolen','San Joaquin','La Pintana','San Ramon','El Bosque','Pedro Aguirre Cerda','Lo Espejo','Estacion Central','Cerrillos','Lo Prado','Cerro Navia','San Jose de Maipo','Puente Alto','Pirque','San Bernardo','Calera de Tango','Buin','Paine','Peñaflor','Talagante','El Monte','Isla de Maipo','Curacavi','Maria Pinto','Melipilla','San Pedro','Alhue','Padre Hurtado'],
    "Region de Los Rios": ['Lanco','Mariquina','Panguipulli','Mafil','Valdivia','Los Lagos','Corral','Paillaco','Futrono','Lago Ranco','La Union','Rio Bueno'],
    "Region Arica y Parinacota": ['Gral. Lagos','Putre','Arica','Camarones'],
    "Region del Nuble": ['Cobquecura','Ñiquen','San Fabian','San Carlos','Quirihue','Ninhue','Trehuaco','San Nicolas','Coihueco','Chillan','Portezuelo','Pinto','Coelemu','Bulnes','San Ignacio','Ranquil','Quillon','El Carmen','Pemuco','Yungay','Chillan Viejo']
};