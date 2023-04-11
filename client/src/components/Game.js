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

const I = new I_Piece()
const J = new J_Piece()
const L = new L_Piece()
const O = new O_Piece()
const S = new S_Piece()
const T = new T_Piece()
const Z = new Z_Piece()

let bag = []
let drop = false
let held = false
let next = []
let pile = [I, J, L, O, S, T, Z]
let tick = 1000
let time = 0
let board = [[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]]
let spawn = false
let timeout = null
let gameover = false
let justHeld = false
let rotation = 0
let xCurrent = 0
let yCurrent = 0
let scoreMulti = 1.00
let currentPiece = null
let tempRotation = 0

export default function Game(){
    const [hold, setHold] = useState(null)
    const [timeS, setTimeS] = useState(0)
    const [color, setColor] = useState(1)
    const [score, setScore] = useState(-10)
    const [blocks, setBlocks] = useState({})
    const [sprite, setSprite] = useState(null)

    const user = useContext(UserContext)

    //colors: Z-1, L-2, O-3, S-4, I-5, J-6, T-7, ghost-9

    useEffect(() => {
        if (user)
            setSprite(user.sprite)
    }, [user])


    useEffect(() => {
        timeout = setTimeout(() => {
            time++
            setTimeS(time / 60)
        }, tick / 60)
    }, [timeS])
    
    //GAME SETUP
    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.repeat) return
            removePiece(0, 1)
        })
        gameSetup()
    }, [])

    const addNext = () => {
        if (bag.length == 0){
            bag = [...pile]
        }
        let temp = Math.floor(Math.random() * bag.length)
        next.push(bag[temp])
        bag.splice(temp, 1)
        
    }

    const addPiece = (x, y) => {
        currentPiece.rotate(tempRotation)
        rotation = tempRotation
        xCurrent += x
        if (drop){
            drop = false
            yCurrent += y
            writePiece(currentPiece.color)//THIS IS MEANT FOR WHEN THE BLOCK IS DONE, SET A VALUE FOR THAT!
            lineCheck()
        }
        else if (calcCollision(1, 2) < 1 && spawn == false){
            writePiece(currentPiece.color)//THIS IS MEANT FOR WHEN THE BLOCK IS DONE, SET A VALUE FOR THAT!
            lineCheck()
        }
        else{
            spawn = false
            yCurrent += y
            writePiece(currentPiece.color)
            if (!user || user.ghost == true)
            {
                //AddGhost()
            }
            setBlocks(board)
        }
    }

    const canSpawn = () => {
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1){
                    if (board[x + xCurrent][y + yCurrent].color > 0){
                        return false
                    }
                }
            }
        }
        return true
    }

    const lineCheck = () => {
        let count = 0
        for (let y = 0; y < 20; y++){
            count = 0
            for (let x = 0; x < 10; x++){
                if (board[x][y].color != 0){
                    count++
                }
            }
            if (count == 10){
                for (let t = y; t > 1; t--){
                    for (let a = 0; a < 10; a++){
                        board[a, t].color = board[a, t-1].color
                    }
                }
                setScore(score + (100 * scoreMulti))
                scoreMulti += 0.01
            }
        }
        spawnPiece()
    }

    const writePiece = color => {
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1){
                    board[x + xCurrent][y + yCurrent].color = color
                }
            }
        }
        setBlocks(board)
    }

    const gameSetup = () => {
        bag = [...pile]
        held = false
        next = []
        setHold(null)
        gameover = false
        setScore(-10)
        scoreMulti = 1.00
        for (let i = 0; i < 5; i++){
            addNext()
        }
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 21; y++){
                board[x][y] = {x: 741 + (32 * x), y: 257 + (32 * y), color: 0}
            }
        }
        setBlocks(board)
        gameStart()
    }

    const gameStart = () => {
        spawnPiece()
    }

    const spawnPiece = () => {
        setScore(score + (10 * scoreMulti))
        currentPiece = next[0]
        currentPiece.rotate(0)
        rotation = 0
        tempRotation = 0
        next.shift()
        addNext()
        xCurrent = 3
        yCurrent = 0
        if (canSpawn()){
                spawn = true
                if (justHeld == false){
                    held = false
                }
                else{
                    justHeld = false
                }
                addPiece(0, 0)
            }
            else
            {
                gameover = true
                for (let y = 0; y < 4; y++){
                    for (let x = 0; x < 4; x++){
                        if (currentPiece.body[y][x] == 1){
                            if (board[x + xCurrent][y + yCurrent].color == 0){
                                board[x + xCurrent][y + yCurrent].color = currentPiece.color
                            }
                            else{
                                board[x + xCurrent][y + yCurrent].color = 8
                            }
                        }
                    }
                }
                setBlocks(board)
            }
    }

    const removePiece = (x, y) => {
        writePiece(0)
        if (!user || user.ghost == true)
        {
            //removeGhost()
        }
        addPiece(x, y)
    }

    const calcCollision = (distance, direction) => { // 1 = left, 2 = down, 3 = right
        switch (direction){
            case 1:
                for (let i = 1; i <= distance; i++){
                    currentPiece.leftMost.forEach(spot => {
                        if ((xCurrent + spot[0] - i) < 0 || (board[xCurrent + spot[0] - i][yCurrent + spot[1]].color > 0 && board[xCurrent + spot[1] - i][yCurrent + spot[1]].color > 0)){
                            distance = -(i - 1)
                        }
                    })
                }
                return -distance
            case 2:
                for (let i = 1; i <= distance; i++){
                    currentPiece.bottomMost.forEach(spot => {
                        if ((yCurrent + spot[1] + i) > 20 || (board[xCurrent + spot[0]][yCurrent + spot[1] + i].color > 0 && board[xCurrent + spot[0]][yCurrent + spot[1] + i].color > 0)){
                            distance = i - 1
                        }
                    })
                }
                return distance
            case 3:
                for (let i = 1; i <= distance; i++){
                    currentPiece.rightMost.forEach(spot => {
                        if ((xCurrent + spot[0] + i) > 9 || (board[xCurrent + spot[2] + i][yCurrent + spot[1]].color > 0 && board[xCurrent + spot[0]][yCurrent + spot[1] + i].color > 0)){
                            distance = i - 1
                        }
                    })
                }
                return distance
            default:
                return 0
        }
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