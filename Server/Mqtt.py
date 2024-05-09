import paho.mqtt.client as mqtt  # Importer MQTT-klientbiblioteket
import mysql.connector # Importer MySQL-klientbiblioteket

class ModtageData:
    def __init__(self):
        self.data = None  # Initialiser dataattributten til None
        self.mqtt_broker = "0.0.0.0"  # Angiv IP-adressen for MQTT-brokeren (0.0.0.0 gør den i stand til at modtage beskeder på alle interfaces)
        self.mqtt_port = 1883  # Angiv portnummeret for MQTT

    def startServer(self):
        # Denne funktion udføres, når der modtages en besked fra brokeren
        def on_message(client, userdata, message):
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
    def __init__(self, host, user, password, database):
        self.mydb = mysql.connector.connect(
            host=host, # Angiv IP-adressen for MySQL-serveren
            user= "root",
            password= "Dboa24!",
            database=database # Angiv navnet på databasen
        )
    
    def send_data(self, data):
        mycursor = self.mydb.cursor() # Opret en cursor til at udføre SQL-forespørgsler

        sql = "INSERT INTO tablename (columname) VALUES (%s)"  # SQL-forespørgsel til at indsætte data i databasen
        val = (data, )  # Data, der skal indsættes i databasen
        mycursor.execute(sql, val)  # Udfør SQL-forespørgslen med de angivne værdier

        self.mydb.commit()  # Bekræft ændringer i databasen

        print(mycursor.rowcount, "record inserted.")  # Udskriv antallet af rækker indsat i databasen
        
