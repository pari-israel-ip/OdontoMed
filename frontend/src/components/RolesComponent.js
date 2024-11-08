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
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import roleService from '../services/roleService';
import EditRoleModal from './EditRoleModal';
import CreateRoleModal from './CreateRoleModal';

const RolesComponent = () => {
    const [message, setMessage] = useState(null); // Estado para el mensaje de respuesta
    const [roles, setRoles] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const toast = useToast();

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
                const response = await roleService.deleteRole(id_rol);
                setMessage({ type: 'success', text: response.data.message }); // Muestra el mensaje de éxito
                loadRoles();
                toast({
                    title: "Rol eliminado.",
                    description: "El rol ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data.error || 'Error al eliminar el odontólogo' });
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
        } catch (error) {
            console.error('Error creating role:', error);
        }
        finally{
            loadRoles(); // Recargar los roles después de crear
        }
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Roles</Heading>

            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ERROR:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}


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
                    onClose={() => {setIsCreateModalOpen(false);
                        loadRoles();
                    }}
                    onCreate={()=>handleCreate}
                />
            )}
        </Box>
    );
};

export default RolesComponent;
