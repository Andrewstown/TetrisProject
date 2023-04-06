import React, {useState, useEffect, useContext} from 'react'

import './Component1.css'

import {UserContext} from './App'

export default function Component1(){
    const [look, setLook] = useState(null)
    const [color, setColor] = useState(1)
    const [avatars, setAvatars] = useState(null)
    const [sprites, setSprites] = useState(null)

    const user = useContext(UserContext)

    //const looks = {dot, bit, wut, pane, block, glass, jelly, caution, crystal, original}

    let style = {
        top: '100px',
        left: '100px',
        width: '32px',
        height: '32px',
        position: 'absolute',
        //background: `url(${look}) -${color * 32 + 32}px`,
        transform: 'scale(1.5)'
    }

    useEffect(() => {
        fetch('/sprite')
        .then(r => r.json())
        .then(sprites => setSprites(sprites))
    }, [])

    useEffect(() => {
        fetch('/avatar')
        .then(r => r.json())
        .then(avatars => setAvatars(avatars))
    }, [])

    useEffect(() => {
        change()
        //setLook(looks['original'])
    }, [])

    const change = () =>{
        const thing = document.getElementsByClassName('original-red') 
    }

    return(
        <>
            {look ? <>
                {user && avatars && sprites ? <>
                    <h1 className='text'>{user.name}</h1>
                    {/* <img style={{top: '200px', position: 'absolute'}} src={`../${avatars[0].image}`}></img> */}
                </>: null}
                <div id='little-box'></div>
                <div style={style}></div>
            </> : null}
        </>
    )
}