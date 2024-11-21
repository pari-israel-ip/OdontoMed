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
    useToast,
    Input
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import odontologoService from '../services/odontologoService';
import CreateOdontologoModal from './CreateOdontologoModal';
import ConPermiso from './ConPermiso'
const OdontologosComponent = () => {
    const [odontologos, setOdontologos] = useState([]);
    const [filteredOdontologos, setFilteredOdontologos] = useState([]);
    const [message, setMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadOdontologos();
    }, []);

    useEffect(() => {
        // Filtra odontólogos en función del término de búsqueda, validando que los campos existen antes de aplicar toLowerCase
        setFilteredOdontologos(
            odontologos.filter((odontologo) => {
                const nombre = odontologo.nombre_completo || '';
                const ci = odontologo.ci || '';
                const email = odontologo.email || '';
                const licencia = odontologo.numero_licencia || '';
                const especializacion = odontologo.especializacion || '';
    
                return (
                    nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ci.toString().includes(searchTerm) ||
                    email.toString().includes(searchTerm) ||
                    licencia.toString().includes(searchTerm) ||
                    especializacion.toLowerCase().includes(searchTerm.toLowerCase())
                );
            })
        );
    }, [searchTerm, odontologos]);

    const loadOdontologos = async () => {
        try {
            const response = await odontologoService.getOdontologos();
            setOdontologos(response.data);
            setFilteredOdontologos(response.data);
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
                setMessage({ type: 'success', text: response.data.message });
                loadOdontologos();
            } catch (error) {
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
            <ConPermiso permiso='Crear odontólogo'>
                <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mr={4}>
                    CREAR NUEVO ODONTOLOGO
                </Button>
                </ConPermiso>
            <Flex mb={4} justify="space-between">
                
                <Input
                    placeholder="BUSCAR ODONTOLOGO..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ml={4}
                    marginTop={4}
                />
            </Flex>

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
                    {filteredOdontologos.map((odontologo) => (
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
                                    <ConPermiso permiso='Eliminar odontólogo'>
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(odontologo.id_odontologo)}
                                    />
                                    </ConPermiso>
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
