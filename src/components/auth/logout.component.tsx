import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

export var token = '';

// @ts-ignore
const LogOut = ({setAuth}) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        navigate("/login")
    };
    return (
        <form onSubmit={logout}>
            <button type="submit">LogOut</button>
        </form>
    )
}

export default LogOut;
