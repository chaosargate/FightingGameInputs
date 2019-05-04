import cherrypy
from WebUtilities import make_response
from utilities import *


class API:

    def __init__(self, dal):
        self.dal = dal
        pass

    @cherrypy.expose()
    def get_platform_list(self):
        platform_list = self.dal.get_platforms()
        return make_response(True, platform_list)

    @cherrypy.expose()
    def get_series_list(self):
        series_list = self.dal.get_series()
        return make_response(True, series_list)

    @cherrypy.expose()
    def get_game_list(self):
        game_list = self.dal.get_games()
        return make_response(True, data=game_list)

    @cherrypy.expose()
    def get_movelist_for_char(self, char_id):
        move_list = self.dal.get_moves_for_character(char_id)
        return make_response(True, data=move_list)

    @cherrypy.expose()
    def get_movelist_from_game(self, game_id):
        move_list = self.dal.get_moves_from_game(game_id)
        return make_response(True, data=move_list)

    @cherrypy.expose()
    def get_characters_from_game(self, game_id):
        character_list = self.dal.get_characters_from_game(game_id)
        return make_response(True, data=character_list)

    @cherrypy.expose()
    def submit_platform(self, platform_name):
        add_platform = self.dal.add_platform(platform_name)
        return make_response(add_platform)

    @cherrypy.expose()
    def submit_series(self, series_name):
        add_series = self.dal.add_series(series_name)
        return make_response(add_series)

    @cherrypy.expose()
    def submit_game(self, platform_id, series_id, game_name):
        add_game = self.dal.add_game(
            game_name=game_name,
            platform_id=platform_id,
            series_id=series_id
        )
        return make_response(add_game)

    @cherrypy.expose()
    def submit_character(self, character_name, game_id):
        add_character = self.dal.add_character(
            character_name=character_name,
            game_id=game_id
        )
        return make_response(add_character)

    @cherrypy.expose()
    def submit_move(self, move_name, input, ex, game_id):
        add_move = self.dal.add_move(
            move_name=move_name,
            input=input,
            ex=ex == "true",
            game_id=game_id
        )
        return make_response(add_move)

    @cherrypy.expose()
    def submit_character_move(self, character_id, move_id):
        add_character_move = self.dal.add_character_move_link(
            character_id=character_id,
            move_id=move_id
        )
        return make_response(add_character_move)

    @cherrypy.expose()
    def register_user(self, username, password):
        hashed_pass = hash_password(password)
        new_user = self.dal.register_user(username, hashed_pass)
        return make_response(new_user)

    @cherrypy.expose()
    def login_user(self, username, password):
        hashed_pass = hash_password(password)
        login = self.dal.login_user(username, hashed_pass)
        user_id = login.get("id")

        if user_id:
            session_id = login.get("session_id")
            signing_key = self.dal.get_signing_key()

            encoded_jwt = make_jwt(user_id, session_id, signing_key)

            return make_response(True, data=encoded_jwt)

        return make_response(False, data={"message": "User credentials not valid"})

    @cherrypy.expose()
    def check_if_valid_user(self, encoded_jwt):

        signing_key = self.dal.get_signing_key()
        decoded_jwt = decode_jwt(encoded_jwt, signing_key)
        user_id = decoded_jwt.get("user_id")
        session_id = decoded_jwt.get("session_id")
        return make_response(True, data=self.dal.check_if_session_is_valid(user_id, session_id))
