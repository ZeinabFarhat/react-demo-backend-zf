import React, {useState} from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom'


export var token = '';

// @ts-ignore
const Login = ({setAuth, setToken}) => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [validationError, setValidationError] = useState({});
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        await axios.post(`http://user-laravel-project.test/api/auth/login`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })

            token = data.token;
            setAuth(true);
            setToken(token);
            navigate("/")
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors)
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                })
            }
        })
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
