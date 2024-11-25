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
    Select,
    useToast,
    Spinner,
    Center,
    CloseButton,
    Badge
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import citaService from '../services/citaService';
import EditCitaModal from './EditCitaModal';
import { SettingsIcon } from '@chakra-ui/icons';

import CreateCitaModal from './CreateCitaModal';
import odontologoService from '../services/odontologoService';
import ConPermiso from './ConPermiso';
 
const CitasComponent = () => {
    const [message, setMessage] = useState(null);
    const [citas, setCitas] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentCita, setCurrentCita] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
    const [odontologoFiltro, setOdontologoFiltro] = useState('');
    const [estadoCitaFiltro, setEstadoCitaFiltro] = useState('');
    const [odontologos, setOdontologos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 11; // Elementos por página
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
 
    useEffect(() => {
        loadCitasAuto();
        loadCitas();
        loadOdontologos();
    }, []);
 
    useEffect(() => {
        setCurrentPage(1); // Reiniciar a la página 1 cuando los filtros cambien
    }, [fechaFiltro, odontologoFiltro, estadoCitaFiltro]);
 
    const loadCitas = async () => {
        try {
            setIsLoading(true);
            const response = await citaService.getCitas();
            setCitas(response.data);
        } catch (error) {
            console.error('Error fetching citas:', error);
        } finally {
            setIsLoading(false);
        }
    };
 
    const loadCitasAuto = async () => {
        try {
            await citaService.createCitasAuto();
        } catch (error) {
            console.error('Error fetching citas:', error);
        }
    };
 
    const loadOdontologos = async () => {
        try {
            const response = await odontologoService.getOdontologos();
            setOdontologos(response.data);
        } catch (error) {
            console.error('Error fetching odontólogos:', error);
        }
    };
 
    const handleDelete = async (id_cita) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta cita?");
        if (confirmDelete) {
            try {
                const response = await citaService.deleteCita(id_cita);
                setMessage({ type: 'success', text: response.data.message });
                loadCitas();
                toast({
                    title: "Cita eliminada.",
                    description: "La cita ha sido eliminada exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data.error || 'Error al eliminar la cita' });
                console.error('Error eliminando cita:', error);
            }
        }
    };
 
    const handleEdit = (cita) => {
        setCurrentCita(cita);
        setIsEditModalOpen(true);
    };
 
    const handleSave = async (updatedCita) => {
        try {
            await citaService.updateCita(updatedCita.id_cita, updatedCita);
            loadCitas();
        } catch (error) {
            console.error('Error actualizando cita:', error);
        }
    };
 
    const handleCreate = async (newCita) => {
        try {
            await citaService.createCita(newCita);
            loadCitas();
        } catch (error) {
            console.error('Error creando cita:', error);
        }
    };
 
    const filterCitas = () => {
        return citas.filter(cita => {
            const matchesFecha = cita.fecha === fechaFiltro;
            const matchesOdontologo = odontologoFiltro ? cita.odontologo === odontologoFiltro : true;
            const matchesEstado = estadoCitaFiltro ? cita.estado_cita === estadoCitaFiltro : true;
            return matchesFecha && matchesOdontologo && matchesEstado;
        });
    };
 
    const paginatedCitas = filterCitas().slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
 
    const totalPages = Math.ceil(filterCitas().length / itemsPerPage);
 
    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>CITAS</Heading>
 
            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ADVERTENCIA:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                    <CloseButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={() => setMessage(null)}
                    />
                </Alert>
            )}
 
            <Flex mb={4} justifyContent="space-between">
                <Input
                    type="date"
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                    placeholder="Seleccionar fecha"
                />
                <Select
                    placeholder="SELECCIONAR ODONTOLOGO"
                    value={odontologoFiltro}
                    onChange={(e) => setOdontologoFiltro(e.target.value)}
                    ml={4}
                >
                    {odontologos.map((odontologo) => (
                        <option key={odontologo.id_odontologo} value={odontologo.nombre_completo}>
                            {odontologo.nombre_completo}
                        </option>
                    ))}
                </Select>
                <Select
                    placeholder="SELECCIONAR ESTADO DE CITA"
                    value={estadoCitaFiltro}
                    onChange={(e) => setEstadoCitaFiltro(e.target.value)}
                    ml={4}
                >
                    <option value="programada">PROGRAMADA</option>
                    <option value="en espera">EN ESPERA</option>
                    <option value="cancelada">CANCELADA</option>
                    <option value="completada">COMPLETADA</option>
                </Select>
            </Flex>
 
            {isLoading ? (
                <Center mt={4}>
                    <Spinner size="xl" color="teal.500" />
                </Center>
            ) : (
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>Fecha</Th>
                            <Th>Horario</Th>
                            <Th>Paciente</Th>
                            <Th>Odontólogo</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {paginatedCitas.map(cita => {
                            const isHighlighted = cita.estado_cita === 'en espera' && cita.paciente !== 'None None';
                            return (
                                <Tr key={cita.id_cita}>
                                    <Td>{cita.fecha}</Td>
                                    <Td>{cita.horario}</Td>
                                    <Td>{cita.paciente === 'None None' ? 'NO ASIGNADO' : cita.paciente}{isHighlighted && <Badge colorScheme="yellow">Solicitud</Badge>}</Td>
                                    <Td>{cita.odontologo}</Td>
                                    <Td>{cita.estado_cita.toUpperCase()}</Td>
                                    <Td>
                                        <Flex justify="space-between">
                                            <ConPermiso permiso='Editar cita'>
                                                <IconButton
                                                    icon={<SettingsIcon />}
                                                    colorScheme="cyan"
                                                    size="sm"
                                                    onClick={() => handleEdit(cita)}
                                                    mr={2}
                                                />
                                            </ConPermiso>
                                            <ConPermiso permiso='Eliminar cita'>
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => handleDelete(cita.id_cita)}
                                                />
                                            </ConPermiso>
                                        </Flex>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            )}
 
<Flex justify="space-between" align="center" mt={4} >
                <Button colorScheme="teal"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    ANTERIOR
                </Button>
                <Box>PAGINA {currentPage} DE {totalPages}</Box>
                <Button colorScheme="teal"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    SIGUIENTE
                </Button>
            </Flex>
 
            {isEditModalOpen && (
                <EditCitaModal
                    cita={currentCita}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}
 
            {isCreateModalOpen && (
                <CreateCitaModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </Box>
    );
};
 
export default CitasComponent;