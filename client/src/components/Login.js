import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import './Login.css'

export default function Login({updateUser}){
    const [click, setClick] = useState(false)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState(null)

    const history = useHistory()

    useEffect(() => {
        fetch('/users')
        .then(r => r.json())
        .then(users => setUsers(users))
    }, [])

    const handleClick = () => setClick(!click)

    const setUser = name => {
        fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"                    
            },
            body: JSON.stringify({name: name})
        })
        .then(r => r.json())
        .then(user => {
            updateUser(user)
            history.push('/games')
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        
        let user = {
          name: e.target.name.value.toLowerCase(),
          password: e.target.password.value
        }
    
        if (click && user.name != '' && user.password != ''){
            if (user.password == e.target.confirm.value){
                let work = true
                users.forEach(login => {
                if (login.name == user.name) {
                    work = false
                    setError("Username Already Taken!")
                }
                })
                if (work){
                    fetch('/users', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({name: user.name, password: user.password}),
                    })
                    .then(setUser(user.name))
                }
            }else setError("Passwords Do Not Match!")
        }else if(!click && user.name != '' && user.password != ''){
            let found = false
            users.forEach(login => {
                if (user.name == login.name && user.password == login.password){
                    found = true
                    setUser(user.name)
                }
            })
            if (!found) setError("Username/Password Invalid.")
        }else setError("Please Enter Information")
    }
    return(<>
    <div className='backlogin'>
        <form className='form' onSubmit={handleSubmit}>
            <p className='title'>{click ? 'Signup' : 'Login'}</p>
            <p className='txt'>Username</p>
            <input type="text" name="name" placeholder="Username..."/>
            <p className='txt'>Password</p>
            <input type="password" name="password" placeholder="Password..."/>
            {click ? <input type="password" name="confirm" placeholder="Confirm Password..."/> : null}
            <button type="submit"> {click ? "Sign up" : "Login"}</button> 
            <button onClick={handleClick}>{(click ? `Already` : `Don't`) + ` have an account?`}</button>
            {error ? <h3 className="error">{error}</h3>: null}
        </form> 
    </div>
    </>)
}