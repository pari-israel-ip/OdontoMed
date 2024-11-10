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
import { EditIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirigir
import odontologoService from '../services/odontologoService';  // Servicio de odontólogo
import CreateOdontologoModal from './CreateOdontologoModal'; // Ruta al modal de creación

const OdontologosComponent = () => {
    const [odontologos, setOdontologos] = useState([]);
    const [message, setMessage] = useState(null); // Estado para el mensaje de respuesta
    const navigate = useNavigate(); // Usa useNavigate para redirigir
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadOdontologos();
    }, []);

    const loadOdontologos = async () => {
        try {
            const response = await odontologoService.getOdontologos();
            setOdontologos(response.data);
        } catch (error) {
            console.error('Error fetching odontólogos:', error);
        }
    };
    
    const handleDelete = async (id_odontologo) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Odontólogo?");
        if (confirmDelete) {
            try {
                toast({
                    title: "Odontologo eliminado.",
                    description: "El odontologo ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                const response = await odontologoService.deleteOdontologos(id_odontologo);
                setMessage({ type: 'success', text: response.data.message }); // Muestra el mensaje de éxito
                loadOdontologos();
            } catch (error) {
                // Captura y muestra el mensaje de error desde el servidor
                setMessage({ type: 'error', text: error.response?.data.error || 'Error al eliminar el odontólogo' });
                console.error('Error deleting odontólogo:', error);
            }
        }
    };

    const handleCreate = (newOdontologo) => {
        setOdontologos((prevOdontologos) => [...prevOdontologos, newOdontologo]);
        setIsCreateModalOpen(false);
    };

    const handleShow = (odontologoId) => {
        navigate(`/odontologos/${odontologoId}`);
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>ODONTOLOGOS</Heading>

            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ERROR:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                CREAR NUEVO ODONTOLOGO
            </Button>

            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>NOMBRE COMPLETO</Th>
                        <Th>CI</Th>
                        <Th>CORREO ELECTRONICO</Th>
                        <Th>ESPECIALIZACION</Th>
                        <Th>NRO DE LICENCIA</Th>
                        <Th>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {odontologos.map((odontologo) => (
                        <Tr key={odontologo.id_odontologo}>
                            <Td>{odontologo.nombre_completo}</Td>
                            <Td>{odontologo.ci}</Td>
                            <Td>{odontologo.email}</Td>
                            <Td>{odontologo.especializacion}</Td>
                            <Td>{odontologo.numero_licencia }</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <IconButton
                                        icon={<InfoIcon />}
                                        colorScheme="cyan"
                                        size="sm"
                                        onClick={() => handleShow(odontologo.id_odontologo)}
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(odontologo.id_odontologo)}
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {isCreateModalOpen && (
                <CreateOdontologoModal 
                    onClose={() => { setIsCreateModalOpen(false); loadOdontologos(); }} 
                    onCreate={handleCreate} 
                />
            )}
        </Box>
    );
};

export default OdontologosComponent;
