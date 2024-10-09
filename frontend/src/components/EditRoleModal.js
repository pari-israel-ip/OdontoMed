import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditRoleModal = ({ role, onClose, onSave }) => {
    const [nombre_rol, setNombreRol] = useState(role.nombre_rol.toUpperCase());
    const [permisos, setPermisos] = useState(role.permisos.split(',').map(p => p.trim()));  // Convertir a lista de IDs
    const [selectAll, setSelectAll] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const modulos = [
        {
            nombre: 'Usuarios',
            permisosOpciones: [
                { id: 1, label: 'Crear usuario' },
                { id: 2, label: 'Editar usuario' },
                { id: 3, label: 'Mostrar usuario' },
                { id: 4, label: 'Eliminar usuario' }
            ]
        },
        {
            nombre: 'Costos',
            permisosOpciones: [
                { id: 5, label: 'Crear costo' },
                { id: 6, label: 'Editar costo' },
                { id: 7, label: 'Mostrar costo' },
                { id: 8, label: 'Eliminar costo' }
            ]
        },
        {
            nombre: 'Tratamientos',
            permisosOpciones: [
                { id: 9, label: 'Crear tratamiento' },
                { id: 10, label: 'Editar tratamiento' },
                { id: 11, label: 'Mostrar tratamiento' },
                { id: 12, label: 'Eliminar tratamiento' }
            ]
        }
    ];

    const handlePermisoChange = (modulo, permisoId, checked) => {
        setPermisos(prevState => {
            // Si el permiso está marcado y se selecciona, añadirlo; de lo contrario, eliminarlo
            if (checked) {
                return [...new Set([...prevState, permisoId.toString()])];  // Asegurarse de que sea único
            } else {
                return prevState.filter(id => id !== permisoId.toString());
            }
        });
    };

    const handleSelectAllChange = (modulo, checked) => {
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id.toString());
        setPermisos(prevState => checked ? [...new Set([...prevState, ...allPermisos])] : prevState.filter(id => !allPermisos.includes(id)));
        setSelectAll(prevState => ({
            ...prevState,
            [modulo]: checked
        }));
    };

    const isAllSelected = (modulo) => {
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id.toString());
        return allPermisos.every(permiso => permisos.includes(permiso));
    };

    const handleNombreRolChange = (e) => {
        setNombreRol(e.target.value.toUpperCase());
        setErrors(prevErrors => ({ ...prevErrors, nombre_rol: undefined }));
    };

    const validateNombreRol = (nombre) => {
        const nombreRolRegex = /^[A-Z\s]{4,50}$/;
        return nombreRolRegex.test(nombre);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setErrors({});
        const frontendErrors = {};

        if (!nombre_rol.trim()) {
            frontendErrors.nombre_rol = 'El nombre del rol es obligatorio.';
        } else if (!validateNombreRol(nombre_rol)) {
            frontendErrors.nombre_rol = 'El nombre del rol debe tener entre 4 y 50 caracteres, solo letras y espacios.';
        }

        if (!permisos.length) {
            frontendErrors.permisos = 'Debe seleccionar al menos un permiso.';
        }

        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        setLoading(true);

        const updatedRole = {
            ...role,
            nombre_rol,
            permisos: permisos.join(',')
        };

        try {
            const response = await axios.put(`http://127.0.0.1:8000/odomed/roles/${role.id_rol}/`, updatedRole);

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onSave(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al actualizar el rol. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false);
        }
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
                            onChange={handleNombreRolChange}
                        />
                        {errors.nombre_rol && <p className="error">{errors.nombre_rol}</p>}
                    </div>

                    {modulos.map(modulo => (
                        <details key={modulo.nombre}>
                            <summary><label>{modulo.nombre}:</label></summary>
                            <div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected(modulo.nombre)}
                                        onChange={(e) => handleSelectAllChange(modulo.nombre, e.target.checked)}
                                    />
                                    <label>Seleccionar todos</label>
                                </div>

                                {modulo.permisosOpciones.map(permiso => (
                                    <div key={permiso.id}>
                                        <input
                                            type="checkbox"
                                            checked={permisos.includes(permiso.id.toString())}
                                            onChange={(e) => handlePermisoChange(modulo.nombre, permiso.id, e.target.checked)}
                                        />
                                        <label>{permiso.label}</label>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}

                    {errors.permisos && <p className="error">{errors.permisos}</p>}
                    {errors.general && <p className="error">{errors.general}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default EditRoleModal;
