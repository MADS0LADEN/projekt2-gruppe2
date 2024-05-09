import paho.mqtt.client as mqtt

# Angiv MQTT-brokerens adresse
mqtt_broker = "192.168.15.24"  # Du skal muligvis ændre dette til den faktiske adresse på din broker
mqtt_port = 1883

# Denne funktion udføres, når der modtages en besked fra brokeren
def on_message(client, userdata, message):
    print(f"Modtaget besked på emne '{message.topic}': {str(message.payload.decode('utf-8'))}")

# Opret en MQTT-klient og tilslut til brokeren
print("Hej")
client = mqtt.Client()
client.connect(mqtt_broker, mqtt_port)

# Angiv funktionen til at håndtere modtagelse af beskeder
client.on_message = on_message

# Abonner på det ønskede emne
client.subscribe("test")

# Start loopet for at modtage beskeder
print("Server startet")
client.loop_forever()
