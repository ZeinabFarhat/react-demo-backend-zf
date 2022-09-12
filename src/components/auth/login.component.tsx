import React, {useState} from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

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
            navigate("/users")
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
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label className="p-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="p-2">Password</label>
                        <input id="password"
                               type="password"
                               name="password"
                               placeholder="Password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
