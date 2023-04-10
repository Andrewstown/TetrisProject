import React, {useState, useEffect, useContext} from 'react'

import Block from './Block.js'

import './Game.css'

import {UserContext} from './App.js'

export default function Game(){
    const [time, setTime] = useState(0)
    const [color, setColor] = useState(1)
    const [score, setScore] = useState(0)
    const [board, setBoard] = useState(Array(20).fill(Array(10).fill({})))
    const [sprite, setSprite] = useState(null)

    const user = useContext(UserContext)

    let timeout = null
    let rotation = 0
    let xCurrent = 0
    let yCurrent = 0
    let blocksTemp = []
    let currentPiece = {}
    
    useEffect(() => {
        if (user)
            setSprite(user.sprite)
    }, [user])

    useEffect(() => {
        timeout = setTimeout(() => {
            setTime(time + 1)
        }, 1000)
    }, [time])

    useEffect(() => {
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 20; y++){
                blocksTemp.push({x: 742 + (32 * x), y: 289 + (32 * y)})
            }
        }
        console.log(board)
    }, [])
    //blocksTemp.push({x: 39.5 + (1.7 * x), y: 15.4+ (1.7 * y)})

    const addPiece = () => {

    }

    const spawnPiece = () => {
        setScore(score + 10)
        xCurrent = 4
        yCurrent = 1
        addPiece()
    }

    return(<>
        <p className='font' id='title'>Marathon</p>
        <img className='field' src='/field.png'/>
        <img className='fieldborder' src='/field.png'/>
        <div id='score'>
            <p>{score}</p>
        </div>
        <div className='border'>
            <div className='blockcell'></div>
            <p className='outtext'>hold</p>
            <p className='intext'>hold</p>
        </div>
        <div className='border' id='next'>
            <div className='blockcell' id='cell1'></div>
            <div className='blockcell' id='cell2'></div>
            <div className='blockcell' id='cell3'></div>
            <div className='blockcell' id='cell4'></div>
            <div className='blockcell' id='cell5'></div>
            <p className='outtext' id='nexttext'>next</p>
            <p className='intext' id='nexttext'>next</p>
        </div>
        {board.length > 0 ? <>
            {board.map(block => <Block x={block.x} y={block.y} sprite={sprite} color={color}/>)}
            <p>{time}</p>
        </> : null}
     </>)
}