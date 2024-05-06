from time import sleep

from machine import Pin, SoftSPI

from driver import MFRC522

sck = Pin(1, Pin.OUT)
copi = Pin(2, Pin.OUT)  # Controller out, peripheral in
cipo = Pin(3, Pin.OUT)  # Controller in, peripheral out
spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=copi, miso=cipo)
sda = Pin(4, Pin.OUT)
reader = MFRC522(spi, sda)

print("Place Card In Front Of Device To Write Unique Address")
print("")

last_uid = None
while True:
    try:
        (status, tag_type) = reader.request(reader.CARD_REQIDL)
        if status == reader.OK:
            (status, raw_uid) = reader.anticoll()
            if status == reader.OK:
                print("New Card Detected")
                print("  - Tag Type: 0x%02x" % tag_type)
                print(
                    "  - UID: 0x%02x%02x%02x%02x"
                    % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
                )
                print("")
                if reader.select_tag(raw_uid) == reader.OK:
                    key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                    if reader.auth(reader.AUTH, 8, key, raw_uid) == reader.OK:
                        # Write your unique address here
                        if last_uid is raw_uid:
                            print("Data Already Written To Card...")
                            reader.stop_crypto1()
                            sleep(1)
                            continue
                        status = reader.write(
                            8,
                            b"\x08\x06\x07\x05\x03\x00\x09\x00\x00\x00\x00\x00\x00\x00\x06\x03",
                        )
                        reader.stop_crypto1()
                        if status == reader.OK:
                            print("Data Written To Card...")
                            last_uid = raw_uid
                        else:
                            print("FAILED TO WRITE DATA")
                    else:
                        print("AUTH ERROR")
                else:
                    print("FAILED TO SELECT TAG")
    except KeyboardInterrupt:
        break
