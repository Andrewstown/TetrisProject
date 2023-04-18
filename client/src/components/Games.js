import React, {useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import Game from './Game.js'

import './Games.css'

let loaded = false

export default function Games({games}){
    const location = useLocation()
    const history = useHistory()

    const handleClick = title => history.push(`/games/${title}`)

    useEffect(() => {
        loaded = true
    }, [])

    return(<>
        {location.pathname.length < 7 ? <>
            <div className='backgames'>
                {games ? games.map(game => {
                    return(<div id='gamecard' onClick={() => handleClick(game.title)} style={{width: '15vw', height: '15vw', borderColor: `${game.color}`, borderRadius: '2vw', borderStyle: 'solid', borderWidth: '0.5vw', backgroundImage: `linear-gradient(${game.color}, #ececec)`}}>
                        <p className='gametitle'>{game.title}</p>
                        <p className='gamedescription'>{game.description}</p>
                        <img className='gameimage' src={game.image}/>
                    </div>)
                }) : null}
            </div>
        </> : <>{loaded ? <Game/> : null}</>}
    </>)
}