import datetime

import paho.mqtt.client as mqtt


# Define callback functions for MQTT events
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker")
    client.subscribe("test")  # Subscribe to the "test" topic


def on_message(client, userdata, msg):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{timestamp}: {msg.payload.decode()}")


def on_disconnect(client, userdata, rc):
    print("Disconnected from MQTT broker")


# Create an MQTT client instance
client = mqtt.Client()

# Set the callback functions
client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

# Connect to the MQTT broker
client.connect("adjms.sof60.dk", 1883, 5)

# Start the MQTT client loop
client.loop_forever()
