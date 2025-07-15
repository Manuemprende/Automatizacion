# Automatizacion

Este repositorio contiene un pequeño script en Python para llevar el control de guías.

## Requisitos

- Python 3.8 o superior

## Uso

Agregar una guía:

```
python guia_control.py add <id> <valor> <estado>
```

Actualizar el estado de una guía:

```
python guia_control.py update <id> <estado>
```

Listar guías registradas:

```
python guia_control.py list
```

Estados válidos: `entregado`, `rechazado`, `novedad`, `reprogramado`.

La información se almacena en el archivo `guias.json` en el mismo directorio.
