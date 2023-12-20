import json
import os
import pymysql


def lambda_handler(event, context):
    # Informations de connexion à la base de données
    host = os.environ['HOST']
    username = os.environ['USERNAME']
    password = os.environ['PASSWORD']
    db_name = os.environ['DB_NAME']
    table_capt = os.environ['TABLE_CAPT']
    status_code = 200
    body = "success"

    name = event['params']['name']

    # Connexion à la base de données
    conn = pymysql.connect(db=db_name, user=username, passwd=password, host=host, port=3306)

    try:
        with conn.cursor() as cursor:
            check_sensor = f"SELECT COUNT(*) FROM {table_capt} WHERE name = '{name}';"
            cursor.execute(check_sensor)
            result = cursor.fetchone()
            print(f"result : {result}")
            if result and result[0] == 0:
                status_code = 404
                body = "La plante n'existe pas"

            response = {
                'statusCode': status_code,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': body
            }
            return response
    finally:
        conn.close()
