import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast,
    FormErrorMessage
} from '@chakra-ui/react';
import diagnosticoService from '../services/diagnosticoService';

const EditDiagnosticoModal = ({ diagnostico, onClose, onSave }) => {
    const [nombreDiagnostico, setNombreDiagnostico] = useState('');
    const [fechaDiagnostico, setFechaDiagnostico] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errors, setErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (diagnostico) {
            setNombreDiagnostico(diagnostico.nombre_diagnostico);
            setFechaDiagnostico(diagnostico.fecha_diagnostico);
            setDescripcion(diagnostico.descripcion);
        }
    }, [diagnostico]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await diagnosticoService.updateDiagnostico(diagnostico.id_diagnostico, {
                nombre_diagnostico: nombreDiagnostico,
                fecha_diagnostico: fechaDiagnostico,
                descripcion: descripcion
            });
            toast({
                title: "Diagnóstico actualizado.",
                description: "El diagnóstico ha sido actualizado exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating diagnostico:', error);
            toast({
                title: "Error al actualizar diagnóstico.",
                description: "Ocurrió un error al intentar actualizar.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Diagnóstico</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.nombre_diagnostico} isRequired>
                            <FormLabel>Nombre del Diagnóstico</FormLabel>
                            <Input
                                value={nombreDiagnostico}
                                onChange={(e) => setNombreDiagnostico(e.target.value)}
                            />
                            <FormErrorMessage>{errors.nombre_diagnostico}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.fecha_diagnostico} isRequired>
                            <FormLabel>Fecha del Diagnóstico</FormLabel>
                            <Input
                                type="date"
                                value={fechaDiagnostico}
                                onChange={(e) => setFechaDiagnostico(e.target.value)}
                            />
                            <FormErrorMessage>{errors.fecha_diagnostico}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.descripcion}>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
                        </FormControl>

                        <Button mt={4} colorScheme="blue" type="submit">
                            Guardar Cambios
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditDiagnosticoModal;