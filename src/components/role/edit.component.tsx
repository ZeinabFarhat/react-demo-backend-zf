import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import{ token} from "../auth/login.component";

export default function EditRole() {

 const navigate = useNavigate();
 const [checkedPermissions, setPermissions] = useState({});

  const toggleHandler = (item: { [p: string]: any }) => () => {

      setPermissions((state:[]) => ({
      ...state,
      [item.id]: state[item.id]
        ? null
        : {
            id: item.id,
          }
    }));
  };


  const HandleChange = (event: { target: { value: any; }; }) => {
    const {
      target: { value },
    } = event;



    const filterdValue = value.filter(
      (item: { id: any[]; }) => permissions.findIndex((o:any) => o.id === item.id) >= 0
    );

    let duplicatesRemoved = value.filter((item: { id: any; }, itemIndex: any) =>
      value.findIndex((o: { id: any; }, oIndex: any) => o.id === item.id && oIndex !== itemIndex)
    );

      let [duplicateRemoved] =useState<string[]>([]);
      // let duplicateRemoved = [];

    value.forEach((item:any) => {
      if (duplicateRemoved.findIndex((o:any) => o.id === item.id) >= 0) {
        duplicateRemoved = duplicateRemoved.filter((x:any) => x.id === item.id);
      } else {
        duplicateRemoved.push(item);
      }
    });

    setRolePermissions(duplicateRemoved);
  };

    const {id} = useParams()

  const [permissionsData, setProducts] = useState([])

    const [name, setName] = useState("")
     const [permissions, setRolePermissions] = useState<string[]>([]);
    const [validationError, setValidationError] = useState({})

    useEffect(()=>{
        fetchRole();
        fetchProducts();
    },[checkedPermissions])

      const fetchProducts = async () => {
          const instance = axios.create({
              headers: {'Authorization': 'Bearer '+ token}
          });
            await instance.get(`http://user-laravel-project.test/api/permissions`).then(({data}) => {
                console.log(data)
                setProducts(data.data)
            })
        }

          const addPermissions = async (permissions: any[]) => {
                permissions.map((item) =>
                 setPermissions((state:any) => ({
                      ...state,
                      [item.id]: state[item.id]
                        = {
                            id: item.id,
                          }
                    })))  }


    const fetchRole = async () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });
        await instance.get(`http://user-laravel-project.test/api/roles/${id}`).then(({data}) => {

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


    const updateRole = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('_method', 'PUT');
        formData.append('name', name)

        const instance = axios.create({
            headers: {'Authorization': 'Bearer '+ token}
        });
        await instance.post(`http://user-laravel-project.test/api/roles/${id}`, formData).then(({data}) => {
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

   const updateRolePermissions = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = new FormData()

        formData.append('_method', 'PUT');
        console.log( JSON.stringify(permissions));
        formData.append('permissions', JSON.stringify(permissions))

       const instance = axios.create({
           headers: {'Authorization': 'Bearer '+ token}
       });
        await instance.post(`http://user-laravel-project.test/api/role/permission/${id}`, formData).then(({data}) => {
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
                                                        {Object.entries(validationError).map((key:{ [x: string]: any; }, value : any) => (<li>{value}</li>))}
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
                                    <Button className="mt-2" size="sm"  type="submit">
                                                                            Update
                                                                        </Button>
                                </Form>

                                <Form onSubmit={updateRolePermissions}>
                                    <Row className='py-3'>
                                    <div className="col-12">
                                    <div className="card card-body">
                                    <Form.Label>Permissions</Form.Label>
                                    <div className="table-responsive">
                                    {permissionsData.map((item: { [x: string]: any; }) => {

                                        return (
                                                  <div
                                                     key={item.id}
                                                     style={{
                                                     display: "flex",
                                                      width: "150px"
                                               }} >

                                  {/*<input onChange={toggleHandler(item)} checked={checkedPermissions[item.id]}  value={checkedPermissions[item.id]} style={{ margin: "10px" }}   type="checkbox" />*/}
                                  <Form.Label>{item.name}</Form.Label>

                                  </div>
                                  ); })}
                                  </div>
                                  </div>
                                 <Button className="mt-2" size="sm"  type="submit"> Update </Button>
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
