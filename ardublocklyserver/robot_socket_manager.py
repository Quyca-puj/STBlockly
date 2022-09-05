import socket

from ardublocklyserver.STConstants import STport  

class RobotSocketManager:

    """Class wrapper for a socket dictionary. It manages connection lifecycle"""
    def __init__(self):
        self.openSockets = dict()

    def get_connection(self, ip):
        """Creates connection or retrieves it, if it already exists."""
        if ip in self.openSockets:
            connection = self.openSockets[ip]
        else:
            connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
            connection.connect((ip, STport))  
            connection.settimeout(60)
        return connection

    def send_msg(self, conex_details, msg, ack= None):
        """Sends message action to robot."""
        response = True
        s= self.get_connection(conex_details)
        s.send(msg.encode('UTF-8'))
        if ack is not None or ack == "-1":
            ret = s.recv(1024)      
            print(ret, ack, int(ret) == int(ack))
            response = int(ret) == int(ack)
        return response

    def __del__(self):
        for k,v in self.openSockets:
            v.close()
            del self.openSockets[k]
