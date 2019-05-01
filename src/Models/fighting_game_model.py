# coding: utf-8
from sqlalchemy import Column, ForeignKey, String, text
from sqlalchemy.dialects.mysql import INTEGER, TINYINT
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Platform(Base):
    __tablename__ = 'platform'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(150), nullable=False)


class Series(Base):
    __tablename__ = 'series'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(45), nullable=False)


class Game(Base):
    __tablename__ = 'game'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(150), nullable=False)
    platformId = Column(ForeignKey(u'platform.id'), index=True)
    seriesId = Column(ForeignKey(u'series.id'), index=True)

    platform = relationship(u'Platform')
    series = relationship(u'Series')


class Gamecharacter(Base):
    __tablename__ = 'gamecharacter'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(150), nullable=False)
    gameId = Column(ForeignKey(u'game.id'), index=True)

    game = relationship(u'Game')


class Move(Base):
    __tablename__ = 'move'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(150), nullable=False)
    input = Column(String(150), nullable=False)
    ex = Column(TINYINT(4), nullable=False, server_default=text("'0'"))
    gameId = Column(ForeignKey(u'game.id'), nullable=False, index=True)

    game = relationship(u'Game')


class Charactermove(Base):
    __tablename__ = 'charactermoves'

    id = Column(INTEGER(11), primary_key=True)
    characterId = Column(ForeignKey(u'gamecharacter.id'), index=True)
    moveId = Column(ForeignKey(u'move.id'), index=True)

    gamecharacter = relationship(u'Gamecharacter')
    move = relationship(u'Move')
