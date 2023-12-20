import json
import pymysql
from datetime import datetime
import os
from random import randint


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def lambda_handler(event, context):
    # Informations de connexion à la base de données
    host = os.environ['HOST']
    username = os.environ['USERNAME']
    password = os.environ['PASSWORD']
    db_name = os.environ['DB_NAME']
    table_capt = os.environ['TABLE_CAPT']
    table_data = os.environ['TABLE_DATA']

    # Connexion à la base de données
    conn = pymysql.connect(db=db_name, user=username, passwd=password, host=host, port=3306)

    try:
        with conn.cursor() as cursor:
            get_data_string = (
                f"SELECT * FROM {table_data} "
                f"WHERE (sensor_id, id) IN ("
                f"    SELECT sensor_id, MAX(id) AS max_id FROM {table_data} GROUP BY sensor_id"
                f")")
            cursor.execute(get_data_string)
            results = cursor.fetchall()
            records = [dict(zip([column[0] for column in cursor.description], row)) for row in results]
            print(f"records : {records}")
            for record in records:
                random_number = randint(1, 5)
                new_rate = record['humidity_level'] - random_number
                if new_rate < 0:
                    new_rate = 0
                post_string = f"INSERT INTO {table_data} (humidity_level, sensor_id) VALUES({new_rate}, {record['sensor_id']});"
                cursor.execute(post_string)
        conn.commit()
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': "Données enregistrées"
        }
        return response

    finally:
        conn.close()
   conn.close()