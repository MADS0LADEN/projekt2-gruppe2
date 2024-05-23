from driver import MFRC522
from machine import Pin, SoftSPI, unique_id
from umqtt.simple import MQTTClient
import ubinascii, os
import net

# Angiv MQTT-brokerens adresse
mqtt_broker = "adjms.sof60.dk"  # Du skal muligvis ændre dette til den faktiske adresse på din broker
mqtt_port = 1883

# Angiv emnet, du vil sende kort-ID'en til
topic = "test"

def read_backup():
    file_path = "/data.txt"
    try:
        # Læs alle linjer fra filen
        with open(file_path, "r") as file:
            lines = file.readlines()
        
        if not lines:
            return
        
        # Den første linje i filen
        first_line = lines[0].strip()
        
        # Forsøg at sende beskeden
        send_mqtt_message(first_line)
        
        # Skriv de resterende linjer tilbage til filen
        with open(file_path, "w") as file:
            for line in lines[1:]:
                file.write(line)
        
    except Exception as e:
        # Håndter fejl
        print(f"An error occurred: {e}")

def send_mqtt_message(message):
    try:
        # Opret forbindelse til MQTT-brokeren
        client = MQTTClient("esp32", mqtt_broker, port=mqtt_port)
        client.connect()

        # Send beskeden til MQTT-brokeren
        client.publish(topic, message)
        print("Besked sendt succesfuldt.")
        if client:
            client.disconnect()
        
    except Exception as e:
        print("Fejl ved beskedsendelse:", e)
        print("Forsøger at skrive besked til data.txt")
        try:
            with open("/data.txt", "a") as file:  # Åbn filen i append-tilstand
                file.write(message + "\n")
            print("Besked gemt lokalt:", message)
        except Exception as file_error:
            print("Fejl ved skrivning til fil:", file_error)

sck = Pin(36, Pin.OUT)
copi = Pin(35, Pin.OUT)  # Controller out, peripheral in
cipo = Pin(37, Pin.OUT)  # Controller in, peripheral out
spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=copi, miso=cipo)
sda = Pin(34, Pin.OUT)
reader = MFRC522(spi, sda)
    
print("Place Card In Front Of Device To Read Unique Address")
print("")

last_uid = None
while True:
    try:
        (status, tag_type) = reader.request(reader.CARD_REQIDL)
        if net.connected_to_wifi():
            read_backup()
        if status == reader.OK:
            (status, raw_uid) = reader.anticoll()
            if raw_uid == last_uid:
                continue
            if status == reader.OK:
                print("New Card Detected")
                print("  - Tag Type: 0x%02x" % tag_type)
                print(
                    "  - uid: 0x%02x%02x%02x%02x"
                    % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
                )
                print("")
                if reader.select_tag(raw_uid) == reader.OK:
                    key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                    if reader.auth(reader.AUTH, 8, key, raw_uid) == reader.OK:
                        card_id = ":".join("%02x" % byte for byte in raw_uid)
                        device_id = ubinascii.hexlify(unique_id()).decode('utf-8')
                        message = f"{card_id},{device_id}"
                        print(message)
                        reader.stop_crypto1()
                        # Send kort-ID'en via MQTT
                        send_mqtt_message(message)
                    else:
                        print("AUTH ERROR")
                else:
                    print("FAILED TO SELECT TAG")
                last_uid = raw_uid
    except KeyboardInterrupt:
        break