
#Python CGI Ajax web dev project

## Descripcion del proyecto
Este proyecto fue realizado para el curso de
desarrollo de aplicaciones web de la Universidad de Chile,
consta de una aplicacion para identificar y subir avistamientos
de animales en las regiones de Chile.

## Iniciar el local host y servidor local
Se inicia un local host corriendo el comando 
```python -m http.server --bind localhost --cgi 8000```
en la terminal, desde ahi usando el programa xammp 
creamos un servidor local iniciando MySQL y Apache

## Creacion de la base de datos
Entrando al ```http://localhost/phpmyadmin/``` desde algun navegador
podemos empezar a crear la base de datos, para eso corremos los
comando sql encontrados en los archivos
```tarea3.sql``` y ```region-comuna.sql```, el primero se encarga
de crear las bases de datos necesarias para el proyecto, mientras
el segundo rellena la tabla comuna y region, necesarias para
el correcto funcionamiento de la aplicacion web

## Uso de la aplicacion
Dentro del ```http://localhost:8000/cgi-bin/index_t3.py``` nos encontraremos
en la pantalla principal de la aplicacion donde veremos los ultimos avistamientos reportados
y un mapa que los muestra de manera geografica. En las otras pestañas
se podra ver mas detalles de los avistamientos y reportar nuevos, ademas de 
poder acceder a estadisticas con respecto a la naturaleza de los avistamientos
