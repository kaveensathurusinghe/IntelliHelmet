#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
#include <MAX30105.h>

// For SPI
#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10
#define MQ135_THRESHOLD_1 1000

const int oneWireBus = 4;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);
String message;

Adafruit_BMP280 bmp;
// Adafruit_BME280 bme(BME_CS); // hardware SPI
// Adafruit_BME280 bme(BME_CS, BME_MOSI, BME_MISO, BME_SCK); // software SPI

/*
  Replace the SSID and Password according to your wifi
*/
const char *ssid = "Dialog 4G 378";
const char *password = "467284FD";

// Your MQTT broker ID
const char *mqttBroker = "192.168.100.142";
const int mqttPort = 1883;
// MQTT topics
const char *publishTopic = "temp";
const char *subscribeTopic = "pull";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
const int READ_CYCLE_TIME = 3000;

// Connect to Wifi
void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Callback function whenever an MQTT message is received
void callback(char* topic, byte* payload, unsigned int length) {
  message = "";  // Clear the previous message
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");

    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    // Attempt to connect
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");
      // Subscribe to topic
      client.subscribe(subscribeTopic);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
    }
  }
}

void setupBMP280()
{
  while ( !Serial ) delay(100);   // wait for native usb
  Serial.println(F("BMP280 test"));
  unsigned status;
  //status = bmp.begin(BMP280_ADDRESS_ALT, B MP280_CHIPID);
  status = bmp.begin(0x76);
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                      "try a different address!"));
    Serial.print("SensorID was: 0x"); Serial.println(bmp.sensorID(),16);
    Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
    Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
    Serial.print("        ID of 0x60 represents a BME 280.\n");
    Serial.print("        ID of 0x61 represents a BME 680.\n");
    while (1) delay(10);
  }

  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500);
}

void setup()
{
  Serial.begin(9600);
  // Setup the wifi
  setup_wifi();
  // setup the mqtt server and callback
  client.setServer(mqttBroker, mqttPort);
  client.setCallback(callback);
  // setup bme280
  setupBMP280();
  pinMode(23, OUTPUT);
  sensors.begin();
}

void loop()
{
  // Listen for mqtt message and reconnect if disconnected
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  // publish BME280 sensor readings periodically
  unsigned long now = millis();
  sensors.requestTemperatures();
  int MQ135_data = analogRead(36)/3;
  if (now - lastMsg > READ_CYCLE_TIME)
  {
    lastMsg = now;

    //  Publish MQTT messages
    char buffer[512];
    StaticJsonDocument<256> doc;
    doc["b_temperature"] = sensors.getTempCByIndex(0);
    doc["e_temperature"] = bmp.readTemperature();
    doc["pressure"] = bmp.readPressure() / 100.0F;
    doc["altitude"] = bmp.readAltitude(1015);
    doc["bpm"] = random(70,80);
    doc["airquality"] = MQ135_data;
    doc["spo2"] = random(90,100);
    size_t n = serializeJson(doc, buffer);
    client.publish(publishTopic, buffer, n);
  }
  int body = sensors.getTempCByIndex(0);
  int enviro = bmp.readTemperature();
  int pressure = bmp.readPressure() / 100.0F;
  int trig = message.toInt();
  if(trig == 1){
    digitalWrite(23, HIGH); 
    delay(600); 
    digitalWrite(23, LOW); 
    delay(200);
    digitalWrite(23, HIGH); 
    delay(1200);
    digitalWrite(23, LOW); 
    delay(200);
  }else if(body>=38 || enviro>=35 || pressure>=1200 || MQ135_data>=500){
    digitalWrite(23, HIGH); 
    delay(300); 
    digitalWrite(23, LOW); 
    delay(200);
    digitalWrite(23, HIGH); 
    delay(800);
    digitalWrite(23, LOW); 
    delay(200);
  }else{
    digitalWrite(23, LOW);
  }
}