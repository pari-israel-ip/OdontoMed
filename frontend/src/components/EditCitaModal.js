import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Select,
    Input, useToast
} from '@chakra-ui/react';
import citaService from '../services/citaService';
import usuarioService from '../services/usuarioService';

const EditCitaModal = ({ cita, onClose, onSave }) => {
    const [estado_cita, setEstado] = useState(cita.estado_cita || '');
    const [paciente, setPaciente] = useState(cita.id_paciente || '');
    const [monto, setMonto] = useState(cita.monto || '');
    const [pacientes, setPacientes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await usuarioService.getUsuarios();
                setPacientes(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPacientes();
    }, []);

    // Filtrar pacientes según el input de búsqueda
    const filteredPacientes = pacientes.filter(pac =>
        `${pac.nombres} ${pac.apellidos}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = () => {
        setLoading(true); // Inicia el estado de carga

        const updatedCita = { ...cita, estado_cita, id_paciente: paciente, monto };
        console.log(updatedCita);
        onSave(updatedCita);
        toast({
            title: "Cita actualizada.",
            description: "La cita ha sido actualizada exitosamente.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        onClose();
        setLoading(false); // Inicia el estado de carga

    };

    return (
        <Modal isOpen onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Cita</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Estado</FormLabel>
                        <Select value={estado_cita} onChange={(e) => setEstado(e.target.value)}>
                            <option value="programada">Programada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="en espera">En Espera</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Paciente</FormLabel>
                        {/* Campo de búsqueda */}
                        <Input
                            placeholder="Buscar paciente"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            mb={3}
                        />
                        <Select value={paciente} onChange={(e) => setPaciente(e.target.value)}
                            placeholder="Selecciona un paciente">
                            {filteredPacientes.map((pac) => (
                                <option key={pac.id_paciente} value={pac.id_paciente}>
                                    {pac.nombres} {pac.apellidos}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Monto</FormLabel>
                        <Input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
                        Guardar
                    </Button>
                    <Button onClick={onClose} ml={3}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditCitaModal;
