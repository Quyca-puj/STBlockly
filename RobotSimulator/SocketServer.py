import random
import socket
from threading import Thread
import time
HOST = "192.168.1.12"  # Standard loopback interface address (localhost)
class SocketServer:

    def __init__(self, port) -> None:
        self.port= port

    def start(self):
        self.server = Thread(target=self.start_st_server)
        self.server.start()
        

    def start_st_server(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((HOST, self.port))
            print(self.port,"Ready")
            s.listen()
            conn, addr = s.accept()
            with conn:
                print(self.port,f"Connected by {addr}")
                while True:
                    data = conn.recv(125).decode()
                    print(self.port,"data ", data)
                    params = data.split(" ")
                    print(self.port,"params ", params)
                    t = random.randint(1,5)
                    print(self.port,"sleeping ", t)
                    time.sleep(t)
                    if params:
                        print(self.port,"Received ", data)
                        ack = params[-1] +"\n"
                        print(self.port,"ACK ", ack)
                        print(self.port,"check ", ("emotions" not in data))
                    if "emotions" not in data:
                        conn.send(ack.encode())