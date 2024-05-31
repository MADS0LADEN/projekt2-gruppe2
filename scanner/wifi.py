import time

import network


class WiFiManager:
    def __init__(self, wifi_credentials_file="/wifi.txt"):
        self._wifi_credentials_file = wifi_credentials_file
        self.wlan = network.WLAN(network.STA_IF)
        self.wlan.active(True)

    @property
    def wifi_credentials_file(self):
        return self._wifi_credentials_file

    @wifi_credentials_file.setter
    def wifi_credentials_file(self, value):
        self._wifi_credentials_file = value

    def _read_wifi_credentials(self):
        with open(self._wifi_credentials_file, "r") as file:
            lines = file.readlines()

        ssid = lines[0].strip()
        password = lines[1].strip()

        return ssid, password

    def connect(self):
        ssid, password = self._read_wifi_credentials()

        if not self.wlan.isconnected():
            print("Connecting to network...")
            self.wlan.connect(ssid, password)

            # Wait until we are connected or timeout
            timeout = 10  # seconds
            while not self.wlan.isconnected() and timeout > 0:
                time.sleep(1)
                timeout -= 1

        if self.wlan.isconnected():
            print("Connected to network:", ssid)
            print("Network config:", self.wlan.ifconfig())
        else:
            print("Failed to connect to network:", ssid)

    def is_connected(self):
        return self.wlan.isconnected()

    def disconnect(self):
        self.wlan.disconnect()
        return not self.wlan.isconnected()

    def scan(self):
        networks = self.wlan.scan()
        network_info = []
        for network in networks:
            ssid = network[0]
            bssid = network[1]
            channel = network[2]
            rssi = network[3]
            auth_mode = network[4]
            hidden = network[5]

            network_info.append(
                {
                    "SSID": ssid,
                    "BSSID": bssid,
                    "Channel": channel,
                    "RSSI": rssi,
                    "Auth Mode": auth_mode,
                    "Hidden": hidden,
                }
            )

        return network_info

    def get_connection_status(self):
        status = self.wlan.status()
        return {
            "is_connected": status["is_connected"],
            "ip_address": status["ip_address"],
            "ssid": status["ssid"],
            "signal_strength": status["signal_strength"],
        }


