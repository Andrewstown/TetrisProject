import React, {useState, useEffect, useContext} from 'react'

import Block from './Block.js'
import HoldBlock from './HoldBlock.js'
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
const pile = [I, J, L, O, S, T, Z]

let add = false
let bag = []
let drop = false
let held = false
let next = []
let tick = 0
let board = [[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]]
let level = 1
let spawn = false
let points = 0
let xGhost = 0
let yGhost = 0
let gameover = false
let justHeld = false
let rotation = 0
let timeTick = null
let timeDrop = null
let xCurrent = 0
let yCurrent = 0
let holdPiece = null
let currentPiece = null
let tempRotation = 0
let holdfornow = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]

export default function Game(){
    const [tickS, setTickS] = useState(0)
    const [score, setScore] = useState(0)
    const [blocks, setBlocks] = useState({})
    const [sprite, setSprite] = useState(null)
    const [holdPieceS, setHoldPieceS] = useState([])

    const user = useContext(UserContext)

    //colors: Z-1, L-2, O-3, S-4, I-5, J-6, T-7, ghost-9

    useEffect(() => {
        if (user)
            setSprite(user.sprite)
    }, [user])


    useEffect(() => {
        timeTick = setTimeout(() => {
            tick++
            setTickS(tick / 60)
        }, 1000 / 60)
    }, [tickS])
    
    //GAME SETUP
    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.repeat && (e.key != 'ArrowDown' && e.key != 'ArrowLeft' && e.key != 'ArrowRight') || gameover == true) return
            switch(e.key){
                case 'ArrowUp':
                    calcRotation(1)
                    break
                case 'ArrowDown':
                    window.clearTimeout(timeDrop)
                    runDropTime()
                    if (calcCollision(1, 2) < 1 && spawn == false){
                        writePiece(currentPiece.color, true)
                        lineCheck()
                    }else{
                        add = true
                        removePiece(0, 1)
                    }
                    break
                case 'ArrowLeft':
                    removePiece(calcCollision(1, 1), 0)
                    break
                case 'ArrowRight':
                    removePiece(calcCollision(1, 3), 0)
                    break
                case ' ':
                    add = true
                    drop = true
                    removePiece(0, calcCollision(20, 2))
                    break
                case 'c':
                    if (!held) {hold()}
                    break
                case 'Shift':
                    if (!held) {hold()}
                    break
            }
        })
        gameSetup()
    }, [])

    const hold = () => {
        held = true;
        removeGhost();
        if (holdPiece == null){
            justHeld = true
            holdPiece = currentPiece
            setHoldPieceS([currentPiece.look, currentPiece.color])
            writePiece(0, false)
            spawnPiece()
        }
        else{
            writePiece(0, false)
            let temphold = holdPiece
            holdPiece = currentPiece
            setHoldPieceS([currentPiece.look, currentPiece.color])
            xCurrent = 3
            yCurrent = 0
            currentPiece = temphold
            rotation = 0
            tempRotation = 0
            window.clearTimeout(timeDrop)
            addPiece(0, 0)
            runDropTime()
        }
    }

    const addNext = () => {
        if (bag.length == 0){
            bag = [...pile]
        }
        let temp = Math.floor(Math.random() * bag.length)
        next.push(bag[temp])
        bag.splice(temp, 1)
        
    }

    const addGhost = () => {
        xGhost = xCurrent
        yGhost = calcCollision(20, 2) + yCurrent
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1 && board[x + xGhost][y + yGhost].color == 0){
                    board[x + xGhost][y + yGhost].color = 9
                }
            }
        }
    }

    const addPiece = (x, y) => {
        currentPiece.rotate(tempRotation)
        rotation = tempRotation
        xCurrent += x
        if (drop){
            drop = false
            yCurrent += y
            writePiece(currentPiece.color, true)
            lineCheck()
        }
        else{
            spawn = false
            yCurrent += y
            writePiece(currentPiece.color, false)
            if (!user || user.ghost == true)
            {
                addGhost()
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
        for (let y = 0; y < 21; y++){
            count = 0
            for (let x = 0; x < 10; x++){
                if (board[x][y].color != 0){
                    count++
                }
            }
            if (count == 10){
                for (let t = y; t > 1; t--){
                    for (let a = 0; a < 10; a++){
                        board[a][t].color = board[a][t-1].color
                        board[a][t].stop = false
                    }
                }
                points += 100
                setScore(points)
            }
        }
        window.clearTimeout(timeDrop)
        spawnPiece()
        runDropTime()
    }

    const gameSetup = () => {
        bag = [...pile]
        held = false
        next = []
        setHoldPieceS(null)
        gameover = false
        setScore(0)
        points = 0
        for (let i = 0; i < 5; i++){
            addNext()
        }
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 21; y++){
                board[x][y] = {x: 741 + (32 * x), y: 257 + (32 * y), color: 0, stop: false}
            }
        }
        setBlocks(board)
        gameStart()
    }

    const gameStart = () => {
        spawnPiece()
        runDropTime()
    }

    const spawnPiece = () => {
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
            window.clearTimeout(timeDrop)
        }
    }

    const runDropTime = () => {
        timeDrop = setTimeout(() => {
            if (!gameover){
                if (calcCollision(1, 2) < 1 && spawn == false){
                    writePiece(currentPiece.color, true)
                    lineCheck()
                }else{
                    removePiece(0, 1)
                }
                runDropTime()
            }
        }, 1000)
    }

    const writePiece = (color, stop) => {
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1){
                    board[x + xCurrent][y + yCurrent].color = color
                    if (stop){board[x + xCurrent][y + yCurrent].stop = true}
                }
            }
        }
        setBlocks(board)
    }

    const removeGhost = () => {
        for (let y = 0; y < 4; y++){
                for (let x = 0; x < 4; x++){
                    if (currentPiece.body[y][x] == 1){
                        board[x + xGhost][y + yGhost].color = 0
                    }
                }
            }
    }

    const removePiece = (x, y) => {
        console.log(add)
        if (add){
            points += y * (drop ? 2 : 1)
            setScore(points)
            add = false
        } 
        console.log(points)
        writePiece(0, false)
        if (!user || user.ghost == true)
        {
            removeGhost()
        }
        addPiece(x, y)
    }

    const calcRotation = rotate => {
        tempRotation = (((rotation + rotate) < 4 && (rotation + rotate) > -1) ? rotation + rotate : ((rotation + rotate) > 3 ? 0 : 3))
        currentPiece.rotate(tempRotation)
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1){
                    if ((!(x + xCurrent < 0 || x + xCurrent > 9) && !(y + yCurrent < 0 || y + yCurrent > 20))){
                        let pos = board[x + xCurrent][y + yCurrent]
                        if (pos.stop == true && (pos.color != 0 || pos.color > 7)){
                            tempRotation = rotation
                        }
                    }
                    else{
                        tempRotation = rotation
                    }
                }
            }
                
        }
        currentPiece.rotate(rotation)
        removePiece(0, 0)
    }

    const calcCollision = (distance, direction) => { // 1 = left, 2 = down, 3 = right
        switch (direction){
            case 1:
                for (let i = 1; i <= distance; i++){
                    currentPiece.leftMost.forEach(spot => {
                        if ((xCurrent + spot[0] - i) < 0 || (board[xCurrent + spot[0] - i][yCurrent + spot[1]].color > 0 && board[xCurrent + spot[0] - i][yCurrent + spot[1]].color < 9)){
                            distance = -(i - 1)
                        }
                    })
                }
                return -distance
            case 2:
                for (let i = 1; i <= distance; i++){
                    currentPiece.bottomMost.forEach(spot => {
                        let pos = board[xCurrent + spot[0]][yCurrent + spot[1] + i]
                        if ((yCurrent + spot[1] + i) > 20 || (pos.color > 0 && pos.color < 9)){
                            distance = i - 1
                        }
                    })
                }
                return distance
            case 3:
                for (let i = 1; i <= distance; i++){
                    currentPiece.rightMost.forEach(spot => {
                        if ((xCurrent + spot[0] + i) > 9 || (board[xCurrent + spot[0] + i][yCurrent + spot[1]].color > 0 && board[xCurrent + spot[0] + i][yCurrent + spot[1]].color < 9)){
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
            {holdPieceS ? <p>asd</p> : null}
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
        </div> : null}
     </>)
}