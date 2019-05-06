import cherrypy
import socket
import os
from DAL import DAL
from API import API
from utilities import *


class Root:

    def __init__(self):
        self.dal = DAL("../bin/settings.ini")

    api = API(DAL("../bin/settings.ini"))

    # Route("/")
    @cherrypy.expose()
    def index(self):
        game_list_links = ""
        game_list = self.dal.get_games()

        for game in game_list:
            game_list_links += "<a href='/gamecharacters/{id}'>{name}</a><br/>".format(
                id=game["id"],
                name=game["name"]
            )

        game_list_links += "<a href='/add_page'>Add Data</a>"

        return make_page("Select a game!", game_list_links)

    # Route("/gamecharacters/{game_id}
    @cherrypy.expose()
    def gamecharacters(self, game_id):
        game = self.dal.get_game(game_id)
        page_title = game.name

        return_str = """
        <body class='{game_class}'>
            <div id='root' class='root'></div>
            <script>
                var gameId = {game_id}
            </script>
        </body>
        """.format(
            game_class=game.name.replace(" ", ""),
            game_id=game_id
        )

        return make_page(page_title, return_str, react_page=True)

    # Route("/add_page/")
    @cherrypy.expose()
    def add_page(self):
        page_title = "Add Data"
        body = """<div id="reactForm" />"""
        return make_page(page_title, body, react_page=True)


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
