import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, permisoRequerido }) => {
    const userPermisos = JSON.parse(localStorage.getItem('permisos')) || []; // Obtenemos permisos del localStorage

    // Verificamos si el permiso requerido está en los permisos del usuario
    const tienePermiso = userPermisos.includes(permisoRequerido);

    if (!tienePermiso) {
        console.debug("Permiso denegado: ", permisoRequerido);
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
