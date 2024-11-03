// RolesComponent.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
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
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este rol?");
        if (confirmDelete) {
            try {
                await roleService.deleteRole(id_rol);
                loadRoles();
            } catch (error) {
                console.error('Error deleting role:', error);
            }
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
            loadRoles(); // Recargar los roles después de crear
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

            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Nombre del Rol</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {roles.map(role => (
                        <Tr key={role.id_rol}>
                            <Td>{role.nombre_rol}</Td>
                            <Td>
                                <Flex justify="space-between">
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
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

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
        </Box>
    );
};

export default RolesComponent;
