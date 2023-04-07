import React, {useEffect, useState, createContext} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

import Header from './Header'
import Component1 from './Component1'

import './App.css'

export const UserContext = createContext(null)
export const AvatarsContext = createContext(null)

export default function App(){
  const [user, setUser] = useState(null)
  const [avatars, setAvatars] = useState(null)

  useEffect(() => {
    fetch('/users')
    .then(r => r.json())
    .then(users => setUser(users[0]))
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
          <Route exact path="/">
          </Route>
        </Switch>
        <Component1/>
      </AvatarsContext.Provider>
    </UserContext.Provider>
  </div>)
}