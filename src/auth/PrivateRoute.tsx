import React from "react";
import { IndexRouteProps, LayoutRouteProps, PathRouteProps, Navigate, Route} from "react-router-dom";

const PrivateRoute = (props: JSX.IntrinsicAttributes & (PathRouteProps | LayoutRouteProps | IndexRouteProps)) => {
    const token = localStorage.getItem("auth");
    return <>{token ? <Route {...props} /> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;