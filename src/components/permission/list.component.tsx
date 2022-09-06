import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import{ token} from "../auth/login.component";

export default function List() {

    const [permissions, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });

        await instance.get(`http://user-laravel-project.test/api/permissions`).then(({data}) => {
            console.log(data)
            setProducts(data.data)
        })
    }

    const deleteProduct = async (id: any) => {
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

        await instance.delete(`http://user-laravel-project.test/api/permissions/${id}`).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchProducts()
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
                    <Link className='btn btn-primary mb-2 float-end' to={"/permission/create"}>
                        Add Permission
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
                                    permissions.length > 0 && (
                                        permissions.map((row: { [x: string]: any; }, key) => (
                                            <tr key={key}>
                                                <td>{row.name}</td>
                                                <td>
                                                    <Link to={`/permission/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={() => deleteProduct(row.id)}>
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