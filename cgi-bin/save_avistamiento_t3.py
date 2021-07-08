#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi
import cgitb
from avistamientos_db_t3 import Avistamiento

cgitb.enable()

print("Content-type: text/html\r\n\r\n")

utf8stdout = open(1, 'w', encoding='utf-8', closefd=False)

avisdb = Avistamiento()

form = cgi.FieldStorage()
data = [form['region'].value, form['comuna'].value, form['sector'].value, form['dia-hora-avistamiento'].value,
        form['nombre'].value, form['email'].value, form['celular'].value]
if type(form['tipo-avistamiento']) == list:
    for i in range(len(form['tipo-avistamiento'])):
        avData = [form['tipo-avistamiento'][i].value, form['estado-avistamiento'][i].value,
                  form['foto-avistamiento-'+str(i+1)]]
        data.append(avData)
else:
    avData = [form['tipo-avistamiento'].value, form['estado-avistamiento'].value,
              form['foto-avistamiento-' + str(1)]]
    data.append(avData)

avisdb.save_avistamiento(data)

head = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Abraham Oquiche">
    <title>Avistamiento Enviado</title>
    <link rel="stylesheet" type="text/css" media="screen" href="../style_t3.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
</head>
"""
print(head, file=utf8stdout)

body = """
<body onload='pageRedirect()'>
    <div class="titulo">
        Reporte de avistamiento animal
    </div>
    <ul class="index">
        <li><a href="index_t3.py">Portada</a></li>
        <li><a href="list_t3.py">Ver Listado de Avistamientos</a></li>
        <li><a href="../add_avistamiento_t3.html">Informar Avistamiento</a></li>
        <li><a href="../show_estadistica_t3.html">Mostrar estadisticas</a></li>
    </ul>
    <div class="bienvenida" >Mensaje enviado con exito, sera redirigido a la portada en 5 segundos...</div>
    <script>
        function pageRedirect(){
            var delay = 5000; // time in milliseconds
            setTimeout(function(){
                window.location = "index_t3.py";
            },delay);
        }
    </script>
"""
print(body)

foot = """
    </body>
</html>
"""
print(foot)
