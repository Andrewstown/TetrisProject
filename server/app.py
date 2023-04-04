from flask import Flask, make_response, request, jsonify, abort, session
from flask_migrate import Migrate
from flask_restful import Api, Resource

from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS

from models import db, User, Game, Review, UserGame

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
        return make_response([user.to_dict(rules=('-user_games',)) for user in User.query.all()], 200)
    
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_user = User(
                name = r_json['name'],
                email = r_json['email'],
                password = r_json['password']
            )

            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id

            return make_response(jsonify(new_user.to_dict()), 201)
        
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(Users, '/users')

#/users/:id
class UserById(Resource):
    #GET
    def get(self, id):
        user = User.query.filter_by(id = id).first()

        if not user:
            return make_response({'error': 'User Not Found!'}, 404)

        return make_response(user.to_dict(), 200)

    #PATCH
    def patch(self, id):
        user = User.query.filter_by(id= id).first()

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

    #DELETE
    def delete(self, id):
        user = User.query.filter_by(id = id).first()

        if not user:
            return make_response({'error': 'User Not Found!'}, 404)

        [db.session.delete(review) for review in Review.query.filter(Review.user_id == user.id).all()]
        [db.session.delete(usergame) for usergame in UserGame.query.filter(UserGame.user_id == user.id).all()]

        db.session.delete(user)
        db.session.commit()

        return make_response('', 204)

api.add_resource(UserById, '/users/<int:id>')

#/games
class Games(Resource):
    #GET
    def get(self):
        return make_response(jsonify([game.to_dict() for game in Game.query.all()]), 200)

    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_game = Game(
                img = r_json['image'],
                price = r_json['price'],
                genre = r_json['genre'],
                title = r_json['title'],
                studio = r_json['studio'],
                description = r_json['description']
            )

            db.session.add(new_game)
            db.session.commit()

            return make_response(jsonify(new_game.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(Games, '/games')

#/games/:id
class GameById(Resource):
    #GET
    def get(self, id):
        return make_response(Game.query.filter_by(id = id).first().to_dict(), 200)

    #PATCH
    def patch(self, id):
        game = Game.query.filter_by(id = id).first()

        if not game:
            return make_response({ 'error': 'Game Not Found!'}, 404)

        try:
            r_json = request.get_json()
            for key in r_json:
                setattr(game, key, r_json[key])
        
            db.session.add(game)
            db.session.commit()

            return make_response(game.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

    #DELETE
    def delete(self, id):
        game = Game.query.filter_by(id = id).first()

        if not game:
            return make_response({'error': 'Game Not Found!'}, 404)

        [db.session.delete(review) for review in Review.query.filter(Review.game_id == game.id).all()]
        [db.session.delete(usergame) for usergame in UserGame.query.filter(UserGame.game_id == game.id).all()]
        
        db.session.delete(game)
        db.session.commit()

        return make_response('', 204)

api.add_resource(GameById, '/games/<int:id>')

#/reviews
class Reviews(Resource):
    #POST
    def post(self):
        try:
            r_json = request.get_json()
            new_review = Review(
                rating = r_json['rating'],
                description = r_json['description'],
                game_id = r_json['game_id'],
                user_id = r_json['user_id']
            )

            user = User.query.filter(User.id == new_review.user_id).first()
            game = Game.query.filter(Game.id == new_review.game_id).first()

            if not user or not game:
                return make_response({'error': 'Invalid Game or User ID!'}, 400)

            db.session.add(new_review)
            db.session.commit()

            return make_response(jsonify(new_review.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(Reviews, '/reviews')

#/reviews/:id
class ReviewById(Resource):
    #DELETE
    def delete(self, id):
        review = Review.query.filter_by(id = id).first()

        if not review:
            return make_response({'error': 'Review Not Found!'}, 404)
        
        db.session.delete(review)
        db.session.commit()

        return make_response('', 204)

api.add_resource(ReviewById, '/reviews/<int:id>')

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

            if not User.query.filter(User.id == new_usergame.user_id).first() or not Game.query.filter(Game.id == new_usergame.game_id).first():
                return make_response({'error': 'Invalid Game or User ID!'}, 400)

            db.session.add(new_usergame)
            db.session.commit()

            return make_response(jsonify(new_usergame.to_dict()), 201)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

api.add_resource(UserGames, '/usergames')

#/usergames/:id
class UserGameById(Resource):
    #PATCH
    def patch(self, id):
        usergame = UserGame.query.filter_by(id = id).first()

        if not usergame:
            return make_response({ 'error': 'UserGame Not Found!'}, 404)

        try:
            r_json = request.get_json()
            for key in r_json:
                setattr(usergame, key, r_json[key])
        
            db.session.add(usergame)
            db.session.commit()

            return make_response(usergame.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': e.__str__()}, 400)

    #DELETE
    def delete(self, id):
        usergame = UserGame.query.filter_by(id = id).first()

        if not usergame:
            return make_response({'error': 'UserGame Not Found!'}, 404)
        
        db.session.delete(usergame)
        db.session.commit()

        return make_response('', 204)
    
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