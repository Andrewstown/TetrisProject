import React, {useEffect, useState, createContext} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

import Header from './Header'
import Login from './Login'
import Store from './Store'
import Games from './Games'
import Game from './Game'

import './App.css'

export const UserContext = createContext(null)
export const AvatarsContext = createContext(null)

export default function App(){
  const [user, setUser] = useState(null)
  const [games, setGames] = useState(null)
  const [avatars, setAvatars] = useState(null)

  const history = useHistory()

  useEffect(() => {
    fetch('/authorized')
    .then (r => {
      if (r.ok){
        r.json().then(user => setUser(user))
      }else{
        setUser(null)
      }
    })
  },[])

  useEffect(() => {
    fetch('/games')
    .then(r => r.json())
    .then(games => setGames(games))
  }, [])

  useEffect(() => {
    fetch('/avatar')
    .then(r => r.json())
    .then(avatars => setAvatars(avatars))
  }, [])

  return(<div className='app'>
    <UserContext.Provider value={user}>
      <AvatarsContext.Provider value={avatars}>
        <Header updateUser={setUser}/>
        <Switch>
          <Route exact path='/games'>
            <Games games={games}/>
          </Route>
          <Route path='/games/'>
            <Game updateUser={setUser}/>
          </Route>
          <Route exact path='/store'>
            <Store/>
          </Route>
          <Route exact path='/login'>
            {user ? history.push('/games') : <Login updateUser={setUser}/>}
          </Route>
          <Route path="*">
            <h1 style={{top: '10vw', position: 'fixed', fontFamily: 'block'}}>404 not found</h1>
          </Route> 
        </Switch>
      </AvatarsContext.Provider>
    </UserContext.Provider>
  </div>)
}