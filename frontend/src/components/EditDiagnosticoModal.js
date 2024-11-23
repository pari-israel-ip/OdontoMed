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
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (diagnostico) {
            setNombreDiagnostico(diagnostico.nombre_diagnostico);
            setFechaDiagnostico(diagnostico.fecha_diagnostico);
            setDescripcion(diagnostico.descripcion);
        }
    }, [diagnostico]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setMonth(maxDate.getMonth() + 1);
        const previousDate = new Date(diagnostico.fecha_diagnostico);
        const formattedPreviousDate = formatDate(previousDate);

        if (!nombreDiagnostico || nombreDiagnostico.length < 5 || nombreDiagnostico.length > 50) {
            newErrors.nombre_diagnostico = "EL NOMBRE DEL DIAGNÓSTICO DEBE TENER ENTRE 5 Y 50 CARACTERES.";
        }
        if (!fechaDiagnostico) {
            newErrors.fecha_diagnostico = "LA FECHA DEL DIAGNÓSTICO ES OBLIGATORIA.";
        } else {
            const selectedDate = new Date(fechaDiagnostico);
            if (selectedDate < previousDate) {
                newErrors.fecha_diagnostico = `LA FECHA NO PUEDE SER ANTERIOR A ${formattedPreviousDate}.`;
            } else if (selectedDate > maxDate) {
                newErrors.fecha_diagnostico = "LA FECHA NO PUEDE SER MAYOR A UN MES EN ADELANTE.";
            }
        }
        if (!descripcion || descripcion.length < 5 || descripcion.length > 200) {
            newErrors.descripcion = "LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true); // Inicia el estado de carga

            const response = await diagnosticoService.updateDiagnostico(diagnostico.id_diagnostico, {
                nombre_diagnostico: nombreDiagnostico,
                fecha_diagnostico: fechaDiagnostico,
                descripcion: descripcion
            });
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Diagnóstico actualizado.",
                    description: "El diagnóstico ha sido actualizado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSave(response.data);
                onClose();
            }
        } catch (error) {
            console.error('Error updating diagnostico:', error);
            toast({
                title: "Error al actualizar diagnóstico.",
                description: "Ocurrió un error al intentar actualizar.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false); // Inicia el estado de carga

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

                        <Button isLoading={loading} mt={4} colorScheme="blue" type="submit">
                            Guardar
                        </Button>
                        <Button mt={4} isLoading={loading} ml={4} onClick={onClose}>Cancelar</Button>

                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditDiagnosticoModal;
