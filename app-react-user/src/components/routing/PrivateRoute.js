import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
    console.log(isAuthenticated);
    return isAuthenticated ? <Outlet/> : <Navigate to='/auth/login'/>;
}

export default PrivateRoute;