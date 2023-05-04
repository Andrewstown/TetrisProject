import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

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

let add = false
let bag = []
let drop = false
let goal = 5
let half = false
let held = false
let next = []
let play = false
let stop = false
let tick = 0
let time = 0
let board = [[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]]
let combo = 0
let ghost = true
let level = 1
let music = null
let spawn = false
let voice = true
let sound = true
let paused = true
let player = true
let points = 0
let xGhost = 0
let yGhost = 0
let gravity = 1000
let timerun = false
let dropTime = 0
let gamemode = 'marathon'
let gameover = false
let holdChar = ''
let holdTime = null
let lineText = ''
let lineTime = null
let justHeld = false
let rotation = 0
let timeDrop = null
let xCurrent = 0
let yCurrent = 0
let countdown = 3
let highscore = 0
let holdBlock = []
let holdPiece = null
let soundTime = 0
let lastTetris = false
let nextpieces = [[], [], [], [], []]
let currentPiece = null
let tempRotation = 0
let usergameindex = -1

export default function Game({updateUser, game, handleLogin}){
    const [tickS, setTickS] = useState(0)
    const [score, setScore] = useState(0)
    const [blocks, setBlocks] = useState({})
    const [sprite, setSprite] = useState(null)

    const user = useContext(UserContext)
    const history = useHistory()
    const location = useLocation()

    //colors: Z-1, L-2, O-3, S-4, I-5, J-6, T-7, ghost-9
    
    //GAME SETUP
    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.repeat && (e.key != 'ArrowDown' && e.key != 'ArrowLeft' && e.key != 'ArrowRight') || gameover == true || countdown > -1 || (paused && e.key != 'Escape') || stop == true) return
            switch(e.key){
                case 'ArrowUp':
                    calcRotation(1)
                    break
                case 'ArrowDown':
                    if (!(calcCollision(1, 2) < 1)){
                        add = true
                        dropTime = 0
                        window.clearTimeout(timeDrop)
                        if (soundTime < time){
                            soundTime = time + 3
                            playSound('ssoftdrop')
                        }
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
                    playSound('sharddrop')
                    break
                case 'c':
                    hold3()
                    break
                case 'Shift':
                    hold3()
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
    }, [])

    useEffect(() => {
        gamemode = location.pathname.substring(7, location.pathname.length)
        if (user){
            setSprite(user.sprite)
            for (let y = 0; y < user.user_games.length; y++){
                if (user.user_games[y].game_id == game.id){
                    usergameindex = y
                }
            }
        }else{
            setSprite('/sprites/original.png')
        }
    }, [user])

    useEffect(() => {
        setTimeout(() => {
            if (dropTime == 60){
                dropTime = 0
            }
            if (!paused && timerun){
                time++
                dropTime++
            }
            tick++
            setTickS(tick / 60)
        }, 1000 / 60)
    }, [tickS])

    const hold = () => {
        held = true
        removeGhost()
        playSound('shold')
        if (holdPiece == null){
            justHeld = true
            hold2()
            writePiece(-1, false)
            spawnPiece()
        }else{
            writePiece(-1, false)
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
                playSound('sgo')
                break
            case 1:
                playSound('scount')
                break
            case 2:
                playSound('scount', 1.2)
                break
            case 3:
                playSound('scount', 1.4)
                break
        }
        setTimeout(() => {
            countdown--
            if (countdown > -1 ){
                count()
            }else{
                timerun = true
                music = new Audio(`/sounds/${gamemode}.mp3`)
                music.volume = 0.5
                music.loop = true
                if (player) music.play()
                spawnPiece()
                runDropTime()
            }
        }, 750)
    }

    const hold2 = () => {
        holdPiece = currentPiece
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

    const hold3 = () => {
        window.clearTimeout(holdTime)
        holdTime = setTimeout(() => {
            holdChar = ''
        }, 550)
        if (!held) {
            holdChar = '✔'
            hold()
        }else{
            holdChar = 'X'
            playSound('sholdfail')
        }
    }

    const pause = () => {
        paused = !paused
        if (paused){
            window.clearTimeout(timeDrop)
            if (player) music.pause()
        }else{
            if (player) music.play()
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

    const hitPlay = () => {
        play = true
        paused = false
        playSound('schoose')
        gameSetup()
    }

    const addGhost = () => {
        xGhost = xCurrent
        yGhost = calcCollision(20, 2) + yCurrent
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                if (currentPiece.body[y][x] == 1 && board[x + xGhost][y + yGhost].color == -1){
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
            yCurrent += y
            writePiece(currentPiece.color, false)
            if (ghost)
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

    const gameOver = (win = false) => {
        gameover = true
        timerun = false
        music.pause()
        playSound('vhappy')
        playSound('sgameover')
        if (user){
            let gain = user.xp + (formatScore()*3)
            let xp = (gain%3000)
            let coins = user.coins + formatScore()
            let level = user.level + Math.floor(gain/3000)
            highscore = user.user_games[usergameindex].highscore
            if (gamemode == 'sprint' ? (win ? time < highscore || highscore == 0: false) : points > highscore){
                highscore = gamemode == 'sprint' ? time : points
                fetch(`/usergames/${user.user_games[usergameindex].id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({highscore: highscore})
                })
            }
            fetch(`/users/${user.name}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name: user.name, xp: xp, level: level, coins: coins})
            })
            .then(r => r.json())
            .then(data => updateUser(data))
        }
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
                if (board[x][y].color != -1){
                    
                    count++
                }
            }
            if (count == 10){
                for (let a = 0; a < 10; a++){
                    board[a][y].color = 0
                }
                lines++
            }
        }
        if (lines > 0){stop = true}
        setTimeout(() => {
            for (let y = 0; y < 21; y++){
                count = 0
                for (let x = 0; x < 10; x++){
                    if (board[x][y].color == 0){
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
                }
            }
            if (lines > 0){
                points += combo * 50 * level
                if (combo > 0){
                    if (combo > 6){
                        playSound('scombo7+')
                    }else{
                        playSound(`scombo${combo}`)
                    }
                }
                switch(lines){
                    case 1:
                        lineText = 'Single'
                        break
                    case 2:
                        lineText = 'Double'
                        break
                    case 3:
                        lineText = 'Triple'
                        break
                    case 4:
                        lineText = 'Tetris'
                        break
                }
                combo++
                if (lines > 1){
                    if (lastTetris && lines == 4){
                        playSound('vback2back')
                    }else{
                        playSound(`v${lines}v`)
                        lastTetris = (lines == 4)
                    }
                }
                points += (200 * lines - (lines == 4 ? 0 : 100)) * level
                setScore(points)
                playSound(`serase${lines}`)
                goal = Math.max(goal - lines, 0)
                if (gamemode == 'sprint' && goal < 21 && !half){
                    half = true
                    playSound('shurryup')
                }
                if (goal < 1){
                    if (gamemode == 'marathon'){
                        if (level == 15){
                            gameOver(true)
                        }else{
                            level++
                            goal = 5 * level
                            gravity *= 0.75
                            playSound('slevelup')
                        }
                    }else{
                        gameOver(true)
                    }
                }
                window.clearTimeout(timeDrop)
                runDropTime()
                window.clearTimeout(lineTime)
                lineTime = setTimeout(() => {
                    lineText = ''
                }, 800)
            }else{
                combo = 0
            }
            stop = false
            spawnPiece()
        }, (lines > 0 ? 200 : 1))
    }

    const gameSetup = () => {
        bag = [...pile]
        held = false
        next = []
        countdown = 3
        holdBlock = []
        holdPiece = null
        gameover = false
        setScore(0)
        points = 0
        level = 1
        goal = (gamemode == 'marathon' ? 5 : 40)
        time = 0
        timerun = false
        gravity = 1000
        for (let i = 0; i < 6; i++){
            addNext()
        }
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 21; y++){
                board[x][y] = {x: 741 + (32 * x), y: 257 + (32 * y), color: -1, stop: false}
            }
        }
        showNext()
        setBlocks(board)
        count()
    }

    const playSound = (soundr, rate = 1) => {
        if ((soundr[0] == 's' && sound) || (soundr[0] == 'v' && voice)){
            const noise = new Audio(`/sounds/${soundr}.wav`)
            noise.volume = 0.5
            noise.preservesPitch = false
            noise.playbackRate = rate
            noise.play()
        }
    }

    const spawnPiece = () => {
        spawn = false
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
            if (justHeld == false){
                held = false
            }else{
                justHeld = false
            }
            addPiece(0, 0)
        }else{
            for (let y = 0; y < 4; y++){
                for (let x = 0; x < 4; x++){
                    if (currentPiece.body[y][x] == 1){
                        if (board[x + xCurrent][y + yCurrent].color == -1){
                            board[x + xCurrent][y + yCurrent].color = currentPiece.color
                        }else{
                            board[x + xCurrent][y + yCurrent].color = 8
                        }
                    }
                }
            }
            setBlocks(board)
            window.clearTimeout(timeDrop)
            gameOver()
        }
    }

    const runDropTime = (timer = gravity) => {
        timeDrop = setTimeout(() => {
            if (!gameover && ! stop){
                if (calcCollision(1, 2) < 1){
                    spawn = true
                    writePiece(currentPiece.color, true)
                    lineCheck()
                    playSound('splace')
                }else{
                    removePiece(0, 1)
                }
                if (calcCollision(1, 2) < 1 && spawn == false){
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
                    board[x + xGhost][y + yGhost].color = -1
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
        writePiece(-1, false)
        if (ghost)
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
                            if (pos.stop == true && (pos.color != -1 || pos.color > 7)){
                                tempRotation = rotation
                            }
                        }else{
                            tempRotation = rotation
                        }
                    }
                }
                    
            }
            if (tempRotation == rotation){
                playSound('srotfail')
            }else{
                playSound('srotate')
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
                if (soundTime < time){
                    soundTime = time + 5
                    if (distance == 0){
                        playSound('smovefail')
                    }else{
                        playSound('smove')
                    }
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
                if (soundTime < time){
                    soundTime = time + 5
                    if (distance == 0){
                        playSound('smovefail')
                    }else{
                        playSound('smove')
                    }
                }
                return distance
            default:
                return 0
        }
    }

    const toggleGhost = () => {
        ghost = !ghost
        if (ghost){
            addGhost()
        }else{
            removeGhost()
        }
        playSound('schoose')
    }
    const toggleSound = () => {
        sound = !sound
        playSound('schoose')
    }
    const toggleMusic = () => {
        player = !player
        if (player && !paused){
            music.play()
        }else{
            music.pause()
        }
        playSound('schoose')
    }
    const toggleVoice = () => {
        voice = !voice
        playSound('schoose')
    }

    const formatTime = (num = time) => {
        return `${(num/3600 < 10 ? "0" : "") + Math.floor(num/3600)}:${((num/60)%60 < 10 ? "0" : "") + Math.floor((num/60)%60)}.${(num%60 < 10 ? "0" : "") + num%60}`
    }

    const formatScore = () => {
        return (Math.floor((points/100)*(gamemode == 'sprint' && goal == 0 ? (1 - (time / 36000)) * 3 : 1)))
    }

    return(<>
        <div style={{top: '0%', left: '0px', width: '100%', height: '100%', zIndex: '0', position: 'fixed', backgroundImage: `linear-gradient(${gamemode == 'marathon' ? 'white, #2BA6FF' : `#${half ? 'eea600' : '2BA6FF'}, white`})`, backgroundAttachment: 'fixed'}}/>
        <p className='font'>{gamemode}</p>
        <img className='field' src='/field.png'/>
        <img className='fieldborder' src='/field.png'/>
        <div id='score' style={{top: '11vw', left: '37.5vw', width: '19vw', height: '4vw', display: 'flex', position: 'fixed', alignItems: 'center', justifyContent: `${gamemode == 'marathon' ? 'right' : 'left'}`}}>
            {countdown < 0 ? <p>{gamemode == 'marathon' ? score : formatTime()}</p> : null}
        </div>
        <div className='border'>
            <div className='blockcell'></div>
            <p className='outtext'>hold</p>
            <p className='intext'>hold</p>
            {holdChar.length > 0 ? <>
                <div style={{top: '18vw', left: '31.5vw', width: '5.5vw', height: '5.5vw', zIndex: '2', position: 'fixed', boxShadow: `0 0 0 0.8vw #${holdChar === '✔' ? '00FF00' : 'FF0000'}`, borderRadius: '0.6vw', backgroundColor: '#F5F1F2'}}/>
                <p style={{top: '17vw', left: '36vw', color: `#${holdChar === '✔' ? '00FF00' : 'FF0000'}`, zIndex: '4', position: 'fixed', animation: 'hold 0.6s ease', fontSize: '4vw', fontFamily: 'block', WebkitTextStroke: `0.27vw #${holdChar === '✔' ? '006600' : '510000'}`}}>{holdChar}</p>
            </>: null}
            {lineText.length > 0 ? <>
                <p className='linesout'>{lineText}</p>
                <p className='linesin'>{lineText}</p>
                {combo > 1 ? <>
                    <p className='combo1'>Combo</p>
                    <p className='combo2'>Combo</p>
                    <p className='combo3'>{combo-1}</p>
                    <p className='combo4'>{combo-1}</p>
                </> : null}
            </> : null}
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
        {gameover ? <>
            <div className='gameover'></div>
            <p className='gameoverT'>Good Game!</p>
            <div className='stats'>
                <p>Time: {formatTime()}</p>
                <p>Score: {points}</p>
                {user ? <>
                    <p>XP: {formatScore()*3}</p>
                    <p>Coins: {formatScore()}</p>
                    <p>High: {gamemode == 'sprint' ? formatTime(highscore) : highscore}</p>
                </> : <>
                    <p>Get more out of tetris!</p>
                    <button className='play' id='login' onClick={handleLogin}>login</button>
                </>}
            </div>
        </>: null}
        {lineText.length > 0 && combo > 1 ? <>
        </> : null}
        {play ? <><div id='countdown'>
            {countdown > -1 && countdown < 4 ? <p style={{top: '23vw', left: '42vw', color: `${countdown == 0 ? '#19e637' : '#F5F1F2'}`, fontSize: '7.5vw', fontFamily: 'block', WebkitTextStroke: '0.3vw black'}}>{countdown == 0 ? 'GO!' : countdown}</p> : null}
            </div>
            {paused ? <>
                <div className='pause'/>
                <p className='paused'>Paused</p>
                <img id='control' src={'/controls.png'}/>
                <button id='ghost' style={{top: '25vw', left: '32vw', color: `${ghost ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${ghost ? '#19e637' : '#ff3d40'}`, borderStyle: `${document.querySelector('#ghost:active') ? 'inset' : 'outset'}`, borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${ghost ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleGhost}>Ghost</button>
                <button id='sound' style={{top: '28.5vw', left: '32vw', color: `${sound ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${sound ? '#19e637' : '#ff3d40'}`, borderStyle: `${document.querySelector('#sound:active') ? 'inset' : 'outset'}`, borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${sound ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleSound}>Sound</button>
                <button id='music' style={{top: '32vw', left: '32vw', color: `${player ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${player ? '#19e637' : '#ff3d40'}`, borderStyle: `${document.querySelector('#music:active') ? 'inset' : 'outset'}`, borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${player ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleMusic}>Music</button>
                <button id='voice' style={{top: '35.5vw', left: '32vw', color: `${voice ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${voice ? '#19e637' : '#ff3d40'}`, borderStyle: `${document.querySelector('#voice:active') ? 'inset' : 'outset'}`, borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${voice ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleVoice}>Voice</button>
            </> : null}
            {paused || gameover ? <button className='play' id='restart' onClick={hitPlay}>restart</button> : null}
            {blocks.length > 0 && sprite && countdown < 0 ? <div>
                {blocks.map(row => {
                    return(row.map(spot => {if (spot.y > 288 && spot.color > -1){return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color}/>)}}))
                })}
                {holdBlock.length > 0 ? holdBlock.map(spot => {
                    return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color} size={spot.size}/>)
                }) : null}
                {nextpieces[0].length > 0 ? nextpieces.map(next => {
                    return(next.map(spot => {return(<Block x={spot.x} y={spot.y} sprite={sprite} color={spot.color} size={spot.size}/>)}))
                }) : null}
                {gamemode == 'marathon' ? <>
                    <p className='level1'>Level</p>
                    <p className='level2'>Level</p>
                    <p className='level3'>{level}</p>
                    <p className='level4'>{level}</p>
                </> : <>
                <div className='outbar'/>
                <div style={{top: `${49.4-(12*(goal/40))}vw`, left: '37.9vw', width: '0.5vw', height: `${(goal/40)*12}vw`, zIndex: '1', position: 'fixed', borderStyle: 'solid', borderWidth: '0vw', borderRadius: '1vw', backgroundColor: '#e31200'}}/>
                </>}
                {level < 15 ? <>
                    <p className='goal1'>Goal</p>
                    <p className='goal2'>Goal</p>
                    <p className='goal3'>{goal}</p>
                    <p className='goal4'>{goal}</p>
                </> : null}
            </div> : null}
        </> :
            <button className='play' onClick={hitPlay}>Play</button>
        }
    </>)
}