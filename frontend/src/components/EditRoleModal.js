// src/components/EditRoleModal.js
import React, { useState } from 'react';

const EditRoleModal = ({ role, onClose, onSave }) => {
    const [nombre_rol, setNombreRol] = useState(role.nombre_rol);
    const [permisos, setPermisos] = useState(role.permisos);  // Asumiendo que permisos es un string

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...role, nombre_rol, permisos });
        onClose();  // Cerrar el modal después de guardar
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Editar Rol</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre del Rol:</label>
                        <input
                            type="text"
                            value={nombre_rol}
                            onChange={(e) => setNombreRol(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Permisos:</label>
                        <textarea
                            type="text"
                            value={permisos}
                            onChange={(e) => setPermisos(e.target.value)}
                        />
                    </div>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>

                </form>
            </div>
        </div>
    );
};

export default EditRoleModal;
