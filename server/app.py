from flask import Flask, make_response, request, jsonify, abort, session
from flask_migrate import Migrate
from flask_restful import Api, Resource

from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS

from models import db, User, Game, Avatar, Sprite, UserGame, UserAvatar, UserSprite

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config['SECRET_KEY'] = "abcd"


api = Api(app)
db.init_app(app)
migrate = Migrate(app, db)

#/users
class Users(Resource):
    #GET
    def get(self):
        return make_response([user.to_dict(rules=('-user_games', '-user_avatars', '-user_sprites',)) for user in User.query.all()], 200)
    
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_user = User(
                name = r_json['name'],
                password = r_json['password']
            )

            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id

            usergame = UserGame(
                game_id = 1,
                user_id = new_user.id
            )
            db.session.add(usergame)
            usersprite = UserSprite(
                sprite_id = 1,
                user_id = new_user.id
            )
            db.session.add(usersprite)
            db.session.commit()

            return make_response(jsonify(new_user.to_dict()), 201)
        
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(Users, '/users')

#/users/:name
class UserByName(Resource):
    #GET
    def get(self, id):
        user = User.query.filter_by(name=request.get_json()['name']).first()

        if not user:
            return make_response({'error': 'User Not Found!'}, 404)

        return make_response(user.to_dict(), 200)

    #PATCH
    def patch(self, id):
        user = User.query.filter_by(name=request.get_json()['name']).first()

        if not user:
            return make_response({'error': 'User Not Found!' }, 404)

        try: 
            r_json = request.get_json()
            for key in r_json:
                setattr(user, key, r_json[key])
        
            db.session.add(user)
            db.session.commit()

            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(UserByName, '/users/<string:id>')

#/games
class Games(Resource):
    #GET
    def get(self):
        return make_response(jsonify([game.to_dict() for game in Game.query.all()]), 200)

api.add_resource(Games, '/games')

# #/games/:id
# class GameById(Resource):
#     #GET
#     def get(self, id):
#         return make_response(Game.query.filter_by(id = id).first().to_dict(), 200)

# api.add_resource(GameById, '/games/<int:id>')

#/avatars
class Avatars(Resource):
    #GET
    def get(self):
        return make_response([avatar.to_dict() for avatar in Avatar.query.all()], 200)

api.add_resource(Avatars, '/avatar')

#/sprites
class Sprites(Resource):
    #GET
    def get(self):
        return make_response([sprite.to_dict() for sprite in Sprite.query.all()], 200)

api.add_resource(Sprites, '/sprite')

class SpritesById(Resource):
    #GET
    def get(self, id):
        return make_response([sprite.to_dict() for sprite in Sprite.query.all()], 200)

api.add_resource(SpritesById, '/sprites/<int:id>')

#/usergames
class UserGames(Resource):
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_usergame = UserGame(
                game_id = r_json['game_id'],
                user_id = r_json['user_id']
            )

            db.session.add(new_usergame)
            db.session.commit()

            return make_response(jsonify(new_usergame.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(UserGames, '/usergames')

#/useravatars
class UserAvatars(Resource):
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_useravatar = UserAvatar(
                avatar_id = r_json['avatar_id'],
                user_id = r_json['user_id']
            )

            db.session.add(new_useravatar)
            db.session.commit()

            return make_response(jsonify(new_useravatar.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(UserAvatars, '/useravatars')

#/usersprites
class UserSprites(Resource):
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_usersprite = UserSprite(
                sprite_id = r_json['sprite_id'],
                user_id = r_json['user_id']
            )

            db.session.add(new_usersprite)
            db.session.commit()

            return make_response(jsonify(new_usersprite.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(UserSprites, '/usersprites')

#/usergames/:id
class UserGameById(Resource):
    #PATCH
    def patch(self, id):
        usergame = UserGame.query.filter_by(id = id).first()

        if not usergame:
            return make_response({'error': 'UserGame Not Found!'}, 404)

        try:
            r_json = request.get_json()
            for key in r_json:
                setattr(usergame, key, r_json[key])
        
            db.session.add(usergame)
            db.session.commit()

            return make_response(usergame.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)
    
api.add_resource(UserGameById, '/usergames/<int:id>')

class Login(Resource):
    def post(self):
        user = User.query.filter_by(name=request.get_json()['name']).first()
        
        if not user:
            return make_response({'error': 'Invalid Username/Password'}, 403)

        session['user_id'] = user.id
        response = make_response(
            user.to_dict(),
            200
        )
        return response
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        response = make_response('',204)
        return response

api.add_resource(Logout, '/logout')

class AuthorizedSession(Resource):
    def get(self):
        user= User.query.filter_by(id=session.get('user_id')).first()
        if user:
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        else:
            abort(401, "Unauthorized")

api.add_resource(AuthorizedSession, '/authorized')

if __name__ == '__main__':
    app.run(port=5555, debug=True)