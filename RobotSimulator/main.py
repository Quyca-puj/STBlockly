import SocketServer

def main():
    server = SocketServer.SocketServer(6000)
    server.start()
    server1 = SocketServer.SocketServer(6001)
    server1.start()
    pass


if __name__ == "__main__":
    main()