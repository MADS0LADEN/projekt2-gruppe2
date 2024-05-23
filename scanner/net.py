import network
import time

def connect_to_wifi():
    with open("/wifi.txt", "r") as file:
        lines = file.readlines()

    ssid = lines[0].strip()
    password = lines[1].strip()

    # Opret en WLAN-station interface
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    if not wlan.isconnected():
        print('Connecting to network...')
        wlan.connect(ssid, password)
        
        # Vent indtil vi er forbundet eller timeout
        timeout = 10  # seconds
        while not wlan.isconnected() and timeout > 0:
            time.sleep(1)
            timeout -= 1
    
    if wlan.isconnected():
        print('Connected to network:', ssid)
        print('Network config:', wlan.ifconfig())
    else:
        print('Failed to connect to network:', ssid)

def connected_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    return wlan.isconnected()