import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import './Games.css'

import {UserContext} from './App'

export default function Games({updateUser}){
    const [games, setGames] = useState([])

    const user = useContext(UserContext)
    const history = useHistory()

    const playSound = (soundr, rate = 1) => {
        const noise = new Audio(`/sounds/${soundr}.wav`)
        noise.preservesPitch = false
        noise.playbackRate = rate
        noise.volume = 0.4
        noise.play()
    }

    useEffect(() => {
        fetch('/games')
        .then(r => r.json())
        .then(games => setGames(games))
    }, [])

    const buyGame = choice => {
        if(user.coins >= choice.price){
            fetch('/usergames', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"                    
                },
                body: JSON.stringify({game_id: choice.id, user_id: user.id})
            })
            .then(r => r.json())
            .then(() => {
                fetch(`/users/${user.name}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({name: user.name, coins: (user.coins-choice.price)})
                })
                .then(r => r.json())
                .then(data => {
                    updateUser(data)
                    playSound('lock', 1.1)
                })
            })
        }else{
            playSound('lock', 0.9)
        }
    }

    const checkGames = i => {
        let lock = -1
        for (let y = 0; y < user.user_games.length; y++){
            if (user.user_games[y].game_id == i){
                lock = user.user_games[y].highscore
            }
        }
        return lock
    }

    return(<div className='backgames'>
        {games && user ? games.map(game => {
            let lock = (checkGames(game.id) == -1 ? true : false)
            return(<div id='gamecard' onClick={() => (lock ? buyGame(game) : history.push(`/games/${game.title}`))} style={{width: '15vw', height: '15vw', borderColor: `${game.color}`, borderRadius: '2vw', borderStyle: 'solid', borderWidth: '0.5vw', backgroundImage: `linear-gradient(${game.color}, #ececec)`}}>
                <p className='gametitle'>{game.title}</p>
                <div className='gamescore'>{checkGames(game.id)}</div>
                <p className='gamedescription'>{game.description}</p>
                <img className='gameimage' src={game.image}/>
                {lock ? <>
                    <div className='gamelock1'/>
                    <img className='gamelock2' src='lock.png'/>
                </> : null}
            </div>)
        }) : null}
    </div>)
}