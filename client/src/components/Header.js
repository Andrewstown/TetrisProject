import React, {useContext, useReducer} from 'react'
import {NavLink} from "react-router-dom"

import './Header.css'

import {UserContext, AvatarsContext} from './App'

export default function Header(){
    const user = useContext(UserContext)
    const avatars = useContext(AvatarsContext)

    return(<div className='backdrop'>
        {avatars ? <>
            <p className='text' id='name'>{user ? user.name : 'Guest'}</p>
            <img className='avatar' src={user ? user.avatar : avatars[0].image}></img>
            {user ? <>
                <img className='coin' src='/coin.png'></img>
                <p className='text' id='coins'>0i Coins: {user.coins}</p>
                <p className='text' id='xp'>XP:</p>
                <div id='xp-bar'/>
                <div style={{top: '138px', left: '260px', width: `${user.xp/1000*119}px`, height: '30px', position: 'fixed', fontSize: '27px', backgroundColor: '#13e137'}}/>
                <p className='text' id='level'>Level: {user.level}</p>
            </>: null}
        </>: null}
        {/* <nav className='nav'>
            <NavLink className='link' to="/store">Store</NavLink>
        </nav> */}
        <img className='logo' src='/tetrisfriends.png'></img>
    </div>)
}