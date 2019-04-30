from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from Models.fighting_game_model import *
from SettingsIni import SettingsIni


class DAL:
    """
    Data Access Layer class
    """

    def __init__(self, ini_file):
        """
        Init method.
        """

        self.settings = SettingsIni(ini_file)

        # Build the DB string. All of the options here should be in an .ini file.
        db_str = "mysql://{user}:{password}@{db_str}/{db}".format(
            user=self.settings.username,
            password=self.settings.password,
            db_str=self.settings.db_str,
            db=self.settings.db
        )
        self.engine = create_engine(
            db_str, echo=False
        )
        self.session = sessionmaker(bind=self.engine, expire_on_commit=False)

    def create_scoped_session(self):
        """
        Create a SQLAlchemy scoped session
        :return: a scoped session
        """
        return scoped_session(self.session)
    
    def get_games(self):
        """
        Get the list of games in the system.
        :return: A list of games in the system.
        """

        return_list = []

        session = self.create_scoped_session()

        game_list = (
            session
            .query(Game)
        )

        for game in game_list.all():
            game_obj = {
                "name": game.name,
                "id": game.id
            }
            return_list.append(game_obj)

        return return_list

    def get_characters_from_game(self, game_id):
        """
        Get all characters from the given game.
        :param game_id: The game to look up.
        :return: A list of characters from the game given.
        """
        return_list = []

        session = self.create_scoped_session()

        char_list = (
            session
            .query(
                Gamecharacter,
            )
            .filter(Gamecharacter.gameId == game_id)
        )

        for character in char_list.all():
            char_obj = {
                "name": character.name,
                "id": character.id,
                "game": character.game.name,
            }
            return_list.append(char_obj)

        return return_list

    def get_moves_for_character(self, char_id):
        """
        Get all of the moves for the given character.
        :param char_id: The character to look up.
        :return: A list of moves for the character.
        """
        return_list = []

        session = self.create_scoped_session()

        move_list = (
            session
            .query(Charactermove)
            .filter(
                Charactermove.characterId == char_id
            )
        )
        for character_move in move_list.all():
            move_obj = {
                "name": character_move.move.name,
                "input": character_move.move.input,
                "ex": character_move.move.ex,
                "character_name": character_move.gamecharacter.name,
                "game_name": character_move.gamecharacter.game.name,
                "series": character_move.gamecharacter.game.series.name,
                "id": character_move.id
            }
            return_list.append(move_obj)

        return return_list

    def add_object_to_db(self, data_obj):
        """
        Helper method to add an object into the database.
        :param data_obj: The object to add. This method does not care what
        type of object this is, it will try to shove it into the database.
        I.E. make sure it is a valid table object!
        :return: True if successful, False if not.
        """
        session = self.create_scoped_session()

        try:
            session.add(data_obj)
            session.commit()
            return True
        except:
            session.rollback()
            return False

    def add_platform(self, platform_name):

        new_platform = Platform(platform_name)

        return self.add_object_to_db(new_platform)

    def add_series(self, series_name):
        new_series = Series(series_name)
        return self.add_object_to_db(new_series)

    def add_game(self, game_name, platform_id, series_id):
        new_game = Game(game_name, platform_id, series_id)

        return self.add_object_to_db(new_game)

    def add_character(self, character_name, game_id):
        new_character = Gamecharacter(character_name, game_id)
        return self.add_object_to_db(new_character)

    def add_move(self, move_name, input, ex):
        new_move = Move(move_name, input, ex)
        return self.add_object_to_db(new_move)

    def add_character_move_link(self, character_id, move_id):
        new_link = Charactermove(character_id, move_id)
        return self.add_object_to_db(new_link)

    def delete_platform(self, platform_id):
        pass
