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
    useToast
} from '@chakra-ui/react';
import diagnosticoService from '../services/diagnosticoService'; // Asegúrate de que esta ruta sea correcta

const EditDiagnosticoModal = ({ diagnostico, onClose, onSave }) => {
    const [nombreDiagnostico, setNombreDiagnostico] = useState('');
    const [fechaDiagnostico, setFechaDiagnostico] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const toast = useToast();
    const [errors, setErrors] = useState({});

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
            onSave(); // Llama a onSave para actualizar la lista de diagnósticos
        } catch (error) {
            console.error('Error updating diagnostico:', error);
            toast({
                title: "Error al actualizar diagnóstico.",
                description: "Ocurrió un error al intentar actualizar el diagnóstico.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        onClose(); // Cierra el modal
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Diagnóstico</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isRequired>
                            <FormLabel>Nombre del Diagnóstico</FormLabel>
                            <Input
                                value={nombreDiagnostico}
                                onChange={(e) => setNombreDiagnostico(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Fecha del Diagnóstico</FormLabel>
                            <Input
                                type="date"
                                value={fechaDiagnostico}
                                onChange={(e) => setFechaDiagnostico(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
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
