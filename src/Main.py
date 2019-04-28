import cherrypy
import socket
import sys
import os
from DAL import DAL
import json
import pymysql
pymysql.install_as_MySQLdb()


class Root:

    def __init__(self, ini_file):
        self.dal = DAL(ini_file)

    @cherrypy.expose()
    def index(self):

        game_list = self.dal.get_games()
        return json.dumps(game_list)

    @cherrypy.expose()
    def get_games(self):
        game_list = self.dal.get_games()
        return json.dumps(game_list)

    @cherrypy.expose()
    def get_characters_from_game(self, game_id):
        char_list = self.dal.get_characters_from_game(game_id)
        return json.dumps(char_list)

    @cherrypy.expose()
    def get_movelist_for_char(self, char_id):
        move_list = self.dal.get_moves_for_character(char_id)
        return json.dumps(move_list)

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

    if len(sys.argv) < 2:
        print("No ini file specified!")
    else:
        ini_file = sys.argv[1]
        cherrypy.quickstart(Root(ini_file), config=conf)
