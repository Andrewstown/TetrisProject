import datetime
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

metadata = MetaData(naming_convention={
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
})

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db = SQLAlchemy(metadata=metadata)

CORS(app)
api = Api(app)
db.init_app(app)
migrate = Migrate(app, db)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    xp = db.Column(db.Integer, default=0)
    name = db.Column(db.String)
    coins = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=0)
    avatar = db.Column(db.String, default='/avatars/unknown.png')
    sprite = db.Column(db.String, default='/sprites/original.png')
    password = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user_games = db.relationship('UserGame', backref='user')
    user_avatars = db.relationship('UserAvatar', backref='user')
    user_sprites = db.relationship('UserSprite', backref='user')

    serialize_rules = ('-user_games.user', '-user_sprites.user', '-user_avatars.user')

    @validates('name')
    def validate_name(self, key, value):
        if len(value) < 1 or len(value) > 20:
            raise ValueError('Please enter a Username between 1-20 characters')
        return value

    @validates('password')
    def validate_password(self, key, value):
        if len(value) < 1:
            raise ValueError('Please enter a Password')
        return value

    def __repr__(self):
        return f'<user name:{self.name}, email:{self.email}>'

class Game(db.Model, SerializerMixin):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String)
    image = db.Column(db.String)
    price = db.Column(db.Float)
    title = db.Column(db.String)
    description = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<game title:{self.title}, price:{self.price}, genre: {self.genre}, description: {self.description}>'

class Avatar(db.Model, SerializerMixin):
    __tablename__ = 'avatars'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    price = db.Column(db.Integer)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Sprite(db.Model, SerializerMixin):
    __tablename__ = 'sprites'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    price = db.Column(db.Integer)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class UserGame(db.Model, SerializerMixin):
    __tablename__ = 'usergames'

    id = db.Column(db.Integer, primary_key=True)
    highscore = db.Column(db.Integer, default='0')
    
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class UserAvatar(db.Model, SerializerMixin):
    __tablename__ = 'useravatars'

    id = db.Column(db.Integer, primary_key=True)
    highscore = db.Column(db.Integer, default='0')
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    avatar_id = db.Column(db.Integer, db.ForeignKey('avatars.id'))

class UserSprite(db.Model, SerializerMixin):
    __tablename__ = 'usersprites'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sprite_id = db.Column(db.Integer, db.ForeignKey('sprites.id'))