import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export default function EditUser() {
    const navigate = useNavigate();
    const {id} = useParams()
    const animatedComponents = makeAnimated();

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [roles, setRoles] = useState([])
    const [validationError, setValidationError] = useState({})
    const [newarray,setarray]=useState([]);

    useEffect(()=>{
        fetchUser()
    },[])

      const  handleChange = (selectedOption) => {
            setarray(selectedOption)
            console.log(newarray)
        }

    const fetchUser = async () => {
        await axios.get(`http://user-laravel-project.test/api/users/${id}`).then(({data}) => {

            const { name,password,email} = data.data
            setName(name)
            setPassword(password)
            setEmail(email)
            setRoles(data.data.roles)
            console.log(data.data.roles)
        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }


    const updateUser = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        console.log(name)
        formData.append('_method', 'PUT');
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('roles', roles)
        console.log(formData)


        await axios.post(`http://user-laravel-project.test/api/users/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Update User</h4>
                            <hr/>
                            <div className="form-wrapper">
                                {
                                    Object.keys(validationError).length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="alert alert-danger">
                                                    <ul className="mb-0">
                                                        {
                                                            Object.entries(validationError).map(([key, value]) => (
                                                                <li key={key}>{value}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form onSubmit={updateUser}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" value={name} onChange={(event) => {
                                                    setName(event.target.value)
                                                }}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" value={password}  required onChange={(event) => {
                                                    setPassword(event.target.value)
                                                }}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" value={email} onChange={(event) => {
                                                    setEmail(event.target.value)
                                                }}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                 <Row className="my-3">
                                                                      <Col>
                                                                          <Form.Group controlId="Roles">
                                                                              <Form.Label>Roles</Form.Label>
                                                                              <Select name={"roles[]"} options={roles}   onChange={handleChange} components={animatedComponents}  isMulti/>
                                                                          </Form.Group>
                                                                      </Col>
                                                                  </Row>
                                    <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                                        Update
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}