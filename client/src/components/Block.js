import React from 'react'

export default function Block({x, y, sprite, color}){
    return(<>
        <div style={{top: `${y}px`, left: `${x}px`, width: '32px', height: '32px', 'z-index': '2' , position: 'absolute', transform: 'scale(1)', background: `url(${sprite}) -${color * 32 + 32}px`}}/>
    </>)
}