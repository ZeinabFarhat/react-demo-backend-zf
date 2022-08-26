import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

import EditUser from "./components/user/edit.component.js";
import UserList from "./components/user/list.component";
import CreateUser from "./components/user/create.component";

import PermissionList from "./components/permission/list.component";
import CreatePermission from "./components/permission/create.component";
import EditPermission from "./components/permission/edit.component";

import RoleList from "./components/role/list.component";
import CreateRole from "./components/role/create.component";
import EditRole from "./components/role/edit.component";


function App() {
    return (<Router>
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
            </Container>
    </Navbar>

        <Container className="mt-5">
            <Row>
            <Col md={12}>
                <Routes>
                    <Route exact path='/permissions' element={<PermissionList />} />
                    <Route path="/permission/create" element={<CreatePermission />} />
                    <Route path="/permission/edit/:id" element={<EditPermission />} />
                </Routes>
            </Col>
        </Row>
            <Row>
                <Col md={12}>
                    <Routes>
                        <Route exact path='/roles' element={<RoleList />} />
                        <Route path="/role/create" element={<CreateRole/>} />
                        <Route path="/role/edit/:id" element={<EditRole />} />
                    </Routes>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Routes>
                        <Route path="/user/create" element={<CreateUser />} />
                        <Route path="/user/edit/:id" element={<EditUser />} />
                        <Route exact path='/' element={<UserList />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    </Router>);
}

export default App;