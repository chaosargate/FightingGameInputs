import cherrypy
import socket
import os
from DAL import DAL
from utilities import *
import json


class Root:

    def __init__(self):
        self.dal = DAL("../bin/settings.ini")

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

    @cherrypy.expose()
    def gamecharacters(self, game_id):
        return_str = ""
        page_title = ""
        char_list = self.dal.get_characters_from_game(game_id)

        for character in char_list:
            char_link = "<a href='/character/{id}'>{name}</a></br>".format(
                id=character["id"],
                name=character["name"]
            )
            return_str += char_link

            if page_title == "":
                page_title = character["game"]

        return make_page(page_title, return_str)

    @cherrypy.expose()
    def character(self, character_id):
        page_title = ""
        out_table = """
        <table>
            <thead>
                <td>Name</td>
                <td>Input</td>
                <td>EX</td>
            </thead>
        """
        move_list = self.dal.get_moves_for_character(character_id)

        for move in move_list:
            row = """
            <tr class='moveRow'>
                <td>{name}</td>
                <td>{input}</td>
                <td>{ex}</td>
            </tr>""".format(
                name=move["name"],
                input=make_input_td(move["series"], move["input"]),
                ex="Yes" if move["ex"] else "No"
            )
            out_table += row

            if page_title == "":
                page_title = "{name} - {game}".format(
                    name=move["character_name"],
                    game=move["game_name"]
                )

        out_table += "</table><br /><small>*All moves assume player is on left side</small>"
        return make_page(page_title, out_table)

    @cherrypy.expose()
    def add_page(self):
        page_title = "Add Data"
        body = """<div id="reactForm" />"""
        return make_page(page_title, body, add_page=True)

    @cherrypy.expose()
    def get_plaform_list(self):
        platform_list = self.dal.get_platforms()
        return json.dumps(platform_list)

    @cherrypy.expose()
    def get_game_list(self):
        game_list = self.dal.get_games()
        return json.dumps(game_list)

    @cherrypy.expose()
    def get_movelist_for_char(self, char_id):
        move_list = self.dal.get_moves_for_character(char_id)
        return json.dumps(move_list)

    @cherrypy.expose()
    def get_movelist_from_game(self, game_id):
        move_list = self.dal.get_moves_from_game(game_id)
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

    cherrypy.quickstart(Root(), config=conf)
