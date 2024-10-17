// UsuariosComponent.js
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
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirigir
import usuarioService from '../services/usuarioService';
import CreateUsuarioModal from './CreateUsuarioModal';  // Ruta al modal de creación

const UsuariosComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate(); // Usa useNavigate para redirigir
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    const handleShow = (usuarioId) => {
        navigate(`/usuarios/${usuarioId}`);
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Pacientes</Heading>

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Paciente
            </Button>

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
                                        onClick={() => handleShow(usuario.id_paciente)}  // Redirigir a la ruta del modal
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
        </Box>
    );
};

export default UsuariosComponent;
