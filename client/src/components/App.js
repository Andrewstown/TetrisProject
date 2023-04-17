import React, {useEffect, useState, createContext} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

import Header from './Header'
import Games from './Games'

import './App.css'

export const UserContext = createContext(null)
export const AvatarsContext = createContext(null)

export default function App(){
  const [user, setUser] = useState(null)
  const [games, setGames] = useState(null)
  const [avatars, setAvatars] = useState(null)

  useEffect(() => {
    fetch('/users')
    .then(r => r.json())
    .then(users => setUser(users[0]))
  }, [])

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
        <Header/>
        <Switch>
          <Route exact path='/'>
            {useHistory().push('/games')}
          </Route>
          <Route path='/games'>
            <Games games={games}/>
          </Route>
          <Route path="*">
            <h1 style={{fontFamily: 'block'}}>404 not found</h1>
          </Route> 
        </Switch>
      </AvatarsContext.Provider>
    </UserContext.Provider>
  </div>)
}