import React from 'react'

export default function Block({x, y, sprite, color}){
    let scale = window.innerWidth / 1879
    return(<>
        <div style={{top: `${y * scale + ((scale - 1) * 16)}px`, left: `${x * scale + ((scale - 1) * 16)}px`, width: '32px', height: '32px', zIndex: '2' , position: 'absolute', transform: `scale(${scale})`, background: `url(${sprite}) -${color * 32 + 32}px`}}/>
    </>)
}