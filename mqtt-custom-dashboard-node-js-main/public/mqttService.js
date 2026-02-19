export class MQTTService {
  constructor(host, messageCallbacks) {
    this.mqttClient = null;
    this.host = "ws://192.168.100.142:9001/mqtt";
    this.messageCallbacks = messageCallbacks;
  }

  connect() {
    this.mqttClient = mqtt.connect(this.host);

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
      if (this.messageCallbacks && this.messageCallbacks.onError)
        this.messageCallbacks.onError(err);
    });

    // MQTT Callback for 'connect' event
    this.mqttClient.on("connect", () => {
      console.log(`MQTT client connected`);
      if (this.messageCallbacks && this.messageCallbacks.onConnect) {
        this.messageCallbacks.onConnect("Connected");
      }
    });

    // Call the message callback function when message arrived
    this.mqttClient.on("message", (topic, message) => {
      if (this.messageCallbacks && this.messageCallbacks.onMessage) {
        this.messageCallbacks.onMessage(topic, message);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
      if (this.messageCallbacks && this.messageCallbacks.onClose)
        this.messageCallbacks.onClose();
    });
  }

  // Publish MQTT Message
  publish(topic, message, options) {
    if (this.mqttClient.connected) {
      this.mqttClient.publish(topic, message, options);
    } else {
      console.log('Unable to send message. MQTT client is not connected.');
    }
  }

  // Subscribe to MQTT Message
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

// Create an instance of the MQTTService class
const mqttService = new MQTTService("ws://192.168.100.142:9001/mqtt", {});

// Connect the MQTT client
mqttService.connect();

// Add an event listener to a button to publish a message when clicked
document.getElementById('mqttButton').addEventListener('click', () => {
  let doc = 1;
  
  let buffer = JSON.stringify(doc);
  mqttService.publish('pull', buffer, {qos: 1});
});

// Add an event listener to a button to publish a message when clicked part 2
document.getElementById('offButton').addEventListener('click', () => {
  let doc = 2;
  
  let buffer = JSON.stringify(doc);
  mqttService.publish('pull', buffer, {qos: 1});
});
 