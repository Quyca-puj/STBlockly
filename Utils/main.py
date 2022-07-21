import SocketServer
import SockeUtil

def main():
    server = SocketServer.SocketServer()
    server.start()
    pass


if __name__ == "__main__":
    main()
    value = ""
    sender = SockeUtil.RobotSocketManager()
    while value != "exit":
        value = input("Ingrese comando:\n")
        print(f'You entered {value}')
        sender.send_msg(value)