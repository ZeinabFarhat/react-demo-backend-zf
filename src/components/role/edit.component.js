import React, { useMemo,useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';
 const [notifications] = useState([])
const Checkbox = ({ obj, onChange }) => {
  return (
    <>
      <input
        type="checkbox"
        id={`custom-checkbox-${obj.index}`}
        name={"notifications[]"}
        value={obj.checked}
        onChange={() => onChange({ ...obj, checked: !obj.checked} ,const target = event.target;
                                                                   var value = target.value;
                                                                   if(target.checked){
                                                                   this.state.notifications[value] = value;
                                                                   }else{
                                                                   this.state.notifications.splice(value, 1);
                                                                   })}
      />
      {obj.name}
    </>
  );
};
export default function EditRole() {
  const [MyCheckBoxList] = useState([])
const [data, setData] = useState(
    MyCheckBoxList.sort((a, b) => a.order - b.order)
  );

    const navigate = useNavigate();

    const {id} = useParams()

  const [permissions, setProducts] = useState([])

    const [name, setName] = useState("")
    const [validationError, setValidationError] = useState({})

    useEffect(()=>{
        fetchRole();
          fetchProducts()
    },[])

      const fetchProducts = async () => {
            await axios.get(`http://user-laravel-project.test/api/permissions`).then(({data}) => {
                console.log(data)
                setProducts(data.data)
            })
        }

    const fetchRole = async () => {
        await axios.get(`http://user-laravel-project.test/api/roles/${id}`).then(({data}) => {
            console.log(data);
            const { name} = data
            setName(name)

        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

ortktperp//.;l,kim
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
        formData.append('notifications', "notifications[]")

        await axios.post(`http://user-laravel-project.test/api/role/monita/${id}`, formData).then(({data}) => {
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



  {permissions.map((obj, index) => (
        <li key={index}>
          <Checkbox className='px-2'
            obj={obj}
            onChange={(item) => {
              setData(permissions.map((d) => (d.order === item.order ? item : d)));
            }}
          />
        </li>
      ))}


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
