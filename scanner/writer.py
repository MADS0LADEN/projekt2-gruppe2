import time

from driver import MFRC522
from machine import Pin, SoftSPI

sck = Pin(36, Pin.OUT)
copi = Pin(35, Pin.OUT)  # Controller out, peripheral in
cipo = Pin(37, Pin.OUT)  # Controller in, peripheral out
spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=copi, miso=cipo)
sda = Pin(34, Pin.OUT)
reader = MFRC522(spi, sda)

print("Writer")
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


def pad_bytes(data, length, pad_byte=b"\x00"):
    """Pad data with pad_byte up to length."""
    return data + pad_byte * (length - len(data))


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield pad_bytes(lst[i : i + n], n)


data = b"Hello, World! i have a nice day today, pleaseauiwtdbaiuwdautdwuiyatbwdui taywdt aiuwdtb ayuwdtb yuaitdw uibyawtdb aibw d use me i like cake?#)/#!=()#!131846++-/*kkkkk"
data += b"\x00" * (16 - len(data))
data_chunks = list(chunks(data, 16))

# print(data_chunks, sep="\n")


last_uid = None
last_write_time = 0
while True:
    try:
        (status, tag_type) = reader.request(reader.CARD_REQIDL)
        if status == reader.OK:
            (status, raw_uid) = reader.anticoll()
            if status == reader.OK:
                current_time = time.time()
                if raw_uid == last_uid and (current_time - last_write_time) < 10:
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
                    block_addr = 1
                    key = default_keys[0]
                    for block in data_chunks:
                        if block_addr % 4 == 3:
                            block_addr += 1
                        tjek = reader.auth(reader.AUTH, block_addr, key, raw_uid)
                        if tjek == reader.OK:
                            print(f"B{block_addr}: {block}")
                            if reader.write(block_addr, block) == reader.OK:
                                last_uid = raw_uid
                                last_write_time = current_time
                            else:
                                print(f"Failed to write data to block {block_addr}")
                        block_addr += 1
                    reader.stop_crypto1()
                else:
                    print("Failed to select tag")
    except KeyboardInterrupt:
        print("Bye")
        break
