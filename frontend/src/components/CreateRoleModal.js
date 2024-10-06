import React, { useState } from 'react';
import axios from 'axios';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState({});
    const [selectAll, setSelectAll] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Opciones de módulos y permisos para cada uno
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

    // Manejar cambios en los permisos (checkboxes)
    const handlePermisoChange = (modulo, permisoId, checked) => {
        setPermisos(prevState => {
            const permisosModulo = prevState[modulo] || [];
            if (checked) {
                // Añadir el permiso seleccionado
                return {
                    ...prevState,
                    [modulo]: [...permisosModulo, permisoId]
                };
            } else {
                // Eliminar el permiso desmarcado
                return {
                    ...prevState,
                    [modulo]: permisosModulo.filter(id => id !== permisoId)
                };
            }
        });
    };

    // Manejar la opción de "Seleccionar Todos"
    const handleSelectAllChange = (modulo, checked) => {
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
        setPermisos(prevState => ({
            ...prevState,
            [modulo]: checked ? allPermisos : []
        }));
        setSelectAll(prevState => ({
            ...prevState,
            [modulo]: checked
        }));
    };

    // Verificar si todos los permisos de un módulo están seleccionados
    const isAllSelected = (modulo) => {
        const permisosModulo = permisos[modulo] || [];
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
        return permisosModulo.length === allPermisos.length;
    };

    // Manejar el cambio en el nombre del rol
    const handleNombreRolChange = (e) => {
        setNombreRol(e.target.value);
        setErrors(prevErrors => ({ ...prevErrors, nombre_rol: undefined })); // Reiniciar error
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Reiniciar los errores al enviar el formulario
        setErrors({});

        // Validaciones frontend
        const frontendErrors = {};
        if (!nombre_rol.trim()) {
            frontendErrors.nombre_rol = 'El nombre del rol es obligatorio.';
        }

        const permisosCombinados = Object.values(permisos).flat().join(',');
        if (!permisosCombinados) {
            frontendErrors.permisos = 'Debe seleccionar al menos un permiso.';
        }

        // Si hay errores, no continuar
        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        // Evitar múltiples solicitudes
        setLoading(true);

        // Crear el nuevo rol
        const newRole = {
            nombre_rol,
            permisos: permisosCombinados,
        };

        try {
            // Llamada al backend
            const response = await axios.post('http://127.0.0.1:8000/odomed/roles/create/', newRole);
            
            // Si la respuesta contiene errores
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onCreate(response.data);  // Actualizar el estado de los roles en el componente padre
                onClose();  // Cerrar el modal
            }
        } catch (error) {
            // Manejo de errores
            const errorMessage = error.response?.data.errors || { general: 'Error al crear el rol. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false);  // Finalizar carga
        }
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
                            onChange={handleNombreRolChange}  // Uso de la función modificada
                        />
                        {errors.nombre_rol && <p className="error">{errors.nombre_rol}</p>}
                    </div>

                    {/* Renderizar cada módulo con su conjunto de permisos */}
                    {modulos.map(modulo => (
                        <details key={modulo.nombre}>
                            <summary><label>{modulo.nombre}:</label></summary>
                            <div>
                                {/* Opción para seleccionar todos los permisos de este módulo */}
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
                                            checked={(permisos[modulo.nombre] || []).includes(permiso.id)}
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
                        {loading ? 'Creando...' : 'Crear Rol'}
                    </button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;
