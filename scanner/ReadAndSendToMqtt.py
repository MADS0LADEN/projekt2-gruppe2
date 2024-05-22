from driver import MFRC522
from machine import Pin, SoftSPI, unique_id
from umqtt.simple import MQTTClient

# Wi-Fi oplysninger
WIFI_SSID = "Seans hotspot"
WIFI_PASSWORD = "syro4047"

# Angiv MQTT-brokerens adresse
mqtt_broker = "adjms.sof60.dk"  # Du skal muligvis ændre dette til den faktiske adresse på din broker
mqtt_port = 1883

# Angiv emnet, du vil sende kort-ID'en til
topic = "test"


def send_mqtt_message(message):
    try:
        # Opret forbindelse til MQTT-brokeren
        client = MQTTClient("esp32", mqtt_broker, port=mqtt_port)
        client.connect()

        # Send beskeden til MQTT-brokeren
        client.publish(topic, message)

        print("Besked sendt succesfuldt.")

    except Exception as e:
        print("Fejl ved beskedsendelse:", e)

    finally:
        # Luk forbindelsen til MQTT-brokeren
        if client:
            client.disconnect()


sck = Pin(36, Pin.OUT)
copi = Pin(35, Pin.OUT)  # Controller out, peripheral in
cipo = Pin(37, Pin.OUT)  # Controller in, peripheral out
spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=copi, miso=cipo)
sda = Pin(34, Pin.OUT)
reader = MFRC522(spi, sda)

print("Place Card In Front Of Device To Read Unique Address")
print("")

while True:
    try:
        (status, tag_type) = reader.request(reader.CARD_REQIDL)
        if status == reader.OK:
            (status, raw_uid) = reader.anticoll()
            if status == reader.OK:
                print("New Card Detected")
                print("  - Tag Type: 0x%02x" % tag_type)
                print("  - uid:", ":".join("%02x" % byte for byte in raw_uid))
                print("")
                if reader.select_tag(raw_uid) == reader.OK:
                    key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                    if reader.auth(reader.AUTH, 8, key, raw_uid) == reader.OK:
                        card_id = ":".join("%02x" % byte for byte in raw_uid)
                        device_id = unique_id()
                        message = f"Card ID: {card_id}, Device ID: {device_id})"
                        print(message)
                        reader.stop_crypto1()

                        # Send kort-ID'en via MQTT
                        send_mqtt_message(message)
                    else:
                        print("AUTH ERROR")
                else:
                    print("FAILED TO SELECT TAG")
    except KeyboardInterrupt:
        break
