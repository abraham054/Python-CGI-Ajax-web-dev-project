#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi
import cgitb
from avistamientos_db_t3 import Avistamiento
from datetime import datetime

cgitb.enable()

print("Content-type: text/html\r\n\r\n")

utf8stdout = open(1, 'w', encoding='utf-8', closefd=False)

avisdb = Avistamiento()
avistamientos = avisdb.getAvistamientos()
newAv = []
for av in avistamientos:
    avList = []
    for i in range(len(av)):
        if i == 1:
            comuna = avisdb.getComuna(av[i])
            nameCom = comuna[0][0]
            avList.append(nameCom)
        elif i == 2:
            avList.append(av[i].strftime("%Y/%m/%d %H:%M"))
        else:
            avList.append(av[i])
    av_id = avList[0]
    avList.append(avisdb.getTotalAvistamientos(av_id)[0][0])
    avList.append(avisdb.getTotalFotos(av_id)[0][0])
    newAv.append(avList)
#print(newAv)

detAv = avisdb.getDetalleAvistamientos()
newDetAv = []
for info in detAv:
    infoList = []
    for i in range(len(info)):
        if i == 1:
            infoList.append(info[i].strftime("%Y/%m/%d %H:%M"))
        else:
            infoList.append(info[i])
    newDetAv.append(infoList)
#print(newDetAv)

fotos = avisdb.getFotos()
newFotos = []
for info in fotos:
    infoFoto = []
    infoFoto.append(info[0])
    infoFoto.append(info[1])
    newFotos.append(infoFoto)
#print(newFotos)

head = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Abraham Oquiche">
    <title>Listado de Avistamientos</title>
    <link rel="stylesheet" type="text/css" media="screen" href="../style_t3.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
    <script src='../static/showList_t3.js'></script>
</head>
"""
print(head, file=utf8stdout)

body = f"""
<body onload="startTable({newAv},{newDetAv},{newFotos})">
    <div class="titulo">
        Reporte de avistamiento animal
    </div>
    <ul class="index">
        <li><a href="index_t3.py">Portada</a></li>
        <li><a class='active' href="list_t3.py">Ver Listado de Avistamientos</a></li>
        <li><a href="../add_avistamiento_t3.html">Informar Avistamiento</a></li>
        <li><a href="../show_estadistica_t3.html">Mostrar estadisticas</a></li>
    </ul>
"""
print(body, file=utf8stdout)

if len(newAv) != 0:
    table = """
        <div>
            <table class="tabla" id="listTable"></table>
        </div>
        <div>
            <table class="tabla" id="detalleIdTable" hidden="hidden">
                <tr>
                    <th>Fecha hora</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fotos</th>
                </tr>
            </table>
        </div>
        <ul class='index' id='pagBotones'>
            <li><button type='button' class='boton' id='bAnt' onclick='anterior()' hidden='hidden'>
                    Pagina anterior
                </button></li>
            <li><button type='button' class='boton' id='bSig' onclick='siguiente()' hidden='hidden'>Pagina siguiente</button></li>
        </ul>
    """
    print(table, file=utf8stdout)
else:
    message = """
        <div class='bienvenida'>No hay avistamientos que mostrar aun, intenta agregar alguno!</div>
    """
    print(message, file=utf8stdout)

foot = """
    </body>
</html>
"""
print(foot, file=utf8stdout)
