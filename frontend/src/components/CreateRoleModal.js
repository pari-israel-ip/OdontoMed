// src/components/CreateRoleModal.js
import React, { useState } from 'react';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRole = { nombre_rol, permisos };
        onCreate(newRole);
        onClose();
    };

    return (
        <div className="modal">
                     <div className="modal-content">

         <span className="close" onClick={onClose}>&times;</span>

            <h3>Crear Nuevo Rol</h3>
            <form onSubmit={handleSubmit}>
            <div>
            <label>Nombre del Rol:</label>
                <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={nombre_rol}
                    onChange={(e) => setNombreRol(e.target.value)}
                    required
                />
                 </div>
                 <div>
                        <label>Permisos:</label>
                <textarea
                    placeholder="Permisos"
                    value={permisos}
                    onChange={(e) => setPermisos(e.target.value)}
                    required
                />
                                    </div>

                <button type="submit">Crear Rol</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
        </div>

    );
};

export default CreateRoleModal;
