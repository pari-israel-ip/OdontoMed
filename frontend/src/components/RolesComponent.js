import React, { useEffect, useState } from 'react';
import { Button, Heading, List, ListItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import roleService from '../services/roleService';
import EditRoleModal from './EditRoleModal';
import CreateRoleModal from './CreateRoleModal';

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
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            loadRoles();
        }
    };

    const handleCreate = async (newRole) => {
        try {
            await roleService.createRole(newRole);
        } catch (error) {
            console.error('Error creating role:', error);
        } finally {
            loadRoles();
        }
    };

    return (
        <div>
            <Heading as="h2" size="lg" mb={4}>Roles</Heading>
            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>Crear Nuevo Rol</Button>
            <List spacing={3} mt={4}>
                {roles.map(role => (
                    <ListItem key={role.id_rol} display="flex" justifyContent="space-between" alignItems="center">
                        {role.nombre_rol}
                        <div>
                            <Button size="sm" colorScheme="blue" onClick={() => handleEdit(role)}>Edit</Button>
                            <Button size="sm" colorScheme="red" onClick={() => handleDelete(role.id_rol)}>Delete</Button>
                        </div>
                    </ListItem>
                ))}
            </List>

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
