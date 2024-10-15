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
import { EditIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import usuarioService from '../services/usuarioService';  // Asegúrate de que la ruta sea correcta
import ShowUsuarioModal from './ShowUsuarioModal';  // Ruta al modal que mostrarás
import CreateUsuarioModal from './CreateUsuarioModal';  // Ruta al modal de creación

const UsuariosComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false); // Para el modal de detalles

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            const response = await usuarioService.getUsuarios();
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    };

    const handleDelete = async (id_usuario) => {
        // Confirmar si el usuario realmente quiere eliminar el usuario
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Paciente?");
        
        if (confirmDelete) {
            try {
                await usuarioService.deleteUsuario(id_usuario);
                loadUsuarios();
            } catch (error) {
                console.error('Error deleting usuario:', error);
            }
        }
    };

    const handleShow = (usuario) => {
        setCurrentUsuario(usuario);
        setIsShowModalOpen(true);
        loadUsuarios();

    };

    const handleCreate = async (newUsuario) => {
        try {
            await usuarioService.createUsuario(newUsuario);
            setIsCreateModalOpen(false);  // Cerrar modal después de crear
        } catch (error) {
            console.error('Error creating usuario:', error);
        } finally {
            loadUsuarios();
        }
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Pacientes</Heading>

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Paciente
            </Button>

            {/* Tabla de usuarios */}
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Nombre Completo</Th>
                        <Th>CI</Th>
                        <Th>Fecha de Nacimiento</Th>
                        <Th>Seguro Médico</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {usuarios.map((usuario) => (
                        <Tr key={usuario.id_paciente}>
                            <Td>{usuario.nombre_completo}</Td>
                            <Td>{usuario.ci}</Td>
                            <Td>{usuario.fecha_nacimiento}</Td>
                            <Td>{usuario.seguro_medico}</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <IconButton
                                        icon={<InfoIcon />}
                                        colorScheme="cyan"
                                        size="sm"
                                        onClick={() => handleShow(usuario)}
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(usuario.id_paciente)}
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Modal para mostrar detalles del paciente */}
            {isShowModalOpen && (
                <ShowUsuarioModal
                    usuario={currentUsuario}
                    onClose={() => setIsShowModalOpen(false)}
                />
            )}

            {/* Modal de creación */}
            {isCreateModalOpen && (
                <CreateUsuarioModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </Box>
    );
};

export default UsuariosComponent;
