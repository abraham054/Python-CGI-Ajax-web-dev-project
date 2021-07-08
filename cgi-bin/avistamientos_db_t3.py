#!/usr/bin/python3
# -*- coding: utf-8 -*-

import mysql.connector
import hashlib
from filetype import *
import os
import re


# python -m http.server --bind localhost --cgi 8000

def checkFotoError(foto):
    foto_name = foto.filename
    if not foto_name:
        print("error de archivo no subido")


class Avistamiento:
    def __init__(self):
        self.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="tarea4"
        )
        self.cursor = self.db.cursor(buffered=True)

    def save_avistamiento(self, data):
        # guardar el avistamiento:
        # conseguir el id de la region
        get_region_id_sql = "SELECT id FROM region WHERE nombre = '{region}'".format(region=data[0])
        self.cursor.execute(get_region_id_sql)
        region_id = self.cursor.fetchall()[0][0]  # id de la region
        # conseguir el id de la comuna
        get_comuna_id_sql = "SELECT id FROM comuna WHERE nombre = '{comuna}' AND region_id = '{region}';".format(
            comuna=data[1], region=region_id
        )
        self.cursor.execute(get_comuna_id_sql)
        comuna_id = self.cursor.fetchall()[0][0]  # id de la comuna
        # guardar datos del avistamiento
        av_sql = """
        INSERT INTO avistamiento(comuna_id, dia_hora, sector, nombre, email, celular)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(av_sql, (comuna_id, data[3], data[2], data[4], data[5], data[6]))
        self.db.commit()
        id_avistamiento = self.cursor.getlastrowid()  # id del avistamiento

        for i in range(len(data) - 7):
            detAv = data[i + 7]
            self.saveDetAv(detAv, id_avistamiento, data[3])

    def saveDetAv(self, detAv, idAv, dia_hora):
        # guardar el detalle avistamiento
        det_av_sql = """
        INSERT INTO detalle_avistamiento(dia_hora, tipo, estado, avistamiento_id)
        VALUES (%s, %s, %s, %s)
        """
        self.cursor.execute(det_av_sql, (dia_hora, detAv[0], detAv[1], idAv))
        self.db.commit()
        id_det_av = self.cursor.getlastrowid()  # id del detalle avistamiento

        # guardar foto
        fileobj = detAv[2]
        if type(fileobj) is list:
            for foto in fileobj:
                checkFotoError(foto)
                self.saveFoto(foto, id_det_av)
        else:
            checkFotoError(fileobj)
            self.saveFoto(fileobj, id_det_av)

    def saveFoto(self, fileobj, det_av_id):
        filename = fileobj.filename

        # calculamos la cantidad de elementos en la tabla fotos y actualizamos el hash
        sql = "SELECT COUNT(id) FROM foto"
        self.cursor.execute(sql)
        total = self.cursor.fetchall()[0][0] + 1
        hash_archivo = str(total) + hashlib.sha256(filename.encode()).hexdigest()[0:30]

        # guardar el archivo
        file_path = './media/' + hash_archivo
        open(file_path, 'wb').write(fileobj.file.read())

        # verificamos el tipo, si no es valido lo borramos de la db
        tipo = filetype.guess(file_path)
        image_type = r"image([/]{1}[a-z]+)?"
        if not re.match(image_type, tipo.mime):
            os.remove(file_path)
            print("error de archivo no imagen")

        # guardamos la imagen en la db
        sql = """
            INSERT INTO foto (ruta_archivo, nombre_archivo, detalle_avistamiento_id)
            VALUES (%s, %s, %s)
        """
        self.cursor.execute(sql, (hash_archivo, filename, det_av_id))
        self.db.commit()

    def getAvistamientos(self):
        sql = "SELECT id, comuna_id, dia_hora, sector, nombre, email, celular FROM avistamiento"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getDetalleAvistamientos(self):
        sql = "SELECT * FROM detalle_avistamiento "
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getFotos(self):
        sql = "SELECT detalle_avistamiento_id, ruta_archivo FROM `foto`"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getComuna(self, id):
        sql = f"SELECT nombre FROM comuna WHERE id = {id}"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def get_5_last_avistamientos(self):
        sql = """
        SELECT DA.id, DA.dia_hora, CO.nombre, AV.sector, DA.tipo 
        FROM avistamiento AV, detalle_avistamiento DA, comuna CO 
        WHERE DA.avistamiento_id = AV.id 
        AND AV.comuna_id=CO.id 
        ORDER BY DA.dia_hora DESC LIMIT 5
        """
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getFotoPath(self, da_id):
        sql = "SELECT ruta_archivo FROM foto WHERE detalle_avistamiento_id = {detalle_id} LIMIT 1;".format(
            detalle_id=da_id)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getTotalAvistamientos(self, av_id):
        sql = "SELECT COUNT(id) FROM detalle_avistamiento WHERE avistamiento_id = {avistamiento_id}".format(
            avistamiento_id=av_id)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getTotalFotos(self, av_id):
        sql = f"""
            SELECT COUNT(f.id)
            FROM foto AS f
            WHERE f.detalle_avistamiento_id in (
                SELECT d.id
                FROM detalle_avistamiento AS d
                WHERE d.avistamiento_id = {av_id}
            )
        """
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getDia_hora(self):
        sql = "SELECT dia_hora FROM `detalle_avistamiento`"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getTipo(self):
        sql = "SELECT tipo FROM `detalle_avistamiento`"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getEstado(self):
        sql = "SELECT dia_hora, estado FROM `detalle_avistamiento`"
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getDetMap(self):
        sql = """
            SELECT a.dia_hora, d.tipo, d.estado, d.id, f.ruta_archivo, c.nombre
            FROM foto as f, detalle_avistamiento as d, avistamiento as a, comuna as c
            WHERE f.detalle_avistamiento_id = d.id
            AND d.avistamiento_id = a.id
            AND a.comuna_id = c.id
            """
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def getCountComMap(self):
        sql = """
                SELECT c.nombre, COUNT(f.id)
                FROM foto as f, detalle_avistamiento as d, avistamiento as a, comuna as c
                WHERE f.detalle_avistamiento_id = d.id
                AND d.avistamiento_id = a.id
                AND a.comuna_id = c.id
                GROUP BY c.nombre
            """
        self.cursor.execute(sql)
        return self.cursor.fetchall()
