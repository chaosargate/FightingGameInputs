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
        db_str = "{driver}://{user}:{password}@{db_str}/{db}".format(
            driver=self.settings.driver,
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

    def get_platforms(self):
        return_list = []

        session = self.create_scoped_session()

        platform_list = (
            session
            .query(Platform)
            .order_by(Platform.name)
        )

        for platform in platform_list:
            platform_obj = {
                "name": platform.name,
                "id": platform.id
            }

            return_list.append(platform_obj)

        return return_list

    def get_series(self):
        return_list = []

        session = self.create_scoped_session()

        series_list = (
            session
            .query(Series)
            .order_by(Series.name)
        )

        for series in series_list:
            series_obj = {
                "name": series.name,
                "id": series.id
            }

            return_list.append(series_obj)

        return return_list

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
            .order_by(Game.name)
        )

        for game in game_list.all():
            game_obj = {
                "name": game.name,
                "id": game.id,
                "series": game.Series.name
            }
            return_list.append(game_obj)

        return return_list

    def get_game(self, game_id):
        session = self.create_scoped_session()
        game = (
            session
            .query(Game)
            .filter(Game.id == game_id)
        )

        return game.one()

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
                Character,
            )
            .filter(Character.gameId == game_id)
            .order_by(Character.name)
        )

        for character in char_list.all():
            char_obj = {
                "name": character.name,
                "id": character.id,
                "game": character.Game.name,
            }
            return_list.append(char_obj)

        return return_list

    def get_moves_from_game(self, game_id):
        return_list = []

        session = self.create_scoped_session()
        move_list = (
            session
            .query(Move)
            .filter(Move.gameId == game_id)
            .order_by(Move.name)
        )

        for move in move_list:
            moveObj = {
                "name": move.name,
                "id": move.id,
                "game": move.Game.name,
            }
            return_list.append(moveObj)

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
            .query(CharacterMove)
            .filter(
                CharacterMove.characterId == char_id
            )
        )
        for character_move in move_list.all():
            move_obj = {
                "name": character_move.Move.name,
                "input": character_move.Move.input,
                "ex": character_move.Move.ex,
                "character_name": character_move.Character.name,
                "game_name": character_move.Character.Game.name,
                "series": character_move.Character.Game.Series.name,
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
            return {"success": True}
        except:
            session.rollback()
            return {"success": False}

    def add_platform(self, platform_name):
        new_platform = Platform(name=platform_name)
        return self.add_object_to_db(new_platform)

    def add_series(self, series_name):
        new_series = Series(name=series_name)
        return self.add_object_to_db(new_series)

    def add_game(self, game_name, platform_id, series_id):
        new_game = Game(name=game_name, platformId=platform_id, seriesId=series_id)
        return self.add_object_to_db(new_game)

    def add_character(self, character_name, game_id):
        new_character = Character(name=character_name, gameId=game_id)
        return self.add_object_to_db(new_character)

    def add_move(self, move_name, input, ex, game_id):
        new_move = Move(name=move_name, input=input, ex=ex, gameId=game_id)
        return self.add_object_to_db(new_move)

    def add_character_move_link(self, character_id, move_id):
        new_link = CharacterMove(characterId=character_id, moveId=move_id)
        return self.add_object_to_db(new_link)

    def delete_platform(self, platform_id):
        pass
