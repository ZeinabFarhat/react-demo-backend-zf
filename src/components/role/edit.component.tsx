import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function EditRole() {

    const navigate = useNavigate();
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
    const token = JSON.parse(localStorage.getItem('token') as string);
    const handleChange = (event: { target: { value: any; }; }) => {
        const {
            target: {value},
        } = event;

        const filterdValue = value.filter(
            (item: { id: any; }) => permissions.findIndex((o: any) => o.id === item.id) >= 0
        );

        let duplicatesRemoved = value.filter((item: { id: any; }, itemIndex: any) =>
            value.findIndex((o: { id: any; }, oIndex: any) => o.id === item.id && oIndex !== itemIndex)
        );

        // let duplicateRemoved: any[]  ;
        let duplicateRemoved: any[] = [];
        value.forEach((item: any) => {
            if (duplicateRemoved.findIndex((o: any) => o.id === item.id) >= 0) {
                // @ts-ignore
                duplicateRemoved = duplicateRemoved.filter((x: any) => x.id !== item.id);
            } else {
                duplicateRemoved.push(item);
            }
        });

        // @ts-ignore
        setRolePermissions(duplicateRemoved);
    };

    const {id} = useParams()

    const [permissionsData, setProducts] = useState([])

    const [name, setName] = useState("")
    const [permissions, setRolePermissions] = useState<string[]>([]);
    const [validationError, setValidationError] = useState({})

    useEffect(() => {
        fetchRole();
        fetchProducts();
    }, [])

    const fetchProducts = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });
        await instance.get(`http://user-laravel-project.test/api/permissions/get_all_permissions`).then(({data}) => {
            console.log(data)
            setProducts(data.data)
        })
    }


    const fetchRole = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });
        await instance.get(`http://user-laravel-project.test/api/roles/${id}`).then(({data}) => {

            const {name} = data.data
            const {permissions} = data.data
            setRolePermissions(permissions)
            setName(name)

        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    const updateRole = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)

        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });
        await instance.post(`http://user-laravel-project.test/api/roles/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate(`/roles`)
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

    const updateRolePermissions = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('permissions', JSON.stringify(permissions))

        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + token}
        });
        await instance.post(`http://user-laravel-project.test/api/role/permission/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate(`/roles`)
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
                            <h4 className="card-title">Update Role</h4>
                            <hr/>
                            <div className="form-wrapper">
                                {
                                    Object.keys(validationError).length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="alert alert-danger">
                                                    <ul className="mb-0">
                                                        {Object.entries(validationError).map((key: { [x: string]: any; }, value: any) => (<li>{value}</li>))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form onSubmit={updateRole}>
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
                                    <Button className="mt-2" size="sm" type="submit">
                                        Update
                                    </Button>
                                </Form>

                                <Form onSubmit={updateRolePermissions}>
                                    <Row className='py-3'>
                                        <div className="col-12">
                                            <div className="card card-body">
                                                <Form.Label>Permissions</Form.Label>
                                                <div className="table-responsive">
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        className="w-100"
                                                        multiple
                                                        value={permissions}
                                                        onChange={handleChange}
                                                        input={<OutlinedInput label="Tag"/>}
                                                        renderValue={(selected: any[]) => selected.map((x) => x.name).join(', ')}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {permissionsData.map((variant: any) => (
                                                            <MenuItem key={variant.id} value={variant}>
                                                                <Checkbox
                                                                    checked={
                                                                        permissions.findIndex((item: any) => item.id === variant.id) >= 0
                                                                    }
                                                                />
                                                                <ListItemText primary={variant.name}/>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </div>

                                            </div>
                                        </div>
                                    </Row>
                                    <Button className="mt-2" size="sm" type="submit"> Update Role's Permission </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

