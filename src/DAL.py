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
            .query(Gamecharacter)
            .filter(Gamecharacter.gameId == game_id)
        )

        for character in char_list.all():
            char_obj = {
                "name": character.name,
                "id": character.id
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
            .query(Gamecharacter,
                   Move,
                   Charactermove,
                   Game)
            .filter(
                Gamecharacter.id == Charactermove.characterId
            )
            .filter(
                Move.id == Charactermove.moveId
            )
            .filter(
                Gamecharacter.gameId == Game.id
            )
            .filter(
                Gamecharacter.id == char_id
            )
        )

        for move in move_list.all():
            move_obj = {
                "name": move.Move.name,
                "input": move.Move.input,
                "ex": move.Move.ex,
                "character_name": move.Gamecharacter.name,
                "game_name": move.Game.name,
                "id": move.Charactermove.id
            }
            return_list.append(move_obj)

        return return_list
