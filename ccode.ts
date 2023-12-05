export const Code = (
  jwt: string,
  unique_id: string,
  ssid: string,
  password: string
) => {
  return `
    #include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h> // Inclua esta biblioteca para a análise JSON

#define DHTPIN 15            // Pino conectado ao DHT11
#define DHTTYPE DHT11
#define RELAY_PIN_LAMP 5     // Pino para o relé da lâmpada
#define RELAY_PIN_COOLER 6   // Pino para o relé do cooler

// Credenciais de Wi-Fi
const char* ssid = ${ssid};
const char* password = ${password};

// URL da API GraphQL
const char* serverName = "https://aguinaldomendes5.pythonanywhere.com/graphql";

// Token JWT para autorização
const char* jwtToken = ${jwt};
const char* unique_id = ${unique_id};

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN_LAMP, OUTPUT);
  pinMode(RELAY_PIN_COOLER, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi");

  dht.begin();
}

void loop() {
  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Falha na leitura do DHT11!");
    return;
  }

  if(WiFi.status()== WL_CONNECTED){
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("JWT ") + jwtToken);

    String graphqlQuery = "{\"query\":\"mutation MyMutation { updateIncubatorDevice(uniqueId: \\\"" + String(unique_id) + "\\\", humiditySensor: \\\"" + String(umidade) + "\\\", isOn: false, temperatureSensor: \\\"" + String(temperatura) + "\\\") { incubatorDevice { humiditySensor isOn startTime temperatureSensor uniqueId currentSetting { humidity temperature incubationDuration } } } }\"}";
    int httpResponseCode = http.POST(graphqlQuery);

    if (httpResponseCode>0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
      
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, response);
      float tempIdeal = doc["data"]["updateIncubatorDevice"]["incubatorDevice"]["currentSetting"]["temperature"];

      if (temperatura < tempIdeal) {
        digitalWrite(RELAY_PIN_LAMP, HIGH);   // Liga a lâmpada
        digitalWrite(RELAY_PIN_COOLER, LOW);  // Desliga o cooler
      } else if (temperatura > tempIdeal) {
        digitalWrite(RELAY_PIN_LAMP, LOW);    // Desliga a lâmpada
        digitalWrite(RELAY_PIN_COOLER, HIGH); // Liga o cooler
      }
    }
    else {
      Serial.print("Erro no código HTTP: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  else {
    Serial.println("Desconectado do Wi-Fi");
  }

  delay(10000); // Aguarda 10 segundos para a próxima leitura
}
    `;
};
