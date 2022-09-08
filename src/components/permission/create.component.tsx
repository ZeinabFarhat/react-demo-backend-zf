import React, {useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom'

export default function CreatePermission() {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [validationError, setValidationError] = useState({})
    const token = JSON.parse(localStorage.getItem('token') as string);

    async function createProduct(e: { preventDefault: () => void; }) {
        e.preventDefault();

        const formData = new FormData()
        formData.append('name', name)

        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });

        await instance.post(`http://user-laravel-project.test/api/permissions`, formData).then(({data}) => {
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
                            <h4 className="card-title">Add Permission</h4>
                            <hr/>
                            <div className="form-wrapper">
                                {
                                    Object.keys(validationError).length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="alert alert-danger">
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form onSubmit={createProduct}>
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

                                    <Button variant="primary" className="mt-2" size="lg" type="submit">
                                        Save
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