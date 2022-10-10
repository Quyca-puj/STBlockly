Personaje: ip, color, alias

Acciones:
EMociones . emocion
Movimiento por seguimiento de liena velocidad y la emocion.
movimiento por tiempo. - tiempo y la velocidad
Custom - velocidad
Lista de acciones - no hay parametros

ToDos:
eliminar edge OK
key unica entre grafos OK
Pintar flechas de nodo a nodo. OK
Ocultar menu de modificaciones del nodo. OK
Cambiar backend (Java) con restricciones de movimiento OK
Agregar esas restricciones de movimiento al backend OK
Check al agregar edge  OK
Integrar para traer acciones. OK
Cambiar backend (python) con restricciones de movimiento OK
Bug traer acciones OK
Botones de cargar y guardar para el grafo OK
Borrar Nodos. OK
Pintar params dinamicamente y dejar drop con las acciones. OK 
Pensar en los nombres OK
Bug adelante_atras. OK
Probar Borrar nodos OK
ActionLists OK
Problema Raro cargando attribs - wtf OK
Probar Transformacion a/en Java OK - OK
Probar OK
Validaciones adicionales en front. OK
POner front lindo. OK
Error cargar grafo OK
Prueba calibracion OK
Guardar personajes y guardar grafo. OK
HashMap de places y ack. Recibimos ack OK
Agregar transicion de salida. Tener en cuenta que toca cerrar todos los recursos. Sockets de entrada y de salida y el websockets. OK
WebSocket para actualizar GUI OK
Actualizar Grafo y colores por estado OK 
Gestion de condiciones para la net en el gui. Ok
Crear una sola transicion de entrada y una de salida OK
Probar generacion de obra con actionList. OK

Arreglar bloques medios y bajos. OK
Agregar solicitud de connect. Ok
Arreglar App Ok
Acciones que se pueden cola. OK
Pasar Lib actualizada.OK
Arreglar secuencia de asincronas. OK
Solo mandar info de personajes activos. OK

Bug con comandos emocionales. Velocidad y modulacion emocional.

Nodos diferentes sincorno y asincrono. Si se logra esta se puede cambiar a la anterior.
ver electron

Que pasa con comandos asinconors en el fin? Se quedan activos. 


{
    "morado": {
        "charac_name": "Maribel",
        "charac_alias": "morado",
        "charac_ip": "192.168.1.16",
        "charac_color": "#e02929"
    }
}

{
    "options": {
        "type": "directed",
        "multi": False,
        "allowSelfLoops": False
    },
    "attributes": {},
    "nodes": [
        {
            "key": "33abc989-96ac-4d19-8e60-2b56350de7f3",
            "attributes": {
                "size": 20,
                "color": "#e02929",
                "x": 0,
                "y": 0,
                "isInPlayground": False,
                "highlighted": False,
                "charac": {
                    "charac_name": "Maribel",
                    "charac_alias": "morado",
                    "charac_ip": "192.168.1.16",
                    "charac_color": "#e02929"
                },
                "params": {},
                "label": "Maribel-SoloBase",
                "action": {
                    "name": "SoloBase",
                    "translatedName": "SoloBase",
                    "actions": [
                        {
                            "action": "stop_mvt",
                            "emotion": "very_happy"
                        },
                        {
                            "action": "t_forward",
                            "params": "100 5"
                        },
                        {
                            "action": "stop_mvt",
                            "emotion": "very_sad"
                        },
                        {
                            "action": "t_left",
                            "params": "50 3"
                        },
                        {
                            "action": "stop_mvt",
                            "emotion": "neutral"
                        },
                        {
                            "action": "t_reverse",
                            "params": "10 10"
                        }
                    ],
                    "conditions": [
                        "",
                        "motor"
                    ]
                }
            }
        }
    ],
    "edges": []
}




{
    "options": {
        "type": "directed",
        "multi": false,
        "allowSelfLoops": false
    },
    "attributes": {},
    "nodes": [
        {
            "key": "940a188e-3529-4870-b230-a673b896f28c",
            "attributes": {
                "size": 20,
                "color": "#e02929",
                "x": 0.0029296875,
                "y": -0.0224609375,
                "isInPlayground": false,
                "highlighted": false,
                "charac": {
                    "charac_name": "Maribel",
                    "charac_alias": "morado",
                    "charac_ip": "192.168.1.16",
                    "charac_color": "#e02929"
                },
                "params": {
                    "Velocidad": "0",
                    "Tiempo": "0"
                },
                "label": "Maribel-Atras-Tiempo",
                "action": {
                    "name": "t_reverse",
                    "translatedName": "Atras-Tiempo",
                    "conditions": [
                        "motor"
                    ],
                    "parameters": [
                        {
                            "name": "speed",
                            "type": "numeric",
                            "translatedName": "Velocidad",
                            "position": 0
                        },
                        {
                            "name": "time",
                            "type": "numeric",
                            "translatedName": "Tiempo",
                            "position": 1
                        }
                    ]
                }
            }
        }
    ],
    "edges": []
}