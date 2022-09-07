import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';


export default function EditPermission() {
    const navigate = useNavigate();
    const {id} = useParams()
    const token =  JSON.parse(localStorage.getItem('token') as string );
    const [name, setName] = useState("")
    const [validationError, setValidationError] = useState({})

    useEffect(() => {
        fetchPermission()
    }, [])
    const fetchPermission = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });
        await instance.get(`http://user-laravel-project.test/api/permissions/${id}`).then(({data}) => {
            const {name} = data
            setName(name)
        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }


    const updatePermission = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)

        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });

        await instance.post(`http://user-laravel-project.test/api/permissions/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/permissions")
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
                            <h4 className="card-title">Update Permission</h4>
                            <hr/>
                            <div className="form-wrapper">
                                {
                                    Object.keys(validationError).length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="alert alert-danger">
                                                    <ul className="mb-0">
                                                        {
                                                            // Object.entries(validationError).map(([key, value]) => (
                                                            //     <li key={key}>+{value}</li>
                                                            // ))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form onSubmit={updatePermission}>
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


                                    <Button variant="primary" className="mt-2" size="lg"  type="submit">
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