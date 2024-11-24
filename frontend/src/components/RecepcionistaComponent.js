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
    useToast,Spinner,Center,CloseButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import recepcionistaService from '../services/recepcionistaService';
import CreateRecepcionistaModal from './CreateRecepcionistaModal';
import EditUsuarioModal from './EditUsuarioModal';
import ConPermiso from './ConPermiso';
const RecepcionistasComponent = () => {
    const [recepcionistas, setRecepcionistas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");  // Estado para la búsqueda
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentRecepcionista, setCurrentRecepcionista] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const toast = useToast();    
    const [isLoading, setIsLoading] = useState(false); // Estado de carga inicializado en true


    useEffect(() => {
        loadRecepcionistas();
    }, []);

    const loadRecepcionistas = async () => {
        try {
            setIsLoading(true);

            const response = await recepcionistaService.getRecepcionistas();
            setRecepcionistas(response.data);
        } catch (error) {
            console.error('Error fetching Recepcionistas:', error);
        }finally{
            setIsLoading(false);

        }
    };
    
    const handleDelete = async (id_recepcionista) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Recepcionista?");
        if (confirmDelete) {
            try {
                await recepcionistaService.deleteRecepcionistas(id_recepcionista);
                setMessage({ type: 'success', text: "Recepcionista eliminado exitosamente." });
                loadRecepcionistas();
                toast({
                    title: "Recepcionista eliminado.",
                    description: "El recepcionista ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
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

    // Filtrar recepcionistas según el término de búsqueda
    const filteredRecepcionistas = recepcionistas.filter((recepcionista) => {
        const searchText = searchTerm.toLowerCase();
        return (
            recepcionista.nombre_completo?.toLowerCase().includes(searchText) ||
            recepcionista.ci?.toLowerCase().includes(searchText) ||
            recepcionista.telefono?.toLowerCase().includes(searchText) ||
            recepcionista.email?.toLowerCase().includes(searchText)
        );
    });

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>RECEPCIONISTAS</Heading>

            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ERROR:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                    <CloseButton 
                    position="absolute" 
                    right="8px" 
                    top="8px" 
                    onClick={() => setMessage(null)} // Establece el estado a null para cerrar el alert
                />
                </Alert>
            )}
            <ConPermiso permiso='Crear Recepcionista'>
                <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>
                    CREAR NUEVO RECEPCIONISTA
                </Button>
                </ConPermiso>
            <Flex mb={4} justify="space-between">
                
                <Input
                    placeholder="BUSCAR RECEPCIONISTA..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ml={4}
                    marginTop={4}
                />
            </Flex>
            {isLoading ? ( // Mostrar spinner mientras se cargan los detalles
                <Center mt={4}>
                    <Spinner size="xl" color="teal.500" />
                </Center>
            ) : (
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>NOMBRE COMPLETO</Th>
                        <Th>CI</Th>
                        <Th>TELEFONO</Th>
                        <Th>CORREO ELECTRONICO</Th>
                        <Th>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredRecepcionistas.map((recepcionista) => (
                        <Tr key={recepcionista.id_recepcionista}>
                            <Td>{recepcionista.nombre_completo}</Td>
                            <Td>{recepcionista.ci}</Td>
                            <Td>{recepcionista.telefono}</Td>
                            <Td>{recepcionista.email}</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <ConPermiso permiso='Editar Recepcionista'>
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme="cyan"
                                        size="sm"
                                        onClick={() => handleEdit(recepcionista)}
                                        mr={2}
                                    />
                                    </ConPermiso>
                                    <ConPermiso permiso='Eliminar Recepcionista'>
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(recepcionista.id_recepcionista)}
                                    />
                                    </ConPermiso>
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>)}

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
