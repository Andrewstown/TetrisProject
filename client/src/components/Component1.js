import React, {useContext} from 'react'

import './Component1.css'

import {UserContext} from './App'

export default function Component1(){
    const user = useContext(UserContext)

    return(
        <>
            <h1>{user}</h1>
            <div id='little-box'></div>
        </>
    )
}