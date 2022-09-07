import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { Navigate } from 'react-router-dom';
import  {useEffect, useState} from "react";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

import EditUser from "./components/user/edit.component";
import UserList from "./components/user/list.component";
import CreateUser from "./components/user/create.component";

import PermissionList from "./components/permission/list.component";
import CreatePermission from "./components/permission/create.component";
import EditPermission from "./components/permission/edit.component";

import RoleList from "./components/role/list.component";
import CreateRole from "./components/role/create.component";
import EditRole from "./components/role/edit.component";

import Login from "./components/auth/login.component";


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(
        () =>  false
    );

  const setAuth = (value: any) => {
        setIsAuthenticated(value);
        //alert(value);
    };

    useEffect(()=>{
        localStorage.setItem("auth", JSON.stringify(isAuthenticated));
    }, [isAuthenticated]);


    console.log(JSON.parse(localStorage.getItem('auth') as string ));
;
    return (
        <Router>
        <Navbar bg="primary">
            <Container>
                <Link to={"/permissions"} className="navbar-brand text-white">
                   Permissions
                </Link>
                <Link to={"/roles"} className="navbar-brand text-white">
                    Roles
                </Link>
                <Link to={"/"} className="navbar-brand text-white">
                Users
            </Link>
                <Link  to="/login" >LogIn</Link>
            </Container>
    </Navbar>

        <Container className="mt-5">
            <Row>
            <Col md={12}>
                <Routes>
                    <Route  path='/permissions'     element={isAuthenticated
                        ? <PermissionList  />
                        : <Navigate to="/login" replace />}/>
                    <Route path="/permission/create"   element={isAuthenticated
                        ? <CreatePermission  />
                        : <Navigate to="/login" replace />}/>
                    <Route path="/permission/edit/:id"  element={isAuthenticated
                        ? <EditPermission  />
                        : <Navigate to="/login" replace />}/>
                </Routes>
            </Col>
        </Row>
            <Row>
                <Col md={12}>
                    <Routes>
                        <Route  path='/roles'   element={isAuthenticated
                            ? <RoleList  />
                            : <Navigate to="/login" replace />}/>
                        <Route path="/role/create"  element={isAuthenticated
                            ? <CreateRole  />
                            : <Navigate to="/login" replace />}/>
                        <Route path="/role/edit/:id"  element={isAuthenticated
                            ? <EditRole  />
                            : <Navigate to="/login" replace />}/>
                    </Routes>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Routes>
                        <Route path="/user/create"  element={isAuthenticated
                            ? <CreateUser  />
                            : <Navigate to="/login" replace />}/>
                        <Route path="/user/edit/:id" element={isAuthenticated
                            ? <EditUser  />
                            : <Navigate to="/login" replace />}/>
                        <Route  path='/'  element={isAuthenticated
                            ? <UserList  />
                            : <Navigate to="/login" replace />}/>
                    </Routes>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Routes>
                        <Route  path='/login' element={<Login setAuth={setAuth} />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    </Router>);
}

export default App;