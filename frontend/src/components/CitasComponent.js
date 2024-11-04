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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import citaService from '../services/citaService';
import EditCitaModal from './EditCitaModal';
import CreateCitaModal from './CreateCitaModal';
import usuarioService from '../services/usuarioService'; // Asegúrate de importar esto si necesitas los odontólogos
import odontologoService from '../services/odontologoService'

const CitasComponent = () => {
    const [message, setMessage] = useState(null);
    const [citas, setCitas] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentCita, setCurrentCita] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy
    const [odontologoFiltro, setOdontologoFiltro] = useState('');
    const [odontologos, setOdontologos] = useState([]);

    useEffect(() => {
        loadCitasAuto();
        loadCitas();
        loadOdontologos(); // Cargar odontólogos
    }, []);

    const loadCitas = async () => {
        try {
            const response = await citaService.getCitas();
            setCitas(response.data);
        } catch (error) {
            console.error('Error fetching citas:', error);
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
            return matchesFecha && matchesOdontologo;
        });
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Citas</Heading>

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

            {/* Filtros */}
            <Flex mb={4} justifyContent="space-between">
                <Input
                    type="date"
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                    placeholder="Seleccionar fecha"
                />
                <Select
                    placeholder="Seleccionar Odontólogo"
                    value={odontologoFiltro}
                    onChange={(e) => setOdontologoFiltro(e.target.value)}
                    ml={4}
                >
                    <option value="">Todos</option>
                    {odontologos.map((odontologo) => (
                        <option key={odontologo.id_odontologo} value={odontologo.nombre_completo}>
                            {odontologo.nombre_completo}
                        </option>
                    ))}
                </Select>
            </Flex>

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
                            <Td>{cita.paciente}</Td>
                            <Td>{cita.odontologo}</Td>
                            <Td>{cita.estado_cita}</Td>
                            <Td>
                                <Flex justify="space-between">
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={() => handleEdit(cita)}
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(cita.id_cita)}
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

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
