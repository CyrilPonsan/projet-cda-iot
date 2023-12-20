import sys
import logging
import pymysql
import json
import os


def lambda_handler(event, context):
    try:
        host = os.environ['HOST']
        username = os.environ['USERNAME']
        password = os.environ['PASSWORD']
        db_name = os.environ['DB_NAME']
        table_data = os.environ['TABLE_DATA']
        table_sensor = os.environ['TABLE_CAPT']

        logger = logging.getLogger()
        logger.setLevel(logging.INFO)

        conn = pymysql.connect(host=host, user=username, passwd=password, db=db_name, connect_timeout=5)

        logger.info("SUCCESS: Connection to MySQL instance succeeded")

        request_body = event

        # Assuming the body contains a JSON payload, you can parse it using the json module
        json_payload = request_body

        # Access specific data from the JSON payload
        capteur_id = json_payload['capteur_id']
        tx_humidite = json_payload['tx_humidite']
        table_capteur_string = f"CREATE TABLE IF NOT EXISTS sensor (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) " \
                               f"NOT NULL, threshold INT NOT NULL, timer INT NOT NULL, created_at DATETIME DEFAULT " \
                               f"CURRENT_TIMESTAMP, PRIMARY KEY (id));"
        table_tx_humidite_string = f"CREATE TABLE IF NOT EXISTS humidity (id INT AUTO_INCREMENT NOT NULL, " \
                                   f"created_at DATETIME DEFAULT CURRENT_TIMESTAMP, humidity_level INT NOT NULL, sensor_id " \
                                   f"INT " \
                                   f"NOT NULL, PRIMARY KEY (id), FOREIGN KEY (sensor_id) REFERENCES sensor(id));"
        table_alerte_string = f"CREATE TABLE IF NOT EXISTS alert (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME " \
                              f"DEFAULT CURRENT_TIMESTAMP, humidity_level INT NOT NULL, has_been_seen BOOLEAN DEFAULT " \
                              f"false, sensor_id INT NOT NULL, " \
                              f"PRIMARY KEY (id), FOREIGN KEY (sensor_id) REFERENCES sensor(id));"
        capteur_info_string = f"select * from {table_sensor} where name = '{capteur_id}'"
        print("avant")
        with conn.cursor() as cur:
            cur.execute(table_capteur_string)
            cur.execute(table_tx_humidite_string)
            cur.execute(table_alerte_string)
            cur.execute(capteur_info_string)
            result = cur.fetchone()
            print("apres")
            if result is None:
                sql_string = f"insert into {table_sensor} (name, threshold, timer) values('{capteur_id}', '{25}', '{60}')"
                cur.execute(sql_string)
                conn.commit()
                capteur_id = cur.lastrowid
            else:
                capteur_id = result[0]
            logger.info("The following items have been added to the database:")
            sql_string = f"insert into {table_data} (humidity_level, sensor_id) values('{tx_humidite}', '{capteur_id}');"
            cur.execute(sql_string)
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