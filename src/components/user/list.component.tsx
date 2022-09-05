import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'


export default function List() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        await axios.get(`http://user-laravel-project.test/api/users`).then(({data}) => {
            setUsers(data.data);
        })
    }

    const deleteUser = async (id: any) => {
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

        await axios.delete(`http://user-laravel-project.test/api/users/${id}`).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchUsers()
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
                    <Link className='btn btn-primary mb-2 float-end' to={"/user/create"}>
                        Add User
                    </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Roles</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    users.length > 0 && (
                                        users.map((row: { [x: string]: any; }, key) => (

                                            <tr key={key}>
                                                <td>{row['name']}</td>
                                                <td>{row['email']}</td>
                                                <td>{row['roles'].map((row: { [x: string]: any; }, key: any)=>(
                                                        row['name']
                                                    ))}
                                                </td>

                                                <td>
                                                    <Link to={`/user/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={() => {
                                                        return deleteUser(row.id);
                                                    }}>
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