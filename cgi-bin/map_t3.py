#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgitb
import codecs
import sys
import pymysql
import json
from avistamientos_db_t3 import Avistamiento
import datetime

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

avisdb = Avistamiento()

try:
    countPerComuna = avisdb.getCountComMap()
    detPerComuna = avisdb.getDetMap()
    msg = {}
    comCount = {}
    detCom = {}
    comunas = []
    for i in countPerComuna:
        comCount.update({i[0]: i[1]})
        comunas.append(i[0])
    for i in detPerComuna:
        datos = [i[0].strftime("%Y/%m/%d %H:%M"), i[1], i[2], i[3], [i[4]]]
        keys = detCom.keys()
        comuna = i[5]
        if comuna in keys:
            for av in range(len(detCom[comuna])):
                if datos[0:4] == detCom[comuna][av][0:4]:
                    detCom[comuna][av][4].append(i[4])
                else:
                    if datos not in detCom[comuna]:
                        detCom[comuna].append(datos)
        else:
            detCom.update({comuna: [datos]})
    msg.update({"comunas": comunas})
    msg.update({"count_comuna": comCount})
    msg.update({"det_comunas": detCom})
    print(json.dumps(msg))
except pymysql.Error as e:
    print('ERROR CONEXION AL LEER')
avisdb.cursor.close()
