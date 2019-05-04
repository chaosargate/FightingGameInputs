# coding: utf-8
from sqlalchemy import Boolean, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Platform(Base):
    __tablename__ = 'Platform'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)


class Series(Base):
    __tablename__ = 'Series'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)


class Game(Base):
    __tablename__ = 'Game'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    platformId = Column(ForeignKey(u'Platform.id', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)
    seriesId = Column(ForeignKey(u'Series.id', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)

    Platform = relationship(u'Platform')
    Series = relationship(u'Series')


class Character(Base):
    __tablename__ = 'Character'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    gameId = Column(ForeignKey(u'Game.id', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)

    Game = relationship(u'Game')


class Move(Base):
    __tablename__ = 'Move'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    input = Column(Text, nullable=False)
    ex = Column(Boolean, nullable=False)
    gameId = Column(ForeignKey(u'Game.id', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)

    Game = relationship(u'Game')


class CharacterMove(Base):
    __tablename__ = 'CharacterMoves'

    id = Column(Integer, primary_key=True)
    characterId = Column(ForeignKey(u'Character.id'), nullable=False)
    moveId = Column(ForeignKey(u'Move.id', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)

    Character = relationship(u'Character')
    Move = relationship(u'Move')
