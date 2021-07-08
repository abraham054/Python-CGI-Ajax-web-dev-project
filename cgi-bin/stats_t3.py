#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgitb
import codecs
import sys
import pymysql
import json
from avistamientos_db_t3 import Avistamiento

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

avisdb = Avistamiento()

try:
    msgDia_hora = avisdb.getDia_hora()
    msgTipo = avisdb.getTipo()
    msgEstado = avisdb.getEstado()
    msg = {}
    dicDia_hora = {}
    dicTipo = {}
    dicEstado = {}
    dicContDia = [0, 0, 0, 0, 0, 0, 0]
    dicContTipo = {"no sé": 0, "insecto": 0, "arácnido": 0, "miriápodo": 0}
    dicContEstado = {"no sé":   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     "vivo":    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     "muerto":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
    k = 0
    largo = len(msgDia_hora)
    for i in range(largo):
        dia = msgDia_hora[i][0].isoweekday()
        dicContDia[dia - 1] += 1
        tipo = msgTipo[i][0]
        dicContTipo[tipo] += 1
        dateEstadoMes = msgEstado[i][0].month
        estado = msgEstado[i][1]
        dicContEstado[estado][dateEstadoMes - 1] += 1
    msg.update({"dia-cont": dicContDia})
    msg.update({"tipo": dicContTipo})
    msg.update({"estado-mes-cont": dicContEstado})
    print(json.dumps(msg))
except pymysql.Error as e:
    print('ERROR CONEXION AL LEER')
avisdb.cursor.close()
