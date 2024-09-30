// src/components/CreateUsuarioModal.js
import React, { useState, useEffect } from 'react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta

const CreateUsuarioModal = ({ onClose, onCreate }) => {
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ci, setCi] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fecha_nacimiento, setFechaNacimiento] = useState('');
    const [rol, setRol] = useState('');
    const [direccion, setDireccion] = useState('');
    const [contrasenia, setContrasenia] = useState('');
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
        const newUsuario = { nombres, apellidos, ci, email, telefono, fecha_nacimiento, rol, direccion, contrasenia };
        onCreate(newUsuario);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Crear Nuevo Usuario</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombres:</label>
                        <input
                            type="text"
                            placeholder="Nombres"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellidos:</label>
                        <input
                            type="text"
                            placeholder="Apellidos"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>C.I.:</label>
                        <input
                            type="text"
                            placeholder="C.I."
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            placeholder="Teléfono"
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
                            placeholder="Dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Crear Usuario</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUsuarioModal;
