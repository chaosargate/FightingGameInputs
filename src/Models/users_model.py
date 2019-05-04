# coding: utf-8
from sqlalchemy import BigInteger, Boolean, Column, Date, ForeignKey, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Role(Base):
    __tablename__ = 'role'
    __table_args__ = {'schema': 'users'}

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('users.role_id_seq'::regclass)"))
    name = Column(Text, nullable=False)


class SigningKey(Base):
    __tablename__ = 'signingKey'
    __table_args__ = {'schema': 'users'}

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('users.\"signingKey_id_seq\"'::regclass)"))
    key = Column(Text, nullable=False)


class User(Base):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'users'}

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('users.user_id_seq'::regclass)"))
    password = Column(Text)
    sessionId = Column(Text)
    sessionValidFrom = Column(Date)
    roleId = Column(ForeignKey('users.role.id'), nullable=False, server_default=text("2"))
    enabled = Column(Boolean, nullable=False, server_default=text("true"))
    username = Column(Text, nullable=False, unique=True)

    role = relationship('Role')
