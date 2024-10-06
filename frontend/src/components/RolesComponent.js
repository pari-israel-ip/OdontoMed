import React, { useEffect, useState } from 'react';
import roleService from '../services/roleService';
import EditRoleModal from './EditRoleModal';
import CreateRoleModal from './CreateRoleModal';  // Asegúrate de que la ruta sea correcta

const RolesComponent = () => {
    const [roles, setRoles] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const response = await roleService.getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleDelete = async (id_rol) => {
        try {
            await roleService.deleteRole(id_rol);
            loadRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const handleEdit = (role) => {
        setCurrentRole(role);
        setIsEditModalOpen(true);
    };

    const handleSave = async (updatedRole) => {
        try {
            await roleService.updateRole(updatedRole.id_rol, {
                nombre_rol: updatedRole.nombre_rol,
                permisos: updatedRole.permisos
            });
            loadRoles();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleCreate = async (newRole) => {
        try {
            await roleService.createRole(newRole);  // Asegúrate de tener esta función en roleService
            loadRoles();
        } catch (error) {
            console.error('Error creating role:', error);
        } finally{
            loadRoles();
        }
    };

    return (
        <div>
            <h2>Roles</h2>
            <button onClick={() => setIsCreateModalOpen(true)}>Crear Nuevo Rol</button>
            <ul>
                {roles.map(role => (
                    <li key={role.id_rol}>
                        {role.nombre_rol}
                        <button onClick={() => handleEdit(role)}>Edit</button>
                        <button onClick={() => handleDelete(role.id_rol)}>Delete</button>
                    </li>
                ))}
            </ul>

            {isEditModalOpen && (
                <EditRoleModal
                    role={currentRole}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {isCreateModalOpen && (
                <CreateRoleModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default RolesComponent;
