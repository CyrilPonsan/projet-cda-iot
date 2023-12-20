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

    sensor_id = event['params']['name']
    body = event['body']

    # Connexion à la base de données
    conn = pymysql.connect(db=db_name, user=username, passwd=password, host=host, port=3306)

    try:
        with conn.cursor() as cursor:
            update_sensor = f"UPDATE {table_capt} SET threshold = '{body['threshold']}' timer = '{body['timer']}' " \
                            f"WHERE sensor_id = '{sensor_id}';"
            cursor.execute(update_sensor)
        conn.commit()

        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  # Allow the specified HTTP methods
                'Access-Control-Allow-Headers': 'Content-Type'  # Allow the specified headers
            },
            'body': json.dumps({
                'message': 'Données enregistrées'
            })
        }
        return response

    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()

    finally:
        conn.close()
