#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi
import cgitb
from avistamientos_db_t3 import Avistamiento

cgitb.enable()

print("Content-type: text/html\r\n\r\n")

utf8stdout = open(1, 'w', encoding='utf-8', closefd=False)

avisdb = Avistamiento()
data = avisdb.get_5_last_avistamientos()
countPerComuna = avisdb.getCountComMap()
detPerComuna = avisdb.getDetMap()

head = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Abraham Oquiche">
    <title>Avistamiento Animal</title>
    <link rel="stylesheet" type="text/css" media="screen" href="../style_t3.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
    <script src='../static/showMap_t3.js'></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
</head>
"""
print(head, file=utf8stdout)

body = """
<body onload='startApp()'>
    <div class="titulo">
        Reporte de avistamiento animal
    </div>
    <ul class="index">
        <li><a class = "active" href="index_t3.py">Portada</a></li>
        <li><a href="list_t3.py">Ver Listado de Avistamientos</a></li>
        <li><a href="../add_avistamiento_t3.html">Informar Avistamiento</a></li>
        <li><a href="../show_estadistica_t3.html">Mostrar estadisticas</a></li>
    </ul>
    <div class="bienvenida">
        Bienvenido a la web de reporte de avistamiento animal, aqui podra ver los ultimos avistamientos reportados
        y generar reportes propios
    </div>
    <div id='ajax_container'>
        <div id='map_container' class='showing'><div id='mapid'></div></div>
        <div id='det_av_container' class='inactive'></div>
    </div>
"""
print(body, file=utf8stdout)

if len(data) != 0:
    tableIndex = """
        <div>
            <table class="tabla">
                <tr>
                    <th>Dia-Hora</th>
                    <th>Comuna</th>
                    <th>Sector</th>
                    <th>Tipo</th>
                    <th>Foto</th>
                </tr>
    """
    print(tableIndex, file=utf8stdout)

    for d in data:
        path = avisdb.getFotoPath(d[0])[0][0]
        table = f"""
            <tr>
                <td>{d[1]}</td>
                <td>{d[2]}</td>
                <td>{d[3]}</td>
                <td>{d[4]}</td>
                <td><img src='../media/{path}' height="320" width="240"></td>
            </tr>
        """
        print(table, file=utf8stdout)

    tableFoot = """
                </table>
            </div>
    """
    print(tableFoot, file=utf8stdout)

foot = """

    </body>
</html>
"""
print(foot, file=utf8stdout)
