import React from 'react'

export default function Block({x, y, sprite, color, size = 1}){
    let scale = window.innerWidth / 1879
    return(<>
        <div style={{top: `${y * scale + ((scale - 1) * 16)}px`, left: `${x * scale + ((scale - 1) * 16)}px`, width: '32px', height: '32px', zIndex: '2' , position: 'absolute', transform: `scale(${scale * size})`, background: `url(${sprite}) -${color * 32 + 32}px`, opacity: `${color == 9 ? '0.5' : '1'}`}}/>
    </>)
}