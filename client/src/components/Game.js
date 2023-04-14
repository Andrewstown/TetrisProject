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
const pile = [I, J, L, O, S, T, Z]
const music = new Audio('/sounds/marathon.mp3')

let add = false
let bag = []
let drop = false
let held = false
let next = []
let tick = 0
let time = 0
let board = [[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]]
let combo = 0
let level = 1
let spawn = false
let paused = false
let points = 0
let xGhost = 0
let yGhost = 0
let gravity = 1000
let dropTime = 0
let gameover = false
let justHeld = false
let rotation = 0
let timeDrop = null
let xCurrent = 0
let yCurrent = 0
let countdown = 3
let holdBlock = []
let holdPiece = null
let lastTetris = false
let nextpieces = [[], [], [], [], []]
let currentPiece = null
let tempRotation = 0

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
        setTimeout(() => {
            if (dropTime == 60){
                dropTime = 0
            }
            if (!(paused)){
                time++
                dropTime++
            }
            tick++
            setTickS(tick / 60)
        }, 1000 / 60)
    }, [tickS])
    
    //GAME SETUP
    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.repeat && (e.key != 'ArrowDown' && e.key != 'ArrowLeft' && e.key != 'ArrowRight') || gameover == true || countdown > -1 || (paused && e.key != 'Escape')) return
            switch(e.key){
                case 'ArrowUp':
                    calcRotation(1)
                    break
                case 'ArrowDown':
                    if (!(calcCollision(1, 2) < 1 && spawn == false)){
                        add = true
                        dropTime = 0
                        window.clearTimeout(timeDrop)
                        playSound('softdrop')
                        runDropTime()
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
                    dropTime = 0
                    window.clearTimeout(timeDrop)
                    runDropTime()
                    removePiece(0, calcCollision(20, 2))
                    playSound('harddrop')
                    break
                case 'c':
                    if (!held) {hold()} else {playSound('holdfail')}
                    break
                case 'Shift':
                    if (!held) {hold()} else {playSound('holdfail')}
                    break
                case 'Escape':
                    pause()
                    break
                case 'Control':
                    calcRotation(-1)
                    break
                case 'z':
                    calcRotation(-1)
                    break
                case 'x':
                    calcRotation(1)
                    break
            }
        })
        gameSetup()
    }, [])

    const hold = () => {
        held = true
        removeGhost()
        playSound('hold')
        if (holdPiece == null){
            justHeld = true
            hold2()
            writePiece(0, false)
            spawnPiece()
        }else{
            writePiece(0, false)
            let temphold = holdPiece
            hold2()
            xCurrent = 3
            yCurrent = 0
            currentPiece = temphold
            rotation = 0
            tempRotation = 0
            window.clearTimeout(timeDrop)
            addPiece(0, 0)
            runDropTime()
            dropTime = 0
        }
    }

    const count = () => {
        switch(countdown){
            case 0:
                playSound('go')
                break
            case 1:
                playSound('count')
                break
            case 2:
                playSound('count', 1.2)
                break
            case 3:
                playSound('count', 1.4)
                break
        }
        setTimeout(() => {
            countdown--
            if (countdown > -1 ){
                count()
            }else{
                gameStart()
            }
        }, 850)
    }

    const hold2 = () => {
        holdPiece = currentPiece
        setHoldPieceS(currentPiece.look)
        holdBlock = []
        for(let y = 0; y < currentPiece.look.length; y++){
            for (let x = 0; x < currentPiece.look[y].length; x++){
                let size = 0.7
                if (currentPiece.look[y][x] == 1){
                    holdBlock.push({x: (638 - (16 * currentPiece.look[y].length * size) + (32 * x * size)), y: 385 - ((16 * currentPiece.look.length * size)) + (32 * y * size), color: currentPiece.color, size: size})
                }
            }
        }
    }

    const pause = () => {
        paused = !paused
        if (paused){
            window.clearTimeout(timeDrop)
            music.pause()
        }else{
            music.play()
            runDropTime(1000 - (1000 * (dropTime / 60)))
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
        }else{
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

    const showNext = () => {
        let size = 0
        let height = 0
        nextpieces = [[], [], [], [], []]
        for (let i = 0; i < 5; i++){
            switch(i){
                case 0:
                    size = 0.7
                    height = 385
                    break
                case 1:
                    size = 0.64
                    height = 502
                    break
                case 2:
                    size = 0.58
                    height = 609
                    break
                case 3:
                    size = 0.58
                    height = 712
                    break
                case 4:
                    size = 0.58
                    height = 816
                    break
            }
            if (next[i]){
                for(let y = 0; y < next[i].look.length; y++){
                    for (let x = 0; x < next[i].look[y].length; x++){
                        if (next[i].look[y][x] == 1){
                            nextpieces[i].push({x: (1155 - (16 * next[i].look[y].length * size) + (32 * x * size)), y: height - ((16 * next[i].look.length * size)) + (32 * y * size), color: next[i].color, size: size})
                        }
                    }
                }
            }
        }
    }

    const lineCheck = () => {
        let count = 0
        let lines = 0
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
                lines++
            }
        }
        if (lines > 0){
            points += combo * 50 * level
            if (combo > 0){
                if (combo > 6){
                    playSound('combo7+')
                }else{
                    playSound(`combo${combo}`)
                }
            }
            combo++
            if (lines > 1){
                if (lastTetris && lines == 4){
                    playSound('back2back')
                }else{
                    playSound(`${lines}v`)
                    lastTetris = (lines == 4)
                }
            }
            points += 200 * lines - (lines == 4 ? 0 : 100)
            setScore(points)
            playSound(`erase${lines}`)
        }else{
            combo = 0
        }
        spawnPiece()
    }

    const gameSetup = () => {
        bag = [...pile]
        held = false
        next = []
        countdown = 3
        setHoldPieceS(null)
        gameover = false
        setScore(0)
        points = 0
        for (let i = 0; i < 6; i++){
            addNext()
        }
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 21; y++){
                board[x][y] = {x: 741 + (32 * x), y: 257 + (32 * y), color: 0, stop: false}
            }
        }
        showNext()
        setBlocks(board)
        count()
    }

    const gameStart = () => {
        music.play()
        music.loop = true
        spawnPiece()
        runDropTime()
    }

    const playSound = (sound, rate = 1) => {
        const noise = new Audio(`/sounds/${sound}.wav`)
        noise.preservesPitch = false
        noise.playbackRate = rate
        noise.play()
    }

    const spawnPiece = () => {
        currentPiece = next[0]
        currentPiece.rotate(0)
        rotation = 0
        tempRotation = 0
        next.shift()
        showNext()
        addNext()
        xCurrent = 3
        yCurrent = 0
        if (canSpawn()){
            spawn = true
            if (justHeld == false){
                held = false
            }else{
                justHeld = false
            }
            addPiece(0, 0)
        }else{
            gameover = true
            for (let y = 0; y < 4; y++){
                for (let x = 0; x < 4; x++){
                    if (currentPiece.body[y][x] == 1){
                        if (board[x + xCurrent][y + yCurrent].color == 0){
                            board[x + xCurrent][y + yCurrent].color = currentPiece.color
                        }else{
                            board[x + xCurrent][y + yCurrent].color = 8
                        }
                    }
                }
            }
            setBlocks(board)
            window.clearTimeout(timeDrop)
        }
    }

    const runDropTime = (timer = gravity) => {
        timeDrop = setTimeout(() => {
            if (!gameover){
                if (calcCollision(1, 2) < 1 && spawn == false){
                    writePiece(currentPiece.color, true)
                    lineCheck()
                    playSound('place')
                }else{
                    removePiece(0, 1)
                }
                if (calcCollision(1, 2) < 1){
                    window.clearTimeout(timeDrop)
                    runDropTime(1000)
                }else{
                    runDropTime()
                }
            }
        }, timer)
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
        if (add){
            points += y * (drop ? 2 : 1)
            setScore(points)
            add = false
        }
        writePiece(0, false)
        if (!user || user.ghost == true)
        {
            removeGhost()
        }
        addPiece(x, y)
    }

    const calcRotation = rotate => {
        if (currentPiece != O){
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
                        }else{
                            tempRotation = rotation
                        }
                    }
                }
                    
            }
            if (tempRotation == rotation){
                playSound('rotfail')
            }else{
                playSound('rotate')
            }
            currentPiece.rotate(rotation)
        }
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
                if (distance == 0){
                    playSound('movefail')
                }else{
                    playSound('move')
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
                if (distance == 0){
                    playSound('movefail')
                }else{
                    playSound('move')
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
            {countdown < 0 ? <p>{score}</p> : null}
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
        <div id='countdown'>
            {countdown > -1 && countdown < 4 ? <p style={{top: '23vw', left: '42vw', color: `${countdown == 0 ? '#19e637' : '#F5F1F2'}`, fontSize: '7.5vw', fontFamily: 'block', WebkitTextStroke: '0.3vw black'}}>{countdown == 0 ? 'GO!' : countdown}</p> : null}
        </div>
        {paused ? <>
            <div className='pause'/>
            <p className='paused'>Paused</p>
        </> : null}
        {blocks.length > 0 && sprite && countdown < 0 ? <div>
            {blocks.map(row => {
                return(row.map(spot => {if (spot.y > 288 && spot.color > 0){return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color}/>)}}))
            })}
            {holdBlock.length > 0 ? holdBlock.map(spot => {
                return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color} size={spot.size}/>)
            }) : null}
            {nextpieces[0].length > 0 ? nextpieces.map(next => {
                return(next.map(spot => {return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color} size={spot.size}/>)}))
            }) : null}
        </div> : null}
     </>)
}