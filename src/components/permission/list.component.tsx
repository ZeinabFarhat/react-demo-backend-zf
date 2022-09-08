import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from 'react-js-pagination';



export default function List() {

    const [permissions, setProducts] = useState([])
    const token =  JSON.parse(localStorage.getItem('token') as string );
    const [curent_page, setCurrentPage] = useState("")
    const [per_page, setPerPage] = useState("")
    const [total, setTotal] = useState("")

    useEffect(() => {
        fetchPermissions();
    }, [])

    const fetchPermissions = async (pageNumber = 1) => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });

        await instance.get(`http://user-laravel-project.test/api/permissions?page=`+ pageNumber).then(({data}) => {
            setProducts(data.data);
            setTotal(data.meta.total);
            setCurrentPage(data.meta.current_page);
            setPerPage(data.meta.per_page);
        })
    }

    const deletePermission = async (id: any) => {
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
            fetchPermissions()
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

                                {permissions.map((permission: {
                                    id: any;
                                    roles: any;
                                    email: any;
                                    name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined)=>{
                                    return <>
                                        <tr>
                                            <td>{permission.name}</td>
                                            <td>
                                                <Link to={`/permission/edit/${permission.id}`} className='btn btn-success me-2'>
                                                    Edit
                                                </Link>
                                                <Button variant="danger" onClick={() => deletePermission(permission.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    </>
                                })}


                                </tbody>
                            </table>
                                    <div className="mt-3">
                                    <Pagination
                                    totalItemsCount={total}
                                    activePage={curent_page}
                                    itemsCountPerPage={per_page}
                                    itemClass="page-item"
                                    linkClass ="page-link"
                                    firstPageText="First"
                                    lastPageText="Last"
                                    onChange={(pageNumber: number | undefined)=>fetchPermissions(pageNumber)}/>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}