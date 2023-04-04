import React, {useEffect, useState, createContext} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

import Component1 from './Component1'

export const UserContext = createContext(null)

export default function App(){
  const [user, setUser] = useState('Andrew')

  return(
    <main className='app'>
      <UserContext.Provider value={user}>
        <Component1/>
      </UserContext.Provider>
    </main>
  )
}