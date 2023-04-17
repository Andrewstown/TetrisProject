from faker import Faker
from random import randint
from datetime import datetime

from app import app
from models import db, User, Game, Avatar, Sprite, UserGame, UserAvatar, UserSprite

if __name__ == '__main__':
    f = Faker()
    with app.app_context():
        print('Deleting Data...')
        User.query.delete()
        Game.query.delete()
        Avatar.query.delete()
        Sprite.query.delete()
        UserGame.query.delete()
        UserAvatar.query.delete()
        UserSprite.query.delete()

        print('Creating Users...')
        user = User(
            xp = 500,
            name = 'andrew',
            coins = 1000,
            level = 10,
            avatar = '/avatars/dog.png',
            password = '123'
        )
        db.session.add(user)

        print('Creating Games...')
        games = [
            Game(price = 0, title = 'marathon', description = 'Get your highest score with ramping difficulty!'),
            Game(price = 1000, title = 'sprint', description = 'Clear 40 lines as fast as possible!'),
        ]
        db.session.add_all([game for game in games])

        print('Creating Avatars...')
        avatars = [
            Avatar(name = 'guest', image = '/avatars/guest.png', price = 0.0),
            Avatar(name = 'unknown', image = '/avatars/unknown.png', price = 0.0),
            Avatar(name = 'purple', image = '/avatars/purple.png', price = 0.0),
            Avatar(name = 'blue', image = '/avatars/blue.png', price = 0.0),
            Avatar(name = 'lightblue', image = '/avatars/lightblue.png', price = 0.0),
            Avatar(name = 'green', image = '/avatars/green.png', price = 0.0),
            Avatar(name = 'yellow', image = '/avatars/yellow.png', price = 0.0),
            Avatar(name = 'orange', image = '/avatars/orange.png', price = 0.0),
            Avatar(name = 'red', image = '/avatars/red.png', price = 0.0),
            Avatar(name = 'ant', image = '/avatars/ant.png', price = 0.0),
            Avatar(name = 'bear', image = '/avatars/bear.png', price = 0.0),
            Avatar(name = 'bee', image = '/avatars/bee.png', price = 0.0),
            Avatar(name = 'bird', image = '/avatars/bird.png', price = 0.0),
            Avatar(name = 'bunny', image = '/avatars/bunny.png', price = 0.0),
            Avatar(name = 'cat', image = '/avatars/cat.png', price = 0.0),
            Avatar(name = 'chicken', image = '/avatars/chicken.png', price = 0.0),
            Avatar(name = 'cow', image = '/avatars/cow.png', price = 0.0),
            Avatar(name = 'crab', image = '/avatars/crab.png', price = 0.0),
            Avatar(name = 'dog', image = '/avatars/dog.png', price = 0.0),
            Avatar(name = 'domo', image = '/avatars/domo.png', price = 0.0),
            Avatar(name = 'dragon', image = '/avatars/dragon.png', price = 0.0),
            Avatar(name = 'eagle', image = '/avatars/eagle.png', price = 0.0),
            Avatar(name = 'elephant', image = '/avatars/elephant.png', price = 0.0),
            Avatar(name = 'fish', image = '/avatars/fish.png', price = 0.0),
            Avatar(name = 'frog', image = '/avatars/frog.png', price = 0.0),
            Avatar(name = 'goat', image = '/avatars/goat.png', price = 0.0),
            Avatar(name = 'koala', image = '/avatars/koala.png', price = 0.0),
            Avatar(name = 'lizard', image = '/avatars/lizard.png', price = 0.0),
            Avatar(name = 'monkey', image = '/avatars/monkey.png', price = 0.0),
            Avatar(name = 'mouse', image = '/avatars/mouse.png', price = 0.0),
            Avatar(name = 'octopus', image = '/avatars/octopus.png', price = 0.0),
            Avatar(name = 'ogre', image = '/avatars/ogre.png', price = 0.0),
            Avatar(name = 'panda', image = '/avatars/panda.png', price = 0.0),
            Avatar(name = 'pig', image = '/avatars/pig.png', price = 0.0),
            Avatar(name = 'polarbear', image = '/avatars/polarbear.png', price = 0.0),
            Avatar(name = 'racoon', image = '/avatars/racoon.png', price = 0.0),
            Avatar(name = 'rhino', image = '/avatars/rhino.png', price = 0.0),
            Avatar(name = 'shark', image = '/avatars/shark.png', price = 0.0),
            Avatar(name = 'sheep', image = '/avatars/sheep.png', price = 0.0),
            Avatar(name = 'spider', image = '/avatars/spider.png', price = 0.0),
            Avatar(name = 'tiger', image = '/avatars/tiger.png', price = 0.0),
            Avatar(name = 'turtle', image = '/avatars/turtle.png', price = 0.0)
        ]
        db.session.add_all([avatar for avatar in avatars])

        print('Creating Sprites...')
        sprites = {
            Sprite(name = '8bit', image = '/sprites/8bit.png', price = 0.0),
            Sprite(name = 'block', image = '/sprites/block.png', price = 0.0),
            Sprite(name = 'caution', image = '/sprites/caution.png', price = 0.0),
            Sprite(name = 'crystal', image = '/sprites/crystal.png', price = 0.0),
            Sprite(name = 'dot', image = '/sprites/dot.png', price = 0.0),
            Sprite(name = 'glass', image = '/sprites/glass.png', price = 0.0),
            Sprite(name = 'jelly', image = '/sprites/jelly.png', price = 0.0),
            Sprite(name = 'original', image = '/sprites/original.png', price = 0.0),
            Sprite(name = 'pane', image = '/sprites/pane.png', price = 0.0),
            Sprite(name = 'wutface', image = '/sprites/wutface.png', price = 0.0)
        }
        db.session.add_all([sprite for sprite in sprites])

        db.session.commit()
        print('Finished!')