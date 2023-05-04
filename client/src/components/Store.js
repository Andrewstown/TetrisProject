import React, {useState, useEffect, useContext, useReducer} from 'react'

import './Store.css'

import {UserContext} from './App'

let music = null
let sound2 = true
let player2 = true

export default function Store({updateUser, handleLogin}){
    const [shop, setShop] = useState(false)
    const [click, setClick] = useState(true)
    const [sound, setSound] = useState(true)
    const [player, setPlayer] = useState(true)
    const [avatars, setAvatars] = useState([])
    const [sprites, setSprites] = useState([])

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const user = useContext(UserContext)

    let scale = window.innerWidth / 1879

    useEffect(() => {
        window.addEventListener("resize", () => {
            scale = window.innerWidth / 1879
            forceUpdate()
        })

        music = new Audio(`/sounds/shop.mp3`)
        music.volume = 0.5
        music.loop = true

        fetch('/avatar')
        .then(r => r.json())
        .then(data => setAvatars(data.filter(a => a.id != 1 && a.id != 2)))

        fetch('/sprite')
        .then(r => r.json())
        .then(data => setSprites(data))
    }, [])

    const playSound = (soundr, rate = 1) => {
        if (sound2) {
            const noise = new Audio(`/sounds/${soundr}.wav`)
            noise.preservesPitch = false
            noise.playbackRate = rate
            noise.volume = 0.5
            noise.play()
        }
    }

    const hitShop = () => {
        setShop(true)
        playSound('schoose')
        if (player) music.play()
    }

    const toggleSound = () => {
        setSound(!sound)
        sound2 = !sound2
        playSound('schoose')
    }

    const toggleMusic = () => {
        setPlayer(!player)
        player2 = !player2
        if (player2 && shop){
            music.play()
        }else{
            music.pause()
        }
        playSound('schoose')
    }

    const handleChoose = (choice, w) => {
        if (w == 1){
            switch(checkAvatars(choice.id)){
                case 'lock':
                    if(user.coins >= choice.price){
                        fetch('/useravatars', {
                            method: "POST",
                            headers: {
                                "Content-Type":"application/json"                    
                            },
                            body: JSON.stringify({avatar_id: choice.id, user_id: user.id})
                        })
                        .then(r => r.json())
                        .then(() => {
                            fetch(`/users/${user.name}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({name: user.name, coins: (user.coins-choice.price)})
                            })
                            .then(r => r.json())
                            .then(data => {
                                updateUser(data)
                                playSound('lock', 1.1)
                            })
                        })
                    }else{
                        playSound('lock', 0.9)
                    }
                    break;
                case 'Owned':
                    fetch(`/users/${user.name}`, {
                        method: "PATCH",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({name: user.name, avatar: choice.image})
                    })
                    .then(r => r.json())
                    .then(data => {
                        updateUser(data)
                        playSound('bump', 1.1)
                    })
                    break;
                case 'Equipped':
                    break;
            }
        }else{
            switch(checkSprites(choice.id)){
                case 'lock':
                    if(user.coins >= choice.price){
                        fetch('/usersprites', {
                            method: "POST",
                            headers: {
                                "Content-Type":"application/json"                    
                            },
                            body: JSON.stringify({sprite_id: choice.id, user_id: user.id})
                        })
                        .then(r => r.json())
                        .then(() => {
                            fetch(`/users/${user.name}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({name: user.name, coins: (user.coins-choice.price)})
                            })
                            .then(r => r.json())
                            .then(data => {
                                updateUser(data)
                                playSound('lock', 1.1)
                            })
                        })
                    }else{
                        playSound('lock', 0.9)
                    }
                    break;
                case 'Owned':
                    fetch(`/users/${user.name}`, {
                        method: "PATCH",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({name: user.name, sprite: choice.image})
                    })
                    .then(r => r.json())
                    .then(data => {
                        updateUser(data)
                        playSound('bump', 1.1)
                    })
                    break;
                case 'Equipped':
                    break;
            }
        }
    }

    const handleClick = t => {
        setClick(t)
        if (t != click){
            playSound('schoose')
        }
    }

    const checkAvatars = i => {
        let lock = 'lock'
        for (let y = 0; y < user.user_avatars.length; y++){
            if (user.user_avatars[y].avatar_id == i){
                if (user.avatar == avatars[i-3].image) {lock = 'Equipped'} else lock = 'Owned'
            }
        }
        return lock
    }

    const checkSprites = i => {
        let lock = 'lock'
        for (let y = 0; y < user.user_sprites.length; y++){
            if (user.user_sprites[y].sprite_id == i){
                if (user.sprite == sprites[i-1].image) {lock = 'Equipped'} else lock = 'Owned'
            }
        }
        return lock
    }

    return(<>
        <div className='backstore'/>
        {user ? <>
            {shop ? null : <button className='shop' onClick={hitShop}>Shop!</button>}
            <button style={{top: '11.25vw', left: '76vw', color: `${sound ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${sound ? '#19e637' : '#ff3d40'}`, borderStyle: 'outset', borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${sound ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleSound}>Sound</button>
            <button style={{top: '11.25vw', left: '85vw', color: `${player ? '#19e637' : '#ff3d40'}`, width: '8.3vw', cursor: 'grab', height: '3.1vw', display: 'flex', zIndex: '9', position: 'fixed', fontSize: '2vw', aligniTems: 'center', fontFamily: 'block', borderColor: `${player ? '#19e637' : '#ff3d40'}`, borderStyle: 'outset', borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `${player ? '#19e637' : '#ff3d40'}`, WebkitTextStroke: '0.125vw black'}} onClick={toggleMusic}>Music</button>
            {shop ? <>
                <button onClick={() => {handleClick(true)}} style={{top: '12.4vw', left: '6vw', color: '#efefef', width: '11vw', cursor: 'pointer', height: '3vw', display: 'flex', zindex: '1', position: 'fixed', fontSize: '2vw', alignItems: 'center', fontFamily: 'block', borderColor: `#${click ? '989898' : 'd8d8d8'}`, borderRadius: '1vw 1vw 0vw 0vw', borderStyle: 'solid', borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `#${click ? 'e1e1e1' : 'efefef'}`, WebkitTextStroke: `0.12vw #${click ? '515151' : 'b1b1b1'}`}}>Avatars</button>
                <button onClick={() => {handleClick(false)}} style={{top: '12.4vw', left: '17vw', color: '#efefef', width: '11vw', cursor: 'pointer', height: '3vw', display: 'flex', zindex: '1', position: 'fixed', fontSize: '2vw', alignItems: 'center', fontFamily: 'block', borderColor: `#${!click ? '989898' : 'd8d8d8'}`, borderRadius: '1vw 1vw 0vw 0vw', borderStyle: 'solid', borderWidth: '0.4vw', justifyContent: 'center', backgroundColor: `#${!click ? 'e1e1e1' : 'efefef'}`, WebkitTextStroke: `0.12vw #${!click ? '515151' : 'b1b1b1'}`}}>Sprites</button>
            </> : null}
        </> : <>
            <button className='logi' onClick={handleLogin}>Login</button>
            <div className='logitext'>Please login to use the shop!</div>
        </>}
        <div className='store'>
            {shop && user ? <div className='list'>
                {click ? <>
                    {avatars.map(avatar => {
                        let lock = checkAvatars(avatar.id)
                        return(
                            <div className='avat' onClick={() => handleChoose(avatar, 1)}>
                                <div className='avatback'/>
                                <div style={{top: '1.3vw', width: 'inherit', cursor: 'relative', height: '0.25vw', zIndex: '3', position: 'relative', backgroundColor: '#989898'}}/>
                                <div className='avatline2'/>
                                {lock == 'lock' ? <>
                                    <div className='avatlock1'/>
                                    <img className='avatlock2' src='lock.png'/>
                                    <img className='avatcoin' src='coin.png'/>
                                    <p className='avatprice'>{avatar.price == 0 ? 'Free' : avatar.price}</p>
                                </> : <>
                                    <div style={{top: '0.1vw', left: '0vw', color: `${lock == 'Owned' ? 'black' : '#efe100'}`, width: '7vw', zIndex: '8', position: 'absolute', fontSize: '1vw', textAlign: 'center', fontFamily: 'block', webkitTextStroke: '0.05vw black'}}>{lock}</div>
                                </>}
                                <img src={avatar.image} className='avatpic'/>
                                <div className='avatname'>{avatar.name}</div>
                            </div>
                        )
                    })}
                </> : <>
                    {sprites.map(sprite => {
                        let lock = checkSprites(sprite.id)
                        return(
                            <div className='sprit' onClick={() => handleChoose(sprite, 2)}>
                                <div className='spritback'/>
                                {lock == 'lock' ? <>
                                    <div className='spritlock1'/>
                                    <img className='spritlock2' src='lock.png'/>
                                    <img className='spritcoin' src='coin.png'/>
                                    <p className='spritprice'>{sprite.price == 0 ? 'Free' : sprite.price}</p>
                                </> : <>
                                    <div style={{top: '0.2vw', left: '0vw', color: `${lock == 'Owned' ? 'black' : '#efe100'}`, width: '14vw', zIndex: '8', position: 'absolute', fontSize: '2vw', textAlign: 'center', fontFamily: 'block', webkitTextStroke: '0.1vw black'}}>{lock}</div>
                                </>}
                                <div style={{top: '2.6vw', width: 'inherit', cursor: 'relative', height: '0.5vw', zIndex: '3', position: 'relative', backgroundColor: '#989898'}}/>
                                <div className='spritline2'/>
                                
                                <div style={{top: `${90 * scale + ((scale - 1) * 16)}px`, left: `${-28 * scale + ((scale - 1) * 160)}px`, width: '320px', height: '32px', position: 'relative', transform: `scale(${scale * 0.8})`, background: `url(${sprite.image}) -32px 0px`}}/>
                                <div className='spritname'>{sprite.name}</div>
                            </div>
                        )
                    })}
                </>}
            </div> : null}
        </div>
    </>)
}