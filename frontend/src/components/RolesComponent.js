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
    AlertDescription,
    Input,
    useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import roleService from '../services/roleService';
import EditRoleModal from './EditRoleModal';
import CreateRoleModal from './CreateRoleModal';
import ProtectedRoute from './ProtectedRoute';

const RolesComponent = () => {
    const [message, setMessage] = useState(null);
    const [roles, setRoles] = useState([]);
    const [filter, setFilter] = useState(''); // Estado para el filtro
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
                setMessage({ type: 'success', text: response.data.message });
                loadRoles();
                toast({
                    title: "Rol eliminado.",
                    description: "El rol ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data.error || 'Error al eliminar el rol' });
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
            setIsEditModalOpen(false);
            loadRoles();
        }
    };

    const handleCreate = async (newRole) => {
        try {
            
        } catch (error) {
            
        } finally {
            setIsCreateModalOpen(false);
            loadRoles();
        }
    };

    // Filtra los roles según el término de búsqueda
    const filteredRoles = roles.filter(role =>
        role.nombre_rol.toLowerCase().includes(filter.toLowerCase())
    );
    const tienePermiso = (permisoRequerido) => {
        const permisos = JSON.parse(localStorage.getItem('permisos')) || [];
        return permisos.includes(permisoRequerido);
    };
    
    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>ROLES</Heading>

            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ERROR:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}
            {tienePermiso('Crear rol') && (
            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>
                    CREAR NUEVO ROL
                </Button>)}
            <Flex mb={4} justify="space-between">
                <Input
                    placeholder="Buscar rol"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    ml={4}
                    marginTop={4}
                />
                
            </Flex>

            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>NOMBRE DEL ROL</Th>
                        <Th>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredRoles.map(role => (
                        <Tr key={role.id_rol}>
                            <Td>{role.nombre_rol}</Td>
                            <Td>
                                <Flex justify="space-between">
                                {tienePermiso('Editar rol') && (
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={() => handleEdit(role)}
                                        mr={2}
                                    />)}
                                {tienePermiso('Eliminar rol') && (
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(role.id_rol)}
                                    />)}
                                    
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
