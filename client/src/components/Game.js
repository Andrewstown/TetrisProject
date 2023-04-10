import React, {useState, useEffect, useContext} from 'react'

import Block from './Block.js'
import I_Piece from './Tetriminos/I_Piece.js'
import J_Piece from './Tetriminos/J_Piece.js'
import L_Piece from './Tetriminos/L_Piece.js'
import O_Piece from './Tetriminos/O_Piece.js'
import S_Piece from './Tetriminos/S_Piece.js'
import T_Piece from './Tetriminos/T_Piece.js'
import Z_Piece from './Tetriminos/Z_Piece.js'

import './Game.css'

import {UserContext} from './App.js'

export default function Game(){
    const [I, setI] = useState(null)
    const [J, setJ] = useState(null)
    const [L, setL] = useState(null)
    const [O, setO] = useState(null)
    const [S, setS] = useState(null)
    const [T, setT] = useState(null)
    const [Z, setZ] = useState(null)
    const [time, setTime] = useState(0)
    const [color, setColor] = useState(1)
    const [score, setScore] = useState(0)
    const [blocks, setBlocks] = useState({})
    const [sprite, setSprite] = useState(null)

    const user = useContext(UserContext)

    let board = [[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]]
    let timeout = null
    let rotation = 0
    let xCurrent = 0
    let yCurrent = 0
    let currentPiece = {}

    //colors: Z-1, L-2, O-3, S-4, I-5, J-6, T-7, ghost-9
    
    //GAME SETUP
    useEffect(() => {
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 21; y++){
                board[x][y] = {x: 742 + (32 * x), y: 257 + (32 * y), color: 0}
            }
        }
        setBlocks(board)
        spawnPiece()
        addPiece()
        setI(new I_Piece())
        setJ(new J_Piece())
        setL(new L_Piece())
        setO(new O_Piece())
        setS(new S_Piece())
        setT(new T_Piece())
        setZ(new Z_Piece())
    }, [])

    useEffect(() => {
        if (user)
            setSprite(user.sprite)
    }, [user])

    // useEffect(() => {
    //     timeout = setTimeout(() => {
    //         setTime(time + 1)
    //     }, 1000)
    // }, [time])

    const spawnPiece = () => {
        setScore(score + 10)
        xCurrent = 4
        yCurrent = 1
        addPiece()
    }

    const addPiece = () => {
        board[xCurrent][yCurrent].color = 2
        setBlocks(board)
    }

    const removePiece = () => {

    }

    const drawPiece = () => {
        
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
        {blocks.length > 0 ? <div>
            {blocks.map(block => {
                return(
                    block.map(blk => {
                        if (blk.y > 288 && blk.color > 0){
                           return(<Block x={blk.x} y={blk.y} sprite={sprite} color={blk.color}/>)
                        }
                    })
                )
            })}
            <p>{time}</p>
        </div> : null}
     </>)

     
}