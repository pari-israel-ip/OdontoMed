// EditCitaModal.js
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
    const toast = useToast();

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

    const handleSave = () => {
        const updatedCita = { ...cita, estado_cita, id_paciente:paciente, monto };
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
                        <Select value={paciente} onChange={(e) => setPaciente(e.target.value)}>
                            {pacientes.map((pac) => (
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
                    <Button colorScheme="blue" onClick={handleSave}>
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
