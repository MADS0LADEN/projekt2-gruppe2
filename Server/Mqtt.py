import paho.mqtt.client as mqtt

class modtageData:
    def __init__(self):
        self.data = None
        self.mqtt_broker = "0.0.0.0" #0.0.0.0 gør den kan modtage beskeder på alle interfaces
        self.mqtt_port = 1883

    def start_server(self):
        # Denne funktion udføres, når der modtages en besked fra brokeren
        def on_message(client, userdata, message):
            print(f"Modtaget besked på emne '{message.topic}': {str(message.payload.decode('utf-8'))}")

        # Opret en MQTT-klient og tilslut til brokeren
        client = mqtt.Client()
        client.connect(self.mqtt_broker, self.mqtt_port)

        # Angiv funktionen til at håndtere modtagelse af beskeder
        client.on_message = on_message

        # Abonner på det ønskede emne
        client.subscribe("test")

        # Start loopet for at modtage beskeder
        print("Server startet")
        client.loop_forever()

class sendeData:
    pass