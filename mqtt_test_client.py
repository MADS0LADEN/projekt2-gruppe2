import paho.mqtt.publish as publish

# Angiv MQTT-brokerens adresse
mqtt_broker = "adjms.sof60.dk"  # Du skal muligvis ændre dette til den faktiske adresse på din broker
mqtt_port = 1883

# Angiv emnet og beskeden, du vil sende
topic = "test"
message = "Hello, MQTT!"

# Send beskeden til MQTT-brokeren
publish.single(topic, message, hostname=mqtt_broker, port=mqtt_port)
