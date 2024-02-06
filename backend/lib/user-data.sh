#!/bin/bash

# become root user
sudo su

# update dependencies
yum -y update

# install 'expect' to input keystrokes/y/n/passwords
yum -y install expect

# Install Apache
yum -y install httpd

# Start Apache
service httpd start

# Install PHP
yum -y install php php-mysql
# php 7 needed for latest WordPress
amazon-linux-extras -y install php7.2

# Restart Apache
service httpd restart

# Install MariaDB (instead of MySQL)
yum -y install mariadb105-server

# Start MariaDB
systemctl start mariadb

# Secure MariaDB
mysql_secure_installation <<EOF

y
$ROOT_PASSWORD
$ROOT_PASSWORD
y
y
y
y
EOF

# Create a database named alerte_arrosoir if it doesn't exist
mysql -uroot -p"$ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS alerte_arrosoir;"
mysql -uroot -p"$ROOT_PASSWORD" -e "CREATE USER 'toto' IDENTIFIED BY '${USER_PASSWORD}';"
mysql -uroot -p"$ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON alerte_arrosoir.* TO 'toto'@'%';"
mysql -uroot -p"$ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

# Continue with the rest of your script...


# Continue with the rest of your script...


# Create a table named sensor in the alerte_arrosoir database
mysql -uroot alerte_arrosoir -e "CREATE TABLE IF NOT EXISTS sensor (
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        threshold INT NOT NULL,
        timer INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );"

# Create a table named humidity in the alerte_arrosoir database
mysql -uroot alerte_arrosoir -e "CREATE TABLE IF NOT EXISTS humidity (
        id INT AUTO_INCREMENT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        humidity_level INT NOT NULL,
        sensor_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (sensor_id) REFERENCES sensor(id)
      );"

# Create a table named alert in the alerte_arrosoir database
mysql -uroot alerte_arrosoir -e "CREATE TABLE IF NOT EXISTS alert (
        id INT AUTO_INCREMENT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        has_been_seen BOOLEAN DEFAULT false,
        sensor_id INT NOT NULL,
        level_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (sensor_id) REFERENCES sensor(id),
        FOREIGN KEY (level_id) REFERENCES humidity(id) ON DELETE CASCADE
      );"

mysql -uroot alerte_arrosoir -e "DELIMITER //
CREATE TRIGGER check_humidity_threshold AFTER INSERT ON humidity FOR EACH ROW BEGIN DECLARE capteurSeuil INT; SELECT threshold INTO capteurSeuil FROM sensor WHERE id = NEW.sensor_id; IF NEW.humidity_level <= capteurSeuil THEN INSERT INTO alert (sensor_id, level_id) VALUES (NEW.sensor_id, NEW.id); END IF; END//
DELIMITER;"

mysql -uroot alerte_arrosoir -e "DELIMITER //
CREATE TRIGGER insert_humidity_level AFTER INSERT ON sensor FOR EACH ROW BEGIN INSERT INTO humidity (created_at, sensor_id, humidity_level) VALUES (NOW(), NEW.id, 100); END//
DELIMITER;"

mysql -uroot alerte_arrosoir -e "DELIMITER //

CREATE PROCEDURE delete_levels()
BEGIN
  DECLARE cutoff_date DATETIME;

  SET cutoff_date = NOW() - INTERVAL 15 DAY;

  DELETE FROM alerte_arrosoir.humidity
  WHERE created_at < cutoff_date;
END //

DELIMITER;"

mysql -uroot alerte_arrosoir -e "DELIMITER //

CREATE PROCEDURE delete_alerts()
BEGIN
  DECLARE cutoof_date DATETIME;

  SET cutoff_date = NOW() - INTERVAL 3 DAY;

  DELETE FROM alerte_arrosoir.alert
  WHERE created_at < cutoff_date;
END //

DELIMITER;"

mysql -uroot alerte_arrosoir  -e "DELIMITER //

CREATE PROCEDURE monitor_events()
BEGIN
  SELECT event_schema, event_name, last_executed
  FROM information_schema.events
  WHERE event_schema = 'alerte_arrosoir' AND event_name = 'delete_humidity_data';
END //

DELIMITER;

mysql -uroot alerte_arrosoir -e "CREATE EVENT IF NOT EXISTS delete_humidity_data
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '00:00:00')
DO
  CALL delete_levels;
  CALL delete_alerts;"

mysql -uroot alerte_arrosoir -e "SET GLOBAL event_scheduler = ON;"
