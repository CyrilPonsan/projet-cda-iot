#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>
#include <ESP8266HTTPClient.h>

ESP8266WebServer server(80);

struct ConnectionInfos {
  String ssid;
  String password;
};

// valeurs de référence pour obtenir un pourcentage d'humidité
const int dry = 691;
const int wet = 315;

// informations réseau qd l'esp est en mode access point
const char* ssid = "ESP8266_AP";
const char* password = "password";

// nom du fichier dans lequel sont enregistré les infos des différents résaeaux wifi
const char* configFileName = "/config.txt";

unsigned long previousTime = 0;

// intervalle de temps entre deux relevés, cette valeur est mise à jour avec la réponse du backend qd un relevé est posté
unsigned long interval = 0;

int sensorVal;
int percentageHumidity;

// point d'entrée du webserver, affiche un formulaire basique pour enregistrer un nouveau réseau wifi
void handleRoot() {
  String html = "<html><body>";
  html += "<h1>Enter Network Information</h1>";
  html += "<form method='POST' action='/save'>";
  html += "SSID: <input type='text' name='ssid'><br>";
  html += "Password: <input type='password' name='password'><br>";
  html += "<input type='submit' value='Save'>";
  html += "</form>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleSave() {
  String newSSID = server.arg("ssid");
  String newPassword = server.arg("password");


  ssid = newSSID.c_str();
  password = newPassword.c_str();

  // sauvegarde les infos du réseau dans un ficier texte, les infos sont ajoutées à la suite des infos existants déjà
  File configFile = SPIFFS.open(configFileName, "a");
  if (!configFile) {
    Serial.println("Failed to open config file for writing");
  } else {
    configFile.println(newSSID);
    configFile.println(newPassword);
    configFile.close();
    Serial.println("Nouveau réseau enregistré");
  }

  String html = "<html><body>";
  html += "<h1>Network Information Saved!</h1>";
  html += "<p>SSID: " + newSSID + "</p>";

  // affiche la liste des réseaux wifi enregistrés 'sans les mots de passe)
  if (SPIFFS.exists(configFileName)) {
    html += "<h2>Recorded Networks:</h2>";
    File configFile = SPIFFS.open(configFileName, "r");
    while (configFile.available()) {
      String savedSSID = configFile.readStringUntil('\n');
      String savedPassword = configFile.readStringUntil('\n');
      savedSSID.trim();
      savedPassword.trim();
      html += "<p>SSID: " + savedSSID + "</p>";
    }
    configFile.close();
  }
  html += "<form method='POST' action='/reboot'>";
  html += "<input type='submit' value='Reboot'>";
  html += "</form>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// endpoint qui redémarre l'arduino
void handleReboot() {
  Serial.println("Rebooting...");
  ESP.restart();
}

// endpoint qui efface les réseaux enregistrés dans le fichier de configuration
void handleDeleteConfig() {
  if (SPIFFS.remove(configFileName)) {
    Serial.println("Config file deleted");
  } else {
    Serial.println("Failed to delete config file");
  }
  server.send(200, "text/plain", "Config file deleted");
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  if (!SPIFFS.begin()) {
    Serial.println("Echec lors de l'ouverture du système de fichier");
    return;
  }

  // vérification de l'existence du fichier
  if (SPIFFS.exists(configFileName)) {
    File configFile = SPIFFS.open(configFileName, "r");
    if (configFile) {

      // nombre maximum de réseau wifi
      const int maxNetworks = 10;

      //
      ConnectionInfos connections[maxNetworks];
      int numNetworks = 0;

      // les réseaux lus dans le fichier sont placés dans un tzbleau stocké en mémoire
      while (numNetworks < maxNetworks && configFile.available()) {
        String savedSSID = configFile.readStringUntil('\n');
        String savedPassword = configFile.readStringUntil('\n');
        savedSSID.trim();
        savedPassword.trim();
        connections[numNetworks].ssid = savedSSID;
        connections[numNetworks].password = savedPassword;
        numNetworks++;
      }
      configFile.close();

      // tentatives de connexions aux différents réseaux les uns après les autres
      for (int i = 0; i < numNetworks; i++) {
        WiFi.begin(connections[i].ssid.c_str(), connections[i].password.c_str());
        Serial.print("Connexion à ");
        Serial.print(connections[i].ssid);
        Serial.print(" en cours...")

        // les tentatives de connexion durent trente secondes
        int timeout = 15;
        while (WiFi.status() != WL_CONNECTED && timeout > 0) {
          delay(1000);
          Serial.print(".");
          timeout--;
        }
        Serial.println();

        if (WiFi.status() == WL_CONNECTED) {
          Serial.println("Connexion établie !");
          Serial.print("Addresse IP : ");
          Serial.println(WiFi.localIP());
          break;  
        }
      }

      // si l'arduino n'a pas réussi à connecté à aucun réseau il passe en mode access-point
      if (WiFi.status() != WL_CONNECTED) {
        WiFi.mode(WIFI_AP);
        WiFi.softAP(ssid, password);
        Serial.println("Mode access-point activé");
        Serial.print("Adresse IP du point d'accès :");
        Serial.println(WiFi.softAPIP());
      }
    } else {
      Serial.println("Failed to open config file for reading");
      
      // l'arduino passe en mode point d'accès si la lecture du fichier de configuration
      WiFi.mode(WIFI_AP);
      WiFi.softAP(ssid, password);
      Serial.println("Mode access-point activé");
      Serial.print("Adresse IP du point d'accès :");
      Serial.println(WiFi.softAPIP());
    }
  } else {
    // l'arduino passe en mode point d'accès s'il ne trouve pas de fichier de configuration
    WiFi.mode(WIFI_AP);
    WiFi.softAP(ssid, password);
    Serial.println("Mode access-point activé");
    Serial.print("Adresse IP du point d'accès :");
    Serial.println(WiFi.softAPIP());
  }

  // webserver
  server.on("/", handleRoot);
  server.on("/save", handleSave);
  server.on("/delete", handleDeleteConfig);
  server.on("/reboot", handleReboot);
  server.begin();
  Serial.println("Serveur démarré !");
}

void loop() {
  server.handleClient();

  // calcul de l'intervalle de temps écoulé depuis le dernier relevé si la condition est vraie un relevé est effectué
  unsigned long currentTime = millis();
  if (currentTime - previousTime >= interval) {
    previousTime = currentTime;
    readData();
  }
}

void readData() {
  sensorVal = analogRead(A0);
  percentageHumidity = map(sensorVal, wet, dry, 100, 0);

  Serial.print(percentageHumidity);
  if (percentageHumidity > 100) {
    percentageHumidity = 100;
  }
  if (percentageHumidity < 0) {
    percentageHumidity = 0;
  }
  Serial.println(" %");

  // si l'arduino est connecté à un réseau wifi le relevé est posté à l'api
  if (WiFi.status() == WL_CONNECTED) {
    postData(WiFi.macAddress(), percentageHumidity);
  }
}

void postData(String id, int value) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    HTTPClient http;

    client.setInsecure();

    http.begin(client, "https://o1583onjp1.execute-api.eu-west-3.amazonaws.com/prod/humidite/add");

    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"capteurId\":\"" + id + "\",\"txHumidite\":" + String(value) + "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);

      // sérialize la réponse et met à jour l'intervalle de temps entre deux relevés
      interval = response.toInt() * 1000;
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);

      // si l'api retourne une erreur, l'arduino tentera de renvoyer la requête une minute plus tard
      interval = 1 * 60 * 1000;  
    }

    http.end();
  }
}