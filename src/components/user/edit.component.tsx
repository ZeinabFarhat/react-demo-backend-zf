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
    const [selectedRoles, setRoles] = useState([])
     const [roles, setAllRoles] = useState([])
    const [validationError, setValidationError] = useState({})
    const [newarray,setarray]=useState([]);

    useEffect(()=>{
        fetchUser();
        fetchRoles();
        console.log(newarray);
    },[newarray])

      const  handleChange = (selectedOption) => {
            setarray(selectedOption)
            console.log("changed")

        }

         const fetchRoles = async () => {

                const API = await axios.get('http://user-laravel-project.test/api/roles')
                const serverResponse = API.data.data
                const dropDownValue = serverResponse.map((response) => ({
                    "value" : response.id,
                    "label" : response.name
                }))

                setAllRoles(dropDownValue)
            }

    const fetchUser = async () => {
        const API = await axios.get(`http://user-laravel-project.test/api/users/${id}`)

          const serverResponse = API.data.data['roles']
                const dropDownValue = serverResponse.map((response) => ({
                    "value" : response.id,
                    "label" : response.name
                }))

                setRoles(dropDownValue)
        const { name,password,email} = API.data.data
        setName(name)
        setPassword(password)
        setEmail(email)
        setRoles(dropDownValue)
    }

    const updateUser = async (e) => {

        e.preventDefault();
        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('roles', JSON.stringify(newarray))

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
                                                                              <Select name={"roles[]"} options={roles} value={selectedRoles}  onChange={handleChange} components={animatedComponents}
                                                                              isMulti/>
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