import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from "react-router-dom"

import './Header.css'

import {UserContext} from './App'

export default function Header({updateUser}){
    const [avatar, setAvatar] = useState()

    const user = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        fetch('/avatar')
        .then(r => r.json())
        .then(a => setAvatar(a[0].image))
    }, [])

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

    return(<div id='header-background'>
        {avatar ? <>
            <p id='header-name' className='header-text'>{user ? user.name : 'Guest'}</p>
            <img id='header-avatar' src={user ? user.avatar : avatar}></img>
            <img id='header-logo' src='/tetrisfriends.png'></img>
            {user ? <>
                <img id='header-coin' src='/coin.png'></img>
                <p id='header-coins' className='header-text'>o Coins: {user.coins}</p>
                <p id='header-xp' className='header-text'>XP:</p>
                <div id='xp-bar'/>
                <div style={{top: '7.8vw', left: '13.8vw', width: `${user.xp/3000*5.8}vw`, height: '1.5vw',  position: 'fixed', backgroundColor: '#13e137'}}/>
                <p className='header-text' id='level'>Level: {user.level}</p>
            </>: null}
        </>: null}
        {/* <button className='link' id='games' onClick={() => changeLocation('games')}>Games</button>
        <button className='link' id='store' onClick={() => changeLocation('store')}>Store</button>
        <button className='link' id='log' onClick={() => (user ? logout() : changeLocation('login'))}>{user ? 'Logout' : 'Login'}</button> */}
    </div>)
}