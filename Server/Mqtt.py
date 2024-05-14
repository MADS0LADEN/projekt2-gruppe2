import paho.mqtt.client as mqtt  # Importer MQTT-klientbiblioteket
import mysql.connector # Importer MySQL-klientbiblioteket

class ModtageData:
    def __init__(self, dataSender):
        self.dataSender = SendeData()  # Initialiser dataattributten til None
        self.mqtt_broker = "192.168.15.24"  # Angiv IP-adressen for MQTT-brokeren (0.0.0.0 gør den i stand til at modtage beskeder på alle interfaces)
        self.mqtt_port = 1883  # Angiv portnummeret for MQTT

    def startServer(self):
        # Denne funktion udføres, når der modtages en besked fra brokeren
        def on_message(client, userdata, message):
            receivedData = message.payload.decode('utf-8')
            self.dataSender.senddata(receivedData)
            print(f"Modtaget besked på emne '{message.topic}': {str(message.payload.decode('utf-8'))}")

        # Opret en MQTT-klient og forbind til brokeren
        client = mqtt.Client()
        client.connect(self.mqtt_broker, self.mqtt_port)

        # Angiv funktionen til at håndtere modtagelse af beskeder
        client.on_message = on_message

        # Abonner på det ønskede emne
        client.subscribe("test")

        # Start loopet for at modtage beskeder
        print("Server startet")
        client.loop_forever()

class SendeData:
    def __init__(self, host="host.docker.internal", user="root", password="Dboa24!!", database="Projekt2"):
        self.mydb = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database  # Angiv navnet på databasen
        )
        self.mycursor = self.mydb.cursor()
    
    def senddata(self, data):
        sql = "INSERT INTO Registreringer  (PersonID, KlasseID)  VALUES (%s, %s)"
        val = (data, data)
        self.mycursor.execute(sql, val)
        self.mydb.commit()
        print(self.mycursor.rowcount, "record inserted.")
        
if __name__ == "__main__": 
    sender = SendeData()
    modtager = ModtageData(sender)
    modtager.startServer()