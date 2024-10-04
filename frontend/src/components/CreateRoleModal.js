import React, { useState } from 'react';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState({});  // Objeto para almacenar los permisos por módulo
    const [selectAll, setSelectAll] = useState({});  // Estado para manejar la opción "Seleccionar Todos"

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
                { id: 5, label: 'Crear costo' },
                { id: 6, label: 'Editar costo' },
                { id: 7, label: 'Mostrar costo' },
                { id: 8, label: 'Eliminar costo' }
            ]
        }
    ];

    // Manejar los cambios en los permisos (checkboxes)
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

    // Manejar el cambio de "Seleccionar Todos"
    const handleSelectAllChange = (modulo, checked) => {
        setSelectAll((prevState) => ({
            ...prevState,
            [modulo]: checked
        }));

        if (checked) {
            // Seleccionar todos los permisos del módulo
            const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
            setPermisos(prevState => ({
                ...prevState,
                [modulo]: allPermisos
            }));
        } else {
            // Deseleccionar todos los permisos del módulo
            setPermisos(prevState => ({
                ...prevState,
                [modulo]: []
            }));
        }
    };

    // Verificar si todos los permisos de un módulo están seleccionados
    const isAllSelected = (modulo) => {
        const permisosModulo = permisos[modulo] || [];
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
        return allPermisos.length === permisosModulo.length;  // Retorna true si todos los permisos están seleccionados
    };

    // Enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Convertir el objeto de permisos a una cadena separada por comas
        const permisosCombinados = Object.values(permisos).flat().join(',');

        const newRole = { 
            nombre_rol, 
            permisos: permisosCombinados  // Guardar todos los permisos combinados en una cadena
        };

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
                        />
                    </div>

                    {/* Renderizar cada módulo con su conjunto de permisos */}
                    {modulos.map((modulo) => (
                        <details key={modulo.nombre}>
                            <summary><label>{modulo.nombre}:</label></summary>
                            
                            <div>
                                {/* Opción para seleccionar todos los permisos de este módulo */}
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected(modulo.nombre)}  // Verificar si todos están seleccionados
                                        onChange={(e) => handleSelectAllChange(modulo.nombre, e.target.checked)}
                                    />
                                    <label>Seleccionar todos</label>
                                </div>

                                {modulo.permisosOpciones.map((permiso) => (
                                    <div key={permiso.id}>
                                        <input
                                            type="checkbox"
                                            value={permiso.id}
                                            checked={(permisos[modulo.nombre] || []).includes(permiso.id)}  // Verificar si el permiso está seleccionado
                                            onChange={(e) => handlePermisoChange(modulo.nombre, permiso.id, e.target.checked)}
                                        />
                                        <label>{permiso.label}</label>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}

                    <button type="submit">Crear Rol</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;
