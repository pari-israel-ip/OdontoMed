// src/components/EditUsuarioModal.js
import React, { useState, useEffect } from 'react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta

const EditUsuarioModal = ({ usuario, onClose, onSave }) => {
    const [nombres, setNombres] = useState(usuario.nombres);
    const [apellidos, setApellidos] = useState(usuario.apellidos);
    const [ci, setCi] = useState(usuario.ci);
    const [email, setEmail] = useState(usuario.email);
    const [telefono, setTelefono] = useState(usuario.telefono);
    const [fecha_nacimiento, setFechaNacimiento] = useState(usuario.fecha_nacimiento || '');
    const [rol, setRol] = useState('');
    const [direccion, setDireccion] = useState(usuario.direccion);
    const [contrasenia, setContrasenia] = useState(usuario.contrasenia);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRoles();
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUsuario = { 
            ...usuario, 
            nombres, 
            apellidos, 
            ci, 
            email, 
            telefono, 
            fecha_nacimiento, 
            rol, 
            direccion, 
            contrasenia 
        };
        onSave(updatedUsuario);
        onClose();  // Cerrar el modal después de guardar
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Editar Usuario</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombres:</label>
                        <input
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellidos:</label>
                        <input
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>C.I.:</label>
                        <input
                            type="text"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            value={fecha_nacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                    </div>
                    <div>
                    <label>Rol:</label>
                        <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id_rol} value={role.id_rol}>
                                    {role.nombre_rol}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Dirección:</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default EditUsuarioModal;
