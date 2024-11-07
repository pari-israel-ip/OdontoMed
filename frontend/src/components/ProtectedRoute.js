import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    if (!isAuthenticated) {
        console.log("SI SOS");
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        console.log("NO SOoS");
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
