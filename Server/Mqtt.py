import paho.mqtt.client as mqtt 
#import pymysql.cursors
import sys, datetime, json

def insert_into_sql(enheds_id,data):
    pass

def on_connect(client,rc):
    client.subscribe("Test")
    if rc == 0:
        pass
    else:
        print(f"Connected with result code {rc}")
    pass

def on_message(client,msg):
    try:
        print(f"Modtaget besked på emne {msg.topic}: {msg.payload.decode()}")

        enheds_id = msg.topic #Enheds id aka hvor kommer dataen fra
        data = json.loads(msg.payload) #Elevnummer
        print(f"Modtaget JSON-data: {data}")

        insert_into_sql(enheds_id,data)
        print("Data indsat i MySQL-database.")      
    except Exception as e:
        print(f"Fejl ved behandling af besked: {e}")

# MQTT-brokerkonfiguration
mqtt_broker = "192.168.0.123"
mqtt_port = 1883

# Opret MQTT-klient
client = mqtt.Client("server_subscriber")
client.on_connect = on_connect
client.on_message = on_message

# Opret forbindelse til MQTT-brokeren
client.connect(mqtt_broker, mqtt_port)
client.loop_forever()