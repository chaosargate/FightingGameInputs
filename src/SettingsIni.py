import configparser


class SettingsIni:

    def __init__(self, ini_file):
        settings = configparser.ConfigParser()

        with open(ini_file, "r") as ini:
            settings.read_file(ini)
            self.username = settings["DEFAULT"]["username"]
            self.password = settings["DEFAULT"]["password"]
            self.db_str = settings["DEFAULT"]["db_str"]
            self.db = settings["DEFAULT"]["db"]
