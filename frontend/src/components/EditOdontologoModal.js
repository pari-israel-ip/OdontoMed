// src/components/EditOdontologoModal.js
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
    Switch,
    Button,
    FormErrorMessage, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const EditOdontologoModal = ({ odontologo, id, onClose, onSave }) => {
    const [numeroLicencia, setNumeroLicencia] = useState(odontologo.numero_licencia || '');
    const [especializacion, setEspecializacion] = useState(odontologo.especializacion || '');
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting with id_odontologo:", id); // Check if id_odontologo is present

        try {
            const response = await axios.put(`http://127.0.0.1:8000/odomed/odontologo/${id}/`, {
                numero_licencia: numeroLicencia,
                especializacion,
            });

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Odontologo actualizado.",
                    description: "El odontologo ha sido actualizado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSave(response.data);
                onClose(); // Close modal after saving
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al actualizar el odontólogo. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        }
    };


    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Odontólogo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.numero_licencia}>
                            <FormLabel>Número de Licencia</FormLabel>
                            <Input
                                value={numeroLicencia}
                                onChange={(e) => setNumeroLicencia(e.target.value)}
                                placeholder="Ingrese el número de licencia"
                                required
                            />
                            <FormErrorMessage>{errors.numero_licencia}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.especializacion}>
                            <FormLabel>Especialización</FormLabel>
                            <Input
                                value={especializacion}
                                onChange={(e) => setEspecializacion(e.target.value)}
                                placeholder="Ingrese la especialización"
                            />
                            <FormErrorMessage>{errors.especializacion}</FormErrorMessage>
                        </FormControl>
                       
                        <Button mt={4} colorScheme="blue" type="submit">Guardar</Button>
                        <Button mt={4} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditOdontologoModal;
