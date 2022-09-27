import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom'
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Select from '@mui/material/Select';


export default function CreateProduct() {

    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('token') as string);
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [roles, setRoles] = useState([])
    const [validationError, setValidationError] = useState({})
    const [userRoles, setUserRoles] = useState([])

    // type User = {
    //     first_name: string;
    //     last_name: string;
    //     password: string;
    //     email: string;
    //     roles: any[]
    // }
    //
    // let user: User = {
    //     first_name: '',
    //     last_name: null,
    //     password: null,
    //     email: null,
    //     roles: null
    // };

    // const {setUser, getUser}= createUser<User>();

    useEffect(() => {
        fetchRoles();
    }, [])

    const fetchRoles = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });

        const API = await instance.get('http://user-laravel-project.test/api/roles/get_all_roles').then(({data}) => {

            const roles = data.data
            setRoles(roles)

        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors)
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                })
                navigate("/login")
            }
        })

    }

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
                duplicateRemoved = duplicateRemoved.filter((x: any) => x.id !== item.id);
            } else {
                duplicateRemoved.push(item);
            }
        });

        setUserRoles(duplicateRemoved);
    };

    const createUser = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('first_name', user.first_name)
        formData.append('last_name', last_name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('roles', JSON.stringify(userRoles))

        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });
        await instance.post(`http://user-laravel-project.test/api/users`, formData).then(({data}) => {
            Swal.fire({
                icon: "success", text: data.message
            })
            navigate("/users")
        }).catch(({response}) => {
            Swal.fire({
                text: response.data.message, icon: "error"
            })
        })
    }

    return <div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Add User</h4>
                        <hr/>
                        <div className="form-wrapper">
                            {Object.keys(validationError).length > 0 && <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-danger">
                                        <ul className="mb-0">
                                            {Object.entries(validationError).map((key: { [x: string]: any; }, value: any) => (
                                                <li>{value}</li>))}
                                        </ul>
                                    </div>
                                </div>
                            </div>}
                            <Form onSubmit={createUser}>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="First Name">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" value={first_name} onChange={(event) => {
                                                setFirstName(event.target.value)
                                            }}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="Last Name">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" value={last_name} onChange={(event) => {
                                                setLastName(event.target.value)
                                            }}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="Password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" value={password} required
                                                          onChange={(event) => {
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
                                                <Select className="w-100" labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox" multiple value={userRoles}
                                                        onChange={handleChange}
                                                        input={<OutlinedInput label="Tag"/>}
                                                        renderValue={(selected: any[]) => selected.map((x) => x.name).join(', ')}
                                                        MenuProps={MenuProps}>
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
                                    Save
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}