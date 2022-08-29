import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';



export default function EditRole() {

 const navigate = useNavigate();
 const [checkedPermissions, setPermissions] = useState({});

  const toggleHandler = (item) => () => {
    setPermissions((state) => ({
      ...state,
      [item.id]: state[item.id]
        ? null
        : {
            id: item.id,
          }
    }));
  };


    const {id} = useParams()

  const [permissionsData, setProducts] = useState([])

    const [name, setName] = useState("")
     const [permissions, setRolePermissions] = useState("")
    const [validationError, setValidationError] = useState({})

    useEffect(()=>{
        fetchRole();
          fetchProducts();

           console.log(checkedPermissions);
    },[checkedPermissions])


      const fetchProducts = async () => {
            await axios.get(`http://user-laravel-project.test/api/permissions`).then(({data}) => {
                console.log(data)
                setProducts(data.data)
            })
        }

          const addPermissions = async (permissions) => {
          console.log('here')
                permissions.map((item) =>
                 setPermissions((state) => ({
                      ...state,
                      [item.id]: state[item.id]
                        = {
                            id: item.id,
                          }
                    }))

)
console.log(checkedPermissions)
                }

    const fetchRole = async () => {
        await axios.get(`http://user-laravel-project.test/api/roles/${id}`).then(({data}) => {

            const { name} = data.data
            const {permissions} = data.data
            console.log(permissions)
            setRolePermissions(permissions)
            setName(name)
            addPermissions(permissions)
            console.log(checkedPermissions)

        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }


    const updateRole = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)

        await axios.post(`http://user-laravel-project.test/api/roles/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate(`/role/edit/${id}`)
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

   const updateRolePermissions = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('_method', 'PUT');
        console.log( JSON.stringify(permissions));
        formData.append('permissions', JSON.stringify(permissions))

        await axios.post(`http://user-laravel-project.test/api/role/permission/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate(`/role/edit/${id}`)
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
                                    <Button variant="primary" className="mt-2" size="sm" block="block" type="submit">
                                                                            Update
                                                                        </Button>
                                                                          </Form>


                                                                           <Form onSubmit={updateRolePermissions}>

                                    <Row className='py-3'>
  <div className="col-12">
                    <div className="card card-body">
                    <Form.Label>Permissions</Form.Label>
                        <div className="table-responsive">



  {permissionsData.map((item) => {
             return (
               <div
                 key={item.id}
                 style={{
                   display: "flex",
                   width: "150px"
                 }}
               >

                 <input

                   onChange={toggleHandler(item)}
                   checked={checkedPermissions[item.id]}
                    value={checkedPermissions[item.id]}
                   style={{ margin: "10px" }}
                   type="checkbox"
                 />
                                <Form.Label>{item.name}</Form.Label>

               </div>
             );
           })}


                           </div>

                           </div>
                            <Button variant="primary" className="mt-2" size="sm" block="block" type="submit">
                                                                                                    Update
                                                                                                </Button>
                           </div>

                                    </Row>
                                    </Form>




                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
