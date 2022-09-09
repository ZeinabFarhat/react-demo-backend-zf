import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Select from '@mui/material/Select';

export default function EditUser() {
    const navigate = useNavigate();
    const {id} = useParams()
    const token = JSON.parse(localStorage.getItem('token') as string);
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [roles, setRoles] = useState([])
    const [validationError, setValidationError] = useState({})
    const [userRoles, setUserRoles] = useState([])
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    useEffect(() => {
        fetchUser();
        fetchRoles();

    }, [])

    let handleChange = (event: any) => {
        const {
            target: {value},
        } = event;

        const filterdValue = value.filter(
            (item: { id: any; }) => userRoles.findIndex((o: any) => o.id === item.id) >= 0
        );

        let duplicatesRemoved = value.filter((item: { id: any; }, itemIndex: any) =>
            value.findIndex((o: { id: any; }, oIndex: any) => o.id === item.id && oIndex !== itemIndex)
        );

        let duplicateRemoved: any[] = [];

        value.forEach((item: any) => {
            if (duplicateRemoved.findIndex((o: any) => o.id === item.id) >= 0) {
                // @ts-ignore
                duplicateRemoved = duplicateRemoved.filter((x) => x.id !== item.id);

            } else {
                duplicateRemoved.push(item);
            }
        });

        // @ts-ignore
        setUserRoles(duplicateRemoved);
    };

    const fetchRoles = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });

        const API = await instance.get('http://user-laravel-project.test/api/roles/get_all_roles')
        const roles = API.data.data

        setRoles(roles)
    }

    const fetchUser = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });

        const API = await instance.get(`http://user-laravel-project.test/api/users/${id}`)
        const serverResponse = API.data.data['roles']
        const {name, password, email} = API.data.data

        setUserRoles(serverResponse)
        setName(name)
        setPassword(password)
        setEmail(email)
    }

    const updateUser = async (e: { preventDefault: () => void; }) => {

        e.preventDefault();
        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('roles', JSON.stringify(userRoles))

        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });

        await instance.post(`http://user-laravel-project.test/api/users/${id}`, formData).then(({data}) => {
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
                                                        <ul className="mb-0">
                                                            {Object.entries(validationError).map((key: { [x: string]: any; }, value: any) => (<li>{value}</li>))}
                                                        </ul>
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
                                                <Form.Control type="password" value={password} required onChange={(event) => {
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
                                                <div className="table-responsive">
                                                    <Select className="w-100" labelId="demo-multiple-checkbox-label" id="demo-multiple-checkbox" multiple value={userRoles} onChange={handleChange}
                                                            input={<OutlinedInput label="Tag"/>} renderValue={(selected: any[]) => selected.map((x) => x.name).join(', ')} MenuProps={MenuProps}>
                                                        {roles.map((variant: any) => (
                                                            <MenuItem key={variant.id} value={variant}>
                                                                <Checkbox
                                                                    checked={
                                                                        userRoles.findIndex((item: any) => item.id === variant.id) >= 0
                                                                    }
                                                                />
                                                                <ListItemText primary={variant.name}/>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" className="mt-2" size="lg" type="submit">
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