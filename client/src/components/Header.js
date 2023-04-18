import React, {useContext} from 'react'
import {NavLink, useHistory, useLocation} from "react-router-dom"

import './Header.css'

import {UserContext, AvatarsContext} from './App'

export default function Header({updateUser}){
    const user = useContext(UserContext)
    const avatars = useContext(AvatarsContext)
    const history = useHistory()

    const logout = () => {
        fetch('/logout',{
            method: 'DELETE'
        })
        .then(r => {
            if(r.ok){
            updateUser(null)
            history.push('/games')
            window.location.reload()
            }
        })
    }

    const changeLocation = to => {
        history.push(`/${to}`)
        window.location.reload()
    }

    return(<div className='backdrop'>
        {avatars ? <>
            <p className='text' id='name'>{user ? user.name : 'Guest'}</p>
            <img className='avatar' src={user ? user.avatar : avatars[0].image}></img>
            {user ? <>
                <img className='coin' src='/coin.png'></img>
                <p className='text' id='coins'>0i Coins: {user.coins}</p>
                <p className='text' id='xp'>XP:</p>
                <div id='xp-bar'/>
                <div style={{top: '7.8vw', left: '13.8vw', width: `${user.xp/3000*6.2}vw`, height: '1.5vw',  position: 'fixed', backgroundColor: '#13e137'}}/>
                <p className='text' id='level'>Level: {user.level}</p>
            </>: null}
        </>: null}
        <button className='link' id='games' onClick={() => changeLocation('games')}>Games</button>
        <button className='link' id='store' onClick={() => changeLocation('store')}>Store</button>
        <button className='link' id='log' onClick={() => (user ? logout() : changeLocation('login'))}>{user ? 'Logout' : 'Login'}</button>
        <img className='logo' src='/tetrisfriends.png'></img>
    </div>)
}