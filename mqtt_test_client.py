import paho.mqtt.publish as publish

# Angiv MQTT-brokerens adresse
mqtt_broker = "adjms.sof60.dk" #Broker adresse
mqtt_port = 1883

# Angiv emnet og beskeden, du vil sende
topic = "test"
message = "77:8c:24:63:bc,dc5475cb025c"

# Send beskeden til MQTT-brokeren
publish.single(topic, message, hostname=mqtt_broker, port=mqtt_port)
