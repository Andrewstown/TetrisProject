import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import './Games.css'

import {UserContext} from './App'

export default function Games({updateUser, updateGame, handleLogin}){
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
        if (user){
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

    const formatTime = time => {
        return `${(time/3600 < 10 ? "0" : "") + Math.floor(time/3600)}:${((time/60)%60 < 10 ? "0" : "") + Math.floor((time/60)%60)}.${(time%60 < 10 ? "0" : "") + time%60}`
    }

    const clickGame = game => {
        updateGame(game)
        history.push(`/games/${game.title}`)
    }

    return(<div className='backgames'>
        {games ? games.map(game => {
            let score = user ? checkGames(game.id) : 0
            let lock = user || game.id == 1 ? user ? (score == -1 ? true : false) : false : true
            return(<div id='gamecard' onClick={() => (lock ? buyGame(game) : clickGame(game))} style={{width: '15vw', height: '15vw', borderColor: `${game.color}`, borderRadius: '2vw', borderStyle: 'solid', borderWidth: '0.5vw', backgroundImage: `linear-gradient(${game.color}, #ececec)`}}>
                <p className='gametitle'>{game.title}</p>
                <div className='gamescore'>{lock ? (user ? `() ${game.price}` : '()()()( For More!') : `Highscore: ${game.title == 'sprint' ? formatTime(score) : score}`}</div>
                <p className='gamedescription'>{game.description}</p>
                <img className='gameimage' src={game.image}/>
                {lock ? <>
                    <div className='gamelock1'/>
                    <img className='gamelock2' src='lock.png'/>
                    {user ? <img className='gamecoin' src='coin.png'/> : <button className='log' onClick={handleLogin}>Login</button>}
                </> : null}
            </div>)
        }) : null}
    </div>)
}