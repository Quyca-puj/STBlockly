import socket
from threading import Thread
HOST = "192.168.213.33"  # Standard loopback interface address (localhost)
PORT = 7897  # Port to listen on (non-privileged ports are > 1023)
class SocketServer:

    def start(self):
        self.server = Thread(target=self.start_st_server)
        self.server.start()
        

    def start_st_server(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((HOST, PORT))
            s.listen()
            conn, addr = s.accept()
            with conn:
                print(f"Connected by {addr}")
                while True:
                    data = conn.recv(4096)
                    if data:
                        print("Received ", data)