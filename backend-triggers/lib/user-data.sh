#! /bin/bash
# become root user
sudo su

# update dependencies
yum -y update

# we'll install 'expect' to input keystrokes/y/n/passwords
yum -y install expect 

# Install Apache
yum -y install httpd

# Start Apache
service httpd start

# Install PHP
yum -y install php php-mysql
# php 7 needed for latest wordpress
amazon-linux-extras -y install php7.2 

# Restart Apache
service httpd restart

# Install MySQL
wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
rpm -ivh mysql-community-release-el7-5.noarch.rpm

yum -y update 
yum -y install mysql-server

# Start MySQL
service mysqld start

# Create a database named alerte_arrosoir if it doesn't exist
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS alerte_arrosoir;"
mysql -uroot -e "CREATE USER 'toto' IDENTIFIED BY '1234';"
mysql -uroot -e "GRANT ALL PRIVILEGES ON alerte_arrosoir.* TO 'toto'@'%';"
mysql -uroot -e "FLUSH PRIVILEGES;"

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
        humidity_level INT NOT NULL,
        has_been_seen BOOLEAN DEFAULT false,
        sensor_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (sensor_id) REFERENCES sensor(id)
      );"

mysql -uroot alerte_arrosoir -e "DELIMITER //
CREATE TRIGGER check_humidity_threshold AFTER INSERT ON humidity FOR EACH ROW BEGIN DECLARE capteurSeuil INT; SELECT threshold INTO capteurSeuil FROM sensor WHERE id = NEW.sensor_id; IF NEW.humidity_level <= capteurSeuil THEN INSERT INTO alert (sensor_id, humidity_level) VALUES (NEW.sensor_id, NEW.humidity_level); END IF; END//
DELIMITER;"

# Secure database
# non interactive mysql_secure_installation with a little help from expect.

SECURE_MYSQL=$(expect -c "

set timeout 10
spawn mysql_secure_installation

expect \"Enter current password for root (enter for none):\"
send \"\r\"

expect \"Change the root password?\"
send \"y\r\"
expect \"New password:\"
send \"1234\r\"
expect \"Re-enter new password:\"
send \"1234\r\"
expect \"Remove anonymous users?\"
send \"y\r\"

expect \"Disallow root login remotely?\"
send \"y\r\"

expect \"Remove test database and access to it?\"
send \"y\r\"

expect \"Reload privilege tables now?\"
send \"y\r\"

expect eof
")


echo "$SECURE_MYSQL"
