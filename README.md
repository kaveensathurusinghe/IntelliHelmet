# IntelliHelmet

A smart IoT safety helmet system designed for mining operations. It monitors worker health and environmental conditions in real time, streams data over MQTT, and provides a supervisory web dashboard with remote emergency alert controls.

---

## System Architecture

```
[ESP32 + Sensors]
       |
     WiFi
       |
 [MQTT Broker :1883]
       |
       +---> [Node.js Dashboard :9001]  (real-time charts & gauges)
       |
       +---> [Web Interface]            (worker management & login)
```

---

## Hardware Components

| Component | Interface | Purpose |
|-----------|-----------|---------|
| ESP32-DevKit-v1 | — | Main microcontroller |
| DS18B20 | OneWire (GPIO 4) | Body temperature |
| BMP280 | I2C (0x76) | Env. temperature, pressure, altitude |
| MAX30105 | I2C | Heart rate (BPM) & SpO2 |
| MQ135 | Analog ADC (GPIO 36) | Air quality (ppm) |
| Buzzer | Digital (GPIO 23) | Alert output |

---

## Alert Thresholds

| Parameter | Threshold |
|-----------|-----------|
| Body Temperature | ≥ 38°C |
| Environmental Temperature | ≥ 35°C |
| Atmospheric Pressure | ≥ 1200 hPa |
| Air Quality | ≥ 500 ppm |

---

## Project Structure

```
IntelliHelmet/
├── Node_mcu/                              # ESP32 firmware
│   ├── src/
│   │   └── main.cpp                       # Main firmware source
│   └── platformio.ini                     # PlatformIO build config
│
├── mqtt-custom-dashboard-node-js-main/    # Real-time dashboard
│   ├── app.js                             # Express server
│   ├── .env                               # Environment config
│   ├── routes/
│   │   └── dashboard.js
│   ├── views/pages/
│   │   └── dashboard.ejs                  # Dashboard template
│   └── public/
│       ├── index.js                       # Frontend logic & charts
│       ├── mqttService.js                 # MQTT WebSocket client
│       └── style.css
│
└── website(html part)/                    # Web management interface
    ├── index.HTML                         # Supervisor hub
    ├── login.html                         # Login page
    ├── guards.html                        # Miner tracking page
    ├── registration form.html             # Worker registration
    └── connect.php                        # MySQL registration handler
```

---

## Setup Guide

### Prerequisites

- [PlatformIO IDE](https://platformio.org/) or PlatformIO CLI
- [Node.js](https://nodejs.org/) v16 or higher
- MQTT Broker (e.g., [Mosquitto](https://mosquitto.org/)) running on your local network
- MySQL server (for worker registration)
- All hardware components listed above

---

### 1. MQTT Broker Setup (Mosquitto)

Install and configure Mosquitto to allow WebSocket connections on port 9001.

Add the following to your `mosquitto.conf`:

```
listener 1883
allow_anonymous true

listener 9001
protocol websockets
allow_anonymous true
```

Start the broker:

```bash
mosquitto -c /path/to/mosquitto.conf
```

Note the local IP address of the machine running the broker (e.g., `192.168.100.142`). You will need this in the next steps.

---

### 2. ESP32 Firmware

**Update credentials in `Node_mcu/src/main.cpp`:**

```cpp
const char *ssid     = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *mqttBroker = "YOUR_BROKER_IP";  // e.g. 192.168.100.142
const int   mqttPort = 1883;
```

**Install dependencies and flash:**

```bash
cd Node_mcu
pio run --target upload
```

PlatformIO will automatically install all required libraries defined in `platformio.ini`:

- `knolleary/PubSubClient@^2.8`
- `adafruit/Adafruit Unified Sensor@^1.1.13`
- `adafruit/Adafruit BMP280 Library@^2.6.8`
- `bblanchon/ArduinoJson@^6.21.3`
- `paulstoffregen/OneWire@^2.3.7`
- `milesburton/DallasTemperature@^3.11.0`
- `sparkfun/SparkFun MAX3010x Pulse and Proximity Sensor Library@^1.1.2`

**Monitor serial output:**

```bash
pio device monitor --baud 9600
```

---

### 3. Node.js Dashboard

**Update `.env` with your broker IP:**

```env
DASHBOARD_TITLE="IntelliHelmet"
MQTT_BROKER=ws://YOUR_BROKER_IP:9001/mqtt
MQTT_TOPIC=temp
```

**Install dependencies and start:**

```bash
cd mqtt-custom-dashboard-node-js-main
npm install
npm start
```

Dashboard will be available at: `http://localhost:9001`

---

### 4. Web Interface

The web interface is a static HTML/PHP site.

**For static pages only (no registration):**
Open `website(html part)/index.HTML` directly in a browser.

**For full functionality including worker registration:**
Serve the folder through a PHP-compatible server (e.g., XAMPP, WAMP, or PHP built-in server).

```bash
cd "website(html part)"
php -S localhost:8080
```

**Create the MySQL database:**

```sql
CREATE DATABASE intellihelmet;

USE intellihelmet;

CREATE TABLE workers_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workers_Fname VARCHAR(100),
    workers_Lname VARCHAR(100),
    gender VARCHAR(10),
    email VARCHAR(100),
    password VARCHAR(100),
    contact_number VARCHAR(20)
);
```

Update the database credentials in `connect.php` if needed.

**Default login credentials:**

```
Email:    admin@gmail.com
Password: admin123
```

---

## MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `temp` | ESP32 → Dashboard | JSON sensor payload published every 3 seconds |
| `pull` | Dashboard → ESP32 | `1` triggers emergency alert, `2` stops alert |

**Sensor payload format:**

```json
{
  "b_temperature": 36.5,
  "e_temperature": 28.3,
  "pressure": 1013.2,
  "altitude": 12.4,
  "bpm": 74,
  "airquality": 210,
  "spo2": 97
}
```

---

## Alert Behaviour

| Trigger | Buzzer Pattern |
|---------|---------------|
| Manual emergency (`pull` = `"1"`) | 600ms ON → 200ms OFF → 1200ms ON → 200ms OFF |
| Auto threshold breach | 300ms ON → 200ms OFF → 800ms ON → 200ms OFF |
| All values normal | Buzzer OFF |

---

## Technologies Used

| Layer | Technology |
|-------|------------|
| Firmware | C++, Arduino framework, PlatformIO |
| Protocols | MQTT, I2C, OneWire, ADC, UART, WebSocket |
| Backend | Node.js, Express.js, EJS |
| Frontend | HTML5, CSS3, JavaScript, Plotly.js |
| Database | MySQL, PHP |

---

## Known Limitations

- WiFi credentials and MQTT broker IP are hardcoded in the firmware — update before deploying on a different network
- BPM and SpO2 values are currently simulated with `random()` in firmware — replace with actual MAX30105 reading logic for production use
- Login authentication in `login.html` is client-side only — backend session management should be added for production
