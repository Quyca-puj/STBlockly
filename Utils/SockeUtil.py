import socket
STport = 6000
STip = "192.168.213.84"


class RobotSocketManager:

    def __init__(self):
        self.socket = self.get_connection()

    def get_connection(self):
        connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        connection.connect((STip, STport))  
        connection.settimeout(60)
        return connection

    def send_msg(self, msg):
        s= self.socket
        s.send(msg.encode('UTF-8'))
