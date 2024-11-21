const ConPermiso = ({ permiso, children }) => {
    const permisos = JSON.parse(localStorage.getItem('permisos')) || [];
    return permisos.includes(permiso) ? children : null;
};

export default ConPermiso;
