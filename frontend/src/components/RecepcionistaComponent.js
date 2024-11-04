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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirigir
import recepcionistaService from '../services/recepcionistaService';  // Servicio de odontólogo
import CreateRecepcionistaModal from './CreateRecepcionistaModal'; // Ruta al modal de creación
import EditUsuarioModal from './EditUsuarioModal';

const RecepcionistasComponent = () => {
    const [recepcionistas, setRecepcionistas] = useState([]);
    const [message, setMessage] = useState(null); // Estado para el mensaje de respuesta
    const navigate = useNavigate(); // Usa useNavigate para redirigir
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentRecepcionista, setCurrentRecepcionista] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    useEffect(() => {
        loadRecepcionistas();
    }, []);

    const loadRecepcionistas = async () => {
        try {
            const response = await recepcionistaService.getRecepcionistas();
            setRecepcionistas(response.data);
        } catch (error) {
            console.error('Error fetching Recepcionistas:', error);
        }
    };
    
    const handleDelete = async (id_recepcionista) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Recepcionista?");
        if (confirmDelete) {
            try {
                const response = await recepcionistaService.deleteRecepcionistas(id_recepcionista);
                setMessage({ type: 'success', text: response.data.message }); // Muestra el mensaje de éxito
                loadRecepcionistas();
            } catch (error) {
                // Captura y muestra el mensaje de error desde el servidor
                setMessage({ type: 'error', text: error.response?.data.error || 'Error al eliminar el Recepcionista' });
                console.error('Error deleting Recepcionista:', error);
                
            }
        }
    };

    const handleCreate = (newRecepcionista) => {
        setRecepcionistas((prevRecepcionistas) => [...prevRecepcionistas, newRecepcionista]);
        setIsCreateModalOpen(false);
    };

    const handleEdit = (recepcionista) => {
        setCurrentRecepcionista(recepcionista);
        setIsEditModalOpen(true);
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Recepcionistas</Heading>

            {message && (
                <Alert status={message.type === 'success' ? 'success' : 'error'} mb={4}>
                    <AlertIcon />
                    {message.type === 'error' ? (
                        <>
                            <AlertTitle>Error:</AlertTitle>
                            <AlertDescription>{message.text}</AlertDescription>
                        </>
                    ) : (
                        <AlertDescription>ACCION REALIZADA CORRECTAMENTE</AlertDescription>
                    )}
                </Alert>
            )}

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Recepcionista
            </Button>

            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Nombre Completo</Th>
                        <Th>CI</Th>
                        <Th>Telefono</Th>
                        <Th>Correo Electronico</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {recepcionistas.map((recepcionista) => (
                        <Tr key={recepcionista.id_recepcionista}>
                            <Td>{recepcionista.nombre_completo}</Td>
                            <Td>{recepcionista.ci}</Td>
                            <Td>{recepcionista.telefono}</Td>
                            <Td>{recepcionista.email }</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme="cyan"
                                        size="sm"
                                        onClick={() => handleEdit(recepcionista)}
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(recepcionista.id_recepcionista)}
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {isCreateModalOpen && (
                <CreateRecepcionistaModal 
                    onClose={() => { setIsCreateModalOpen(false); loadRecepcionistas(); }} 
                    onCreate={handleCreate} 
                />
            )}
            {isEditModalOpen && (
                <EditUsuarioModal
                    usuario={currentRecepcionista}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updatedUser) => {
                        setIsEditModalOpen(false);
                        loadRecepcionistas();
    
                    }} 
                />
            )}
        </Box>
    );
};

export default RecepcionistasComponent;
