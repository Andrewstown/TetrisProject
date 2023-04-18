import React from 'react'
import {useHistory} from 'react-router-dom'

import './Games.css'

export default function Games({games}){
    const history = useHistory()

    return(<>
        <div className='backgames'>
            {games ? games.map(game => {
                return(<div id='gamecard' onClick={() => history.push(`/games/${game.title}`)} style={{width: '15vw', height: '15vw', borderColor: `${game.color}`, borderRadius: '2vw', borderStyle: 'solid', borderWidth: '0.5vw', backgroundImage: `linear-gradient(${game.color}, #ececec)`}}>
                    <p className='gametitle'>{game.title}</p>
                    <p className='gamedescription'>{game.description}</p>
                    <img className='gameimage' src={game.image}/>
                </div>)
            }) : null}
        </div>
    </>)
}