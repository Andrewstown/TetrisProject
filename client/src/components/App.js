import React, {useEffect, useState, createContext} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

import Header from './Header'
import Login from './Login'
import Store from './Store'
import Games from './Games'
import Game from './Game'

import './App.css'

export const UserContext = createContext(null)

export default function App(){
  const [user, setUser] = useState(null)
  const [game, setGame] = useState(null)

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

  const handleLogin = () => {
    history.push('/login')
    window.location.reload()
  }

  return(<div className='app'>
    <UserContext.Provider value={user}>
      <Header updateUser={setUser}/>
      <Switch>
        <Route exact path='/games'>
          <Games updateUser={setUser} updateGame={setGame} handleLogin={handleLogin}/>
        </Route>
        <Route path='/games/'>
          <Game updateUser={setUser} game={game} handleLogin={handleLogin}/>
        </Route>
        <Route exact path='/store'>
          <Store updateUser={setUser} handleLogin={handleLogin}/>
        </Route>
        <Route exact path='/login'>
          <Login updateUser={setUser}/>
        </Route>
        <Route path="*">
          <h1 style={{top: '10vw', position: 'fixed', fontFamily: 'block'}}>404 not found</h1>
        </Route> 
      </Switch>
    </UserContext.Provider>
  </div>)
}