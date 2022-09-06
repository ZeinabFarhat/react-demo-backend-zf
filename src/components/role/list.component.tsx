import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import{ token} from "../auth/login.component";

export default function List() {

    const [roles, setRoles] = useState([])

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });
        await instance.get(`http://user-laravel-project.test/api/roles`).then(({data}) => {
            setRoles(data.data)
        })
    }

    const deleteRole = async (id: any) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed
        });

        if (!isConfirm) {
            return;
        }

        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });

        await instance.delete(`http://user-laravel-project.test/api/roles/${id}`).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchRoles()
        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    return (
        <div className="container">
            <div className="row">
                <div className='col-12'>
                    <Link className='btn btn-primary mb-2 float-end' to={"/role/create"}>
                        Add Role
                    </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    roles.length > 0 && (
                                        roles.map((row :  { [x: string]: any; }, key) => (
                                            <tr key={key}>
                                                <td>{row.name}</td>
                                                <td>
                                                    <Link to={`/role/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={() => deleteRole(row.id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}