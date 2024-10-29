// src/components/OdontologosComponent.js
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
import odontologoService from '../services/odontologoService';  // Servicio de odontólogo
import CreateOdontologoModal from './CreateOdontologoModal'; // Ruta al modal de creación

const OdontologosComponent = () => {
    const [odontologos, setOdontologos] = useState([]);
    const navigate = useNavigate(); // Usa useNavigate para redirigir
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadOdontologos();
    }, []);

    const loadOdontologos = async () => {
        try {
            const response = await odontologoService.getOdontologos();
            console.log(response); // Para ver la respuesta completa
            setOdontologos(response.data);
        } catch (error) {
            console.error('Error fetching odontólogos:', error);
        }
    };
    
    
    const handleDelete = async (id_odontologo) => {
        console.log("id a borrar:", id_odontologo)
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Odontólogo?");
        if (confirmDelete) {
            try {
                await odontologoService.deleteOdontologos(id_odontologo);
                loadOdontologos();
            } catch (error) {
                console.error('Error deleting odontólogo:', error);
            }
        }
    };

    const handleCreate = (newOdontologo) => {
        // Aquí puedes actualizar la lista de odontólogos o simplemente volver a cargar
        setOdontologos((prevOdontologos) => [...prevOdontologos, newOdontologo]);
        setIsCreateModalOpen(false); // Cierra el modal
    };

    const handleShow = (odontologoId) => {
        navigate(`/odontologos/${odontologoId}`); // Redirigir a la ruta del modal
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Odontólogos</Heading>

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Odontólogo
            </Button>

            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Nombre Completo</Th>
                        <Th>CI</Th>
                        <Th>Especialización</Th>
                        <Th>Licencia</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {odontologos.map((odontologo) => (
                        <Tr key={odontologo.id_odontologo}>
                            <Td>{odontologo.nombre_completo}</Td>
                            <Td>{odontologo.ci}</Td>
                            <Td>{odontologo.especializacion}</Td>
                            <Td>{odontologo.numero_licencia }</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <IconButton
                                        icon={<InfoIcon />}
                                        colorScheme="cyan"
                                        size="sm"
                                        onClick={() => handleShow(odontologo.id_odontologo)} // Redirigir a la ruta del modal
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
