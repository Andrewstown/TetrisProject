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
            coins = 10000,
            level = 10,
            avatar = '/avatars/dog.png',
            password = '123'
        )
        db.session.add(user)

        print('Creating Games...')
        games = [
            Game(color = '#44a8fc', image = '/gamepics/marathon.png', price = 0, title = 'marathon', description = 'Get your highest score with ramping difficulty!'),
            Game(color = '#b63dfa', image = '/gamepics/sprint.png', price = 1000, title = 'sprint', description = 'Clear 40 lines as fast as possible!'),
        ]
        db.session.add_all([game for game in games])

        print('Creating Avatars...')
        avatars = [
            Avatar(name = 'guest', image = '/avatars/guest.png', price = 0),
            Avatar(name = 'unknown', image = '/avatars/unknown.png', price = 0),
            Avatar(name = 'purple', image = '/avatars/purple.png', price = 500),
            Avatar(name = 'blue', image = '/avatars/blue.png', price = 500),
            Avatar(name = 'lightblue', image = '/avatars/lightblue.png', price = 500),
            Avatar(name = 'green', image = '/avatars/green.png', price = 500),
            Avatar(name = 'yellow', image = '/avatars/yellow.png', price = 500),
            Avatar(name = 'orange', image = '/avatars/orange.png', price = 500),
            Avatar(name = 'red', image = '/avatars/red.png', price = 500),
            Avatar(name = 'ant', image = '/avatars/ant.png', price = 1000),
            Avatar(name = 'bear', image = '/avatars/bear.png', price = 1000),
            Avatar(name = 'bee', image = '/avatars/bee.png', price = 1000),
            Avatar(name = 'bird', image = '/avatars/bird.png', price = 1000),
            Avatar(name = 'bunny', image = '/avatars/bunny.png', price = 1000),
            Avatar(name = 'cat', image = '/avatars/cat.png', price = 1000),
            Avatar(name = 'chicken', image = '/avatars/chicken.png', price = 1000),
            Avatar(name = 'cow', image = '/avatars/cow.png', price = 1000),
            Avatar(name = 'crab', image = '/avatars/crab.png', price = 1000),
            Avatar(name = 'dog', image = '/avatars/dog.png', price = 1000),
            Avatar(name = 'domo', image = '/avatars/domo.png', price = 1000),
            Avatar(name = 'dragon', image = '/avatars/dragon.png', price = 1000),
            Avatar(name = 'eagle', image = '/avatars/eagle.png', price = 1000),
            Avatar(name = 'elephant', image = '/avatars/elephant.png', price = 1000),
            Avatar(name = 'fish', image = '/avatars/fish.png', price = 1000),
            Avatar(name = 'frog', image = '/avatars/frog.png', price = 1000),
            Avatar(name = 'goat', image = '/avatars/goat.png', price = 1000),
            Avatar(name = 'koala', image = '/avatars/koala.png', price = 1000),
            Avatar(name = 'lizard', image = '/avatars/lizard.png', price = 1000),
            Avatar(name = 'monkey', image = '/avatars/monkey.png', price = 1000),
            Avatar(name = 'mouse', image = '/avatars/mouse.png', price = 1000),
            Avatar(name = 'octopus', image = '/avatars/octopus.png', price = 1000),
            Avatar(name = 'ogre', image = '/avatars/ogre.png', price = 1000),
            Avatar(name = 'panda', image = '/avatars/panda.png', price = 1000),
            Avatar(name = 'pig', image = '/avatars/pig.png', price = 1000),
            Avatar(name = 'polarbear', image = '/avatars/polarbear.png', price = 1000),
            Avatar(name = 'racoon', image = '/avatars/racoon.png', price = 1000),
            Avatar(name = 'rhino', image = '/avatars/rhino.png', price = 1000),
            Avatar(name = 'shark', image = '/avatars/shark.png', price = 1000),
            Avatar(name = 'sheep', image = '/avatars/sheep.png', price = 1000),
            Avatar(name = 'spider', image = '/avatars/spider.png', price = 1000),
            Avatar(name = 'tiger', image = '/avatars/tiger.png', price = 1000),
            Avatar(name = 'turtle', image = '/avatars/turtle.png', price = 1000)
        ]
        db.session.add_all([avatar for avatar in avatars])

        print('Creating Sprites...')
        sprites = [
            Sprite(name = 'original', image = '/sprites/original.png', price = 0),
            Sprite(name = '8bit', image = '/sprites/8bit.png', price = 1000),
            Sprite(name = 'block', image = '/sprites/block.png', price = 1000),
            Sprite(name = 'caution', image = '/sprites/caution.png', price = 1000),
            Sprite(name = 'crystal', image = '/sprites/crystal.png', price = 1000),
            Sprite(name = 'dot', image = '/sprites/dot.png', price = 1000),
            Sprite(name = 'glass', image = '/sprites/glass.png', price = 1000),
            Sprite(name = 'jelly', image = '/sprites/jelly.png', price = 1000),
            Sprite(name = 'pane', image = '/sprites/pane.png', price = 1000),
            Sprite(name = 'wutface', image = '/sprites/wutface.png', price = 1000)
        ]
        db.session.add_all([sprite for sprite in sprites])

        print('Giving Games, Avatars and Sprites...')
        for user in User.query.all():
            usergame = UserGame(
                game_id = 1,
                user_id = user.id
            )
            db.session.add(usergame)
            useravatar = UserAvatar(
                avatar_id = 19,
                user_id = user.id
            )
            db.session.add(useravatar)
            usersprite = UserSprite(
                sprite_id = 1,
                user_id = user.id
            )
            db.session.add(usersprite)

        db.session.commit()
        print('Finished!')