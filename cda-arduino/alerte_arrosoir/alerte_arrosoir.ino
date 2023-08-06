#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>  // Include the SPIFFS library

ESP8266WebServer server(80);

struct ConnectionInfos {
  String ssid;
  String password;
};



const char* ssid = "ESP8266_AP";    // SSID for the access point
const char* password = "password";  // Password for the access point

const char* configFileName = "/config.txt";  // File name to store network configuration

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

  // Store the new network information in variables
  ssid = newSSID.c_str();
  password = newPassword.c_str();

  // Save the network configuration to a file
  File configFile = SPIFFS.open(configFileName, "a");  // Use "a" mode to append to the file instead of overwriting
  if (!configFile) {
    Serial.println("Failed to open config file for writing");
  } else {
    configFile.println(newSSID);
    configFile.println(newPassword);
    configFile.close();
    Serial.println("Network configuration saved to file");
  }

  String html = "<html><body>";
  html += "<h1>Network Information Saved!</h1>";
  html += "<p>SSID: " + newSSID + "</p>";
  // Password is not displayed for security reasons

  // Display the list of recorded networks
  if (SPIFFS.exists(configFileName)) {
    html += "<h2>Recorded Networks:</h2>";
    File configFile = SPIFFS.open(configFileName, "r");
    while (configFile.available()) {
      String savedSSID = configFile.readStringUntil('\n');
      String savedPassword = configFile.readStringUntil('\n');
      savedSSID.trim();
      savedPassword.trim();
      html += "<p>SSID: " + savedSSID + "</p>";
      // Password is not displayed for security reasons
    }
    configFile.close();
  }
  html += "<form method='POST' action='/reboot'>";
  html += "<input type='submit' value='Reboot'>";
  html += "</form>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleReboot() {
  Serial.println("Rebooting...");
  ESP.restart();
}

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

  // Initialize SPIFFS
  if (!SPIFFS.begin()) {
    Serial.println("Failed to initialize SPIFFS");
    return;
  }

  // Check if the config file exists
  if (SPIFFS.exists(configFileName)) {
    File configFile = SPIFFS.open(configFileName, "r");
    if (configFile) {
      // Read the network configurations from the file and store them in an array
      const int maxNetworks = 5;  // Change this value based on the number of networks you want to support
      ConnectionInfos connections[maxNetworks];
      int numNetworks = 0;

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

      // Attempt to connect to each network one by one
      for (int i = 0; i < numNetworks; i++) {
        WiFi.begin(connections[i].ssid.c_str(), connections[i].password.c_str());
        Serial.print("Connecting to ");
        Serial.print(connections[i].ssid);

        // Wait for connection or timeout (30 seconds)
        int timeout = 15;
        while (WiFi.status() != WL_CONNECTED && timeout > 0) {
          delay(1000);
          Serial.print(".");
          timeout--;
        }
        Serial.println();

        if (WiFi.status() == WL_CONNECTED) {
          Serial.println("Connected to the network!");
          Serial.print("IP address: ");
          Serial.println(WiFi.localIP());
          break;  // Exit the loop if connected to any network
        }
      }

      // If none of the networks succeeded, set ESP8266 in access point mode
      if (WiFi.status() != WL_CONNECTED) {
        WiFi.mode(WIFI_AP);
        WiFi.softAP(ssid, password);
        Serial.println("Access Point mode activated");
        Serial.print("Access Point IP address: ");
        Serial.println(WiFi.softAPIP());
      }
    } else {
      Serial.println("Failed to open config file for reading");
      // If config file not readable, set ESP8266 in access point mode
      WiFi.mode(WIFI_AP);
      WiFi.softAP(ssid, password);
      Serial.println("Access Point mode activated");
      Serial.print("Access Point IP address: ");
      Serial.println(WiFi.softAPIP());
    }
  } else {
    // If config file does not exist, set ESP8266 in access point mode
    WiFi.mode(WIFI_AP);
    WiFi.softAP(ssid, password);
    Serial.println("Access Point mode activated");
    Serial.print("Access Point IP address: ");
    Serial.println(WiFi.softAPIP());
  }

  // Other setup code...

  server.on("/", handleRoot);
  server.on("/save", handleSave);
  server.on("/delete", handleDeleteConfig);
  server.on("/reboot", handleReboot);
  server.begin();
  Serial.println("Server started!");
}


void loop() {
  server.handleClient();
}
