// src/components/EditPacienteModal.js
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    FormErrorMessage
} from '@chakra-ui/react';
import axios from 'axios';

const EditPacienteModal = ({ paciente, onClose, onSave }) => {
    const [seguroMedico, setSeguroMedico] = useState(paciente.seguro_medico || '');
    const [alergias, setAlergias] = useState(paciente.alergias || '');
    const [antecedentesMedicos, setAntecedentesMedicos] = useState(paciente.antecedentes_medicos || '');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/odomed/paciente/${paciente.id_usuario}/`, {
                seguro_medico: seguroMedico,
                alergias,
                antecedentes_medicos: antecedentesMedicos,
            });

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onSave(response.data);
                onClose(); // Cerrar el modal después de guardar
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al actualizar el paciente. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Paciente</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.seguro_medico}>
                            <FormLabel>Seguro Médico</FormLabel>
                            <Input
                                value={seguroMedico}
                                onChange={(e) => setSeguroMedico(e.target.value)}
                                placeholder="Ingrese el seguro médico"
                                required
                            />
                            <FormErrorMessage>{errors.seguro_medico}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.alergias}>
                            <FormLabel>Alergias</FormLabel>
                            <Input
                                value={alergias}
                                onChange={(e) => setAlergias(e.target.value)}
                                placeholder="Ingrese alergias"
                            />
                            <FormErrorMessage>{errors.alergias}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.antecedentes_medicos}>
                            <FormLabel>Antecedentes Médicos</FormLabel>
                            <Input
                                value={antecedentesMedicos}
                                onChange={(e) => setAntecedentesMedicos(e.target.value)}
                                placeholder="Ingrese antecedentes médicos"
                            />
                            <FormErrorMessage>{errors.antecedentes_medicos}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} colorScheme="blue" type="submit">Guardar</Button>
                        <Button mt={4} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditPacienteModal;
