import time
from time import sleep

from driver import MFRC522
from machine import Pin, SoftSPI

sck = Pin(36, Pin.OUT)
copi = Pin(35, Pin.OUT)  # Controller out, peripheral in
cipo = Pin(37, Pin.OUT)  # Controller in, peripheral out
spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=copi, miso=cipo)
sda = Pin(34, Pin.OUT)
reader = MFRC522(spi, sda)

green = Pin(6, Pin.OUT)
yellow = Pin(7, Pin.OUT)
red = Pin(8, Pin.OUT)


def blink(color):
    color.on()
    sleep(1)
    color.off()


print("Reader")
print("")

default_keys = [
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xD3, 0xF7, 0xD3, 0xF7, 0xD3, 0xF7],
    [0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5],
    [0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5],
    [0x4D, 0x3A, 0x99, 0xC3, 0x51, 0xDD],
    [0x1A, 0x98, 0x2C, 0x7E, 0x45, 0x9A],
    [0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF],
    [0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
]

last_uid = None
last_read_time = 0
while True:
    try:
        (status, tag_type) = reader.request(reader.CARD_REQIDL)
        if status == reader.OK:
            (status, raw_uid) = reader.anticoll()
            if status == reader.OK:
                current_time = time.time()
                if raw_uid == last_uid and (current_time - last_read_time) < 10:
                    continue
                print("New Card Detected")
                print("  - Tag Type: 0x%02x" % tag_type)
                print(
                    "  - uid: 0x%02x%02x%02x%02x"
                    % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
                )
                print("")
                state = reader.select_tag(raw_uid)
                if state == reader.OK:
                    key = default_keys[0]
                    break_loop = False
                    for sector in range(16):
                        if break_loop:
                            break
                        for block in range(0, 3):
                            block_addr = sector * 4 + block
                            if block_addr % 4 == 3 or block_addr == 0:
                                continue
                            tjek = reader.auth(reader.AUTH, block_addr, key, raw_uid)
                            if tjek == reader.OK:
                                print(
                                    f"S{sector}B{block_addr}: {reader.read(block_addr)}"
                                )
                                last_uid = raw_uid
                                last_read_time = current_time
                            else:
                                print(f"FAILED TO AUTH S{sector}B{block_addr}")
                                break_loop = True
                                break
                    reader.stop_crypto1()
                else:
                    print("FAILED TO SELECT TAG")
                    reader.stop_crypto1()
    except KeyboardInterrupt:
        break
