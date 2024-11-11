import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente de ruta protegida
const ProtectedRoute = ({ children, roles }) => {
    const userRole = localStorage.getItem('role'); // Obtén el rol almacenado del usuario

    if (!roles.includes(userRole)) {
        console.debug("no login")
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
