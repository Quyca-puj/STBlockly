import socket

from ardublocklyserver.STConstants import STport  

class RobotSocketManager:
    def get_connection(self, ip):
        connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        connection.connect((ip, STport))  
        return connection

    def send_msg(self, conex_details, msg, ack= None):
        response = True
        print("get_connection1")
        s= self.get_connection(conex_details)
        print("MIRAR2", msg)
        s.send(msg.encode('UTF-8'))
        if ack is not None:
            ret = s.recv(1024)      
            print(ret, ack, int(ret) == int(ack))
            response = int(ret) == int(ack)
        s.close()
        return response

