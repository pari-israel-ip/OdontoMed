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
    Select, useToast,Spinner,Center
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import citaService from '../services/citaService';
import EditCitaModal from './EditCitaModal';
import CreateCitaModal from './CreateCitaModal';
import odontologoService from '../services/odontologoService'
import ConPermiso from './ConPermiso';
const CitasComponent = () => {
    const [message, setMessage] = useState(null);
    const [citas, setCitas] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentCita, setCurrentCita] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy
    const [odontologoFiltro, setOdontologoFiltro] = useState('');
    const [estadoCitaFiltro, setEstadoCitaFiltro] = useState(''); // Nuevo estado de filtro
    const [odontologos, setOdontologos] = useState([]);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); // Estado de carga inicializado en true

    useEffect(() => {
        loadCitasAuto();
        loadCitas();
        loadOdontologos(); // Cargar odontólogos
    }, []);

    const loadCitas = async () => {
        try {
            setIsLoading(true);
            const response = await citaService.getCitas();
            setCitas(response.data);
        } catch (error) {
            console.error('Error fetching citas:', error);
        }finally{
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
            const response = await odontologoService.getOdontologos(); // Asumiendo que tienes un endpoint para odontólogos
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
                console.error('Error deleting cita:', error);
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
            console.error('Error updating cita:', error);
        }
    };

    const handleCreate = async (newCita) => {
        try {
            await citaService.createCita(newCita);
            loadCitas();
        } catch (error) {
            console.error('Error creating cita:', error);
        }
    };

    // Función para filtrar citas
    const filterCitas = () => {
        return citas.filter(cita => {
            const matchesFecha = cita.fecha === fechaFiltro;
            const matchesOdontologo = odontologoFiltro ? cita.odontologo === odontologoFiltro : true;
            const matchesEstado = estadoCitaFiltro ? cita.estado_cita === estadoCitaFiltro : true; // Filtro de estado_cita

            return matchesFecha && matchesOdontologo && matchesEstado;
        });
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>CITAS</Heading>

            {message && message.type === 'error' && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>ERROR:</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            {/* Filtros */}
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
                {/* Filtro por estado_cita */}
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
            {isLoading ? ( // Mostrar spinner mientras se cargan los detalles
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
                    {filterCitas().map(cita => (
                        <Tr key={cita.id_cita}>
                            <Td>{cita.fecha}</Td>
                            <Td>{cita.horario}</Td>
                            <Td>{cita.paciente === 'None None' ? 'NO ASIGNADO' : cita.paciente}</Td>
                            <Td>{cita.odontologo}</Td>
                            <Td>{cita.estado_cita.toUpperCase()}</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <ConPermiso permiso='Editar cita'>
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme="blue"
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
                    ))}
                </Tbody>
            </Table>)}

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
