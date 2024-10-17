import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, List, ListItem, IconButton, Flex } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import roleService from '../services/roleService';
import EditRoleModal from './EditRoleModal';  // Ruta al modal de edición
import CreateRoleModal from './CreateRoleModal';  // Ruta al modal de creación

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
                permisos: updatedRole.permisos,
            });
            loadRoles();  // Recarga de roles después de la actualización
            setIsEditModalOpen(false); // Cierra el modal después de guardar
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleCreate = async (newRole) => {
        try {
            await roleService.createRole(newRole);
            loadRoles();  // Recarga de roles después de la creación
            setIsCreateModalOpen(false); // Cierra el modal después de crear
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Roles</Heading>

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Rol
            </Button>

            <List spacing={3}>
                {roles.map((role) => (
                    <ListItem key={role.id_rol}>
                        <Flex justify="space-between" align="center">
                            {role.nombre_rol}
                            <Box>
                                <IconButton
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleEdit(role)}
                                    mr={2}
                                />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleDelete(role.id_rol)}
                                />
                            </Box>
                        </Flex>
                    </ListItem>
                ))}
            </List>

            {/* Modal de edición */}
            {isEditModalOpen && (
                <EditRoleModal
                    role={currentRole}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Modal de creación */}
            {isCreateModalOpen && (
                <CreateRoleModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </Box>
    );
};

export default RolesComponent;
