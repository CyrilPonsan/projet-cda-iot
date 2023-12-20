import json
import os
from datetime import datetime
import pymysql


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
    table_data = os.environ['TABLE_DATA']

    # Connexion à la base de données
    conn = pymysql.connect(db=db_name, user=username, passwd=password, host=host, port=3306)

    try:
        with conn.cursor() as cursor:
            get_sensor_list = f"SELECT h.id, h.humidity_level, h.created_at, h.sensor_id, s.name as sensor_name " \
                f"FROM {table_data} h " \
            f"INNER JOIN (" \
                f"SELECT sensor_id, MAX(created_at) AS max_created_at " \
                f"FROM {table_data} " \
                f"GROUP BY sensor_id" \
                f") latest_humidity ON h.sensor_id = latest_humidity.sensor_id AND h.created_at = " \
                f"latest_humidity.max_created_at " \
                f"INNER JOIN sensor s ON h.sensor_id = s.id;"
            cursor.execute(get_sensor_list)
            results = cursor.fetchall()
            records = [dict(zip([column[0] for column in cursor.description], row)) for row in results]
            json_data = json.dumps(records, cls=DateTimeEncoder)
            print(json_data)
            response = {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.loads(json_data)
            }
            return response
    finally:
        conn.close()


"""
DELIMITER //
CREATE TRIGGER check_humidity_threshold AFTER INSERT ON humidity FOR EACH ROW BEGIN DECLARE capteurSeuil INT; SELECT threshold INTO capteurSeuil FROM sensor WHERE id = NEW.sensor_id; IF NEW.humidity_level <= capteurSeuil THEN INSERT INTO alert (sensor_id, humidity_level) VALUES (NEW.sensor_id, NEW.humidity_level); END IF; END//
DELIMITER ;
"""