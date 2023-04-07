import React, {useState, useEffect, useContext, useSyncExternalStore} from 'react'

import Block from './Block.js'

import './Component1.css'

import {UserContext} from './App'

export default function Component1(){
    const [color, setColor] = useState(1)
    const [sprite, setSprite] = useState(null)
    const [time, setTime] = useState(0)
    const [blocks, setBlocks] = useState({})

    const user = useContext(UserContext)

    let blocksTemp = []

    let style = {
        top: '300px',
        left: '300px',
        width: '32px',
        height: '32px',
        position: 'absolute',
        transform: 'scale(1.5)',
        background: `url(${sprite}) -${color * 32 + 32}px`
    }

    useEffect(() => {
        if (user)
            setSprite(user.sprite)
    }, [user])

    useEffect(() => {
        setTimeout(() => {
            setTime(time + 1)
        }, 1000)
    }, [time])

    useEffect(() => {
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 20; y++){
                blocksTemp.push({x: 720 + (32 * x), y: 290+ (32 * y)})
            }
        }
        setBlocks(blocksTemp)
    }, [])

    return(<>
        <p className='font' id='title'>Marathon</p>
        {/* <img className='field' src='/field.png'/>
        <img className='fieldborder' src='/field.png'/>
        {blocks.length > 0 ? <>
            {blocks.map(block => <Block x={block.x} y={block.y} sprite={sprite} color={color}/>)}
            <p>{time}</p>
        </> : null} */}
     </>)
}