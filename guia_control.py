import argparse
import json
import os

DATA_FILE = 'guias.json'
STATUSES = ['entregado', 'rechazado', 'novedad', 'reprogramado']


def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def add(args):
    data = load_data()
    if args.id in data:
        print(f"La guía {args.id} ya existe.")
        return
    data[args.id] = {'valor': args.valor, 'estado': args.estado}
    save_data(data)
    print(f"Guía {args.id} agregada.")


def update(args):
    data = load_data()
    if args.id not in data:
        print(f"La guía {args.id} no existe.")
        return
    data[args.id]['estado'] = args.estado
    save_data(data)
    print(f"Guía {args.id} actualizada.")


def list_guias(args):
    data = load_data()
    if not data:
        print('No hay guías registradas.')
        return
    for gid, info in data.items():
        print(f"{gid}: valor {info['valor']} - estado {info['estado']}")


def main():
    parser = argparse.ArgumentParser(description='Control de guías')
    sub = parser.add_subparsers(dest='command')

    parser_add = sub.add_parser('add', help='Agregar nueva guía')
    parser_add.add_argument('id', help='ID de la guía')
    parser_add.add_argument('valor', type=float, help='Valor total de la guía')
    parser_add.add_argument('estado', choices=STATUSES, help='Estado inicial de la guía')
    parser_add.set_defaults(func=add)

    parser_update = sub.add_parser('update', help='Actualizar estado de guía')
    parser_update.add_argument('id', help='ID de la guía')
    parser_update.add_argument('estado', choices=STATUSES, help='Nuevo estado de la guía')
    parser_update.set_defaults(func=update)

    parser_list = sub.add_parser('list', help='Listar guías')
    parser_list.set_defaults(func=list_guias)

    args = parser.parse_args()
    if not hasattr(args, 'func'):
        parser.print_help()
        return
    args.func(args)


if __name__ == '__main__':
    main()
