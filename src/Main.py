import cherrypy
import socket
import os
from DAL import DAL


class Root:

    def __init__(self):
        self.dal = DAL()
        pass

    @cherrypy.expose()
    def index(self):
        return self.dal.test()


if __name__ == "__main__":

    cherrypy.config.update({
        'server.socket_port': 8081,
        'server.socket_host': socket.gethostbyname(socket.gethostname()),
        'response.timeout': 1600000
    })

    conf = {
        "/bin": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": os.path.abspath("../bin"),
        },
    }

    cherrypy.quickstart(Root(), config=conf)
