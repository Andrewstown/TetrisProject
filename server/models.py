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
    bio = db.Column(db.String, default='')
    img = db.Column(db.String, default='https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/')
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user_games = db.relationship('UserGame', backref='user')

    serialize_rules = ('-user_games.user',)

    @validates('name')
    def validate_name(self, key, value):
        if len(value) < 1 or len(value) > 20:
            raise ValueError('Please enter a Username between 1-20 characters')
        return value

    @validates('email')
    def validate_email(self, key, value):
        if len(value) < 7 and not '@' in value:
            raise ValueError('Please enter a valid Email')
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
    img = db.Column(db.String)
    price = db.Column(db.Float)
    genre = db.Column(db.String)
    title = db.Column(db.String)
    studio = db.Column(db.String)
    description = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    game_reviews = db.relationship('Review', backref='game')

    serialize_rules = ('-game_reviews.game',)

    @validates('img')
    def validate_img(self, key, value):
        if len(value) < 0:
            raise ValueError('Please enter an Image')
        return value

    @validates('price')
    def validate_price(self, key, value):
        if value < 0:
            raise ValueError('Please enter a valid Price')
        return value

    @validates('genre')
    def validate_genre(self, key, value):
        if len(value) < 0:
            raise ValueError('Please enter a Genre')
        return value

    @validates('title')
    def validate_title(self, key, value):
        if len(value) < 0:
            raise ValueError('Please enter a Title')
        return value

    @validates('studio')
    def validate_title(self, key, value):
        if len(value) < 0:
            raise ValueError('Please enter a Studio')
        return value

    @validates('description')
    def validate_description(self, key, value):
        if len(value) < 20:
            raise ValueError('Please enter a Description with at least 20 characters')
        return value
    
    def __repr__(self):
        return f'<game title:{self.title}, price:{self.price}, genre: {self.genre}, description: {self.description}>'

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    description = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @validates('rating')
    def validate_rating(self, key, value):
        if value < 1 or value > 10:
            raise ValueError('Rating must be 1-10')
        return value

    @validates('description')
    def validate_description(self, key, value):
        if len(value) < 0:
            raise ValueError('Please enter a Review')
        return value

class UserGame(db.Model, SerializerMixin):
    __tablename__ = 'user_games'

    id = db.Column(db.Integer, primary_key=True)
    last_played = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    hours_played = db.Column(db.Integer, default='0')
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
