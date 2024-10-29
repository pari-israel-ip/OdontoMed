import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    FormErrorMessage,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';

const CreateDiagnosticoModal = ({ isOpen, onClose, idHistorial, onCreated }) => {
    const [nombreDiagnostico, setNombreDiagnostico] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoDiagnostico = {
            id_historial: idHistorial,  // Usar el id_historial proporcionado
            nombre_diagnostico: nombreDiagnostico,
            descripcion
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/odomed/diagnostico/create/', nuevoDiagnostico);
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onCreated(response.data);
                toast({
                    title: "Diagnóstico creado.",
                    description: "El diagnóstico ha sido creado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al crear el diagnóstico. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Diagnóstico</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired isInvalid={!!errors.nombre_diagnostico}>
                        <FormLabel>Nombre del Diagnóstico</FormLabel>
                        <Input
                            value={nombreDiagnostico}
                            onChange={(e) => setNombreDiagnostico(e.target.value)}
                        />
                        {errors.nombre_diagnostico && <FormErrorMessage>{errors.nombre_diagnostico}</FormErrorMessage>}
                    </FormControl>

                    <FormControl mt={4} isRequired isInvalid={!!errors.descripcion}>
                        <FormLabel>Descripción</FormLabel>
                        <Textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                        {errors.descripcion && <FormErrorMessage>{errors.descripcion}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
                        Crear
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateDiagnosticoModal;
