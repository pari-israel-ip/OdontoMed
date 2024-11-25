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
    useToast,
    FormErrorMessage
} from '@chakra-ui/react';
import axios from 'axios';

const EditPrescriptionModal = ({ prescripcion, onClose, onSave }) => {
    const [nombreMedicamento, setNombreMedicamento] = useState('');
    const [dosis, setDosis] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [initialFechaInicio, setInitialFechaInicio] = useState(''); // Store original start date
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (prescripcion) {
            setNombreMedicamento(prescripcion.nombre_medicamento || '');
            setDosis(prescripcion.dosis || '');
            setFechaInicio(prescripcion.fecha_inicio || '');
            setFechaFin(prescripcion.fecha_fin || '');
            setInitialFechaInicio(prescripcion.fecha_inicio || ''); // Set original start date
        }
    }, [prescripcion]);

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);
        const originalStart = new Date(initialFechaInicio);

        // Nombre Medicamento Validation
        if (!nombreMedicamento || nombreMedicamento.length < 5 || nombreMedicamento.length > 50) {
            newErrors.nombre_medicamento = "El nombre del medicamento debe tener entre 5 y 50 caracteres.";
        }

        // Dosis Validation
        if (!dosis || dosis.length > 100) {
            newErrors.dosis = "La dosis es requerida y no debe superar los 100 caracteres.";
        }

        // Fecha Inicio Validation
        if (!fechaInicio) {
            newErrors.fecha_inicio = "La fecha de inicio es obligatoria.";
        } else if (start < originalStart) {
            newErrors.fecha_inicio = "La fecha de inicio no puede ser anterior a la fecha de inicio original.";
        } else if (start > new Date(originalStart).setDate(new Date(originalStart).getDate() + 30)) {
            newErrors.fecha_inicio = `La fecha de inicio no puede ser posterior a 30 días después de la fecha establecida inicialmente.`;
        }

        // Fecha Fin Validation
        if (!fechaFin) {
            newErrors.fecha_fin = "La fecha de fin es obligatoria.";
        } else if (end < start) {
            newErrors.fecha_fin = "La fecha de fin debe ser el mismo día o posterior a la fecha de inicio.";
        } else if (end > new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000)) {
            newErrors.fecha_fin = "La fecha de fin no puede exceder 30 días después de la fecha de inicio.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({}); // Clear previous errors

        try {
            setLoading(true); // Inicia el estado de carga

            const response = await axios.put(`http://127.0.0.1:8000/odomed/prescripcion/${prescripcion.id_medicamento}/`, {
                nombre_medicamento: nombreMedicamento,
                dosis,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });
            console.log('Response:', response.data);

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Prescripción actualizada",
                    description: "La prescripción ha sido actualizada exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSave(response.data);
                onClose();
            }

        } catch (error) {
            const errorMessage = error.response?.data?.error || "Ocurrió un error al intentar actualizar.";
            setErrors({ general: errorMessage });
            toast({
                title: "Error al actualizar prescripción",
                description: errorMessage,
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
                <ModalHeader>Editar Prescripción</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.nombre_medicamento} mb={4}>
                            <FormLabel>Nombre del Medicamento</FormLabel>
                            <Input
                                value={nombreMedicamento}
                                onChange={(e) => setNombreMedicamento(e.target.value)}
                            />
                            <FormErrorMessage>{errors.nombre_medicamento}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.dosis} mb={4}>
                            <FormLabel>Dosis</FormLabel>
                            <Input
                                value={dosis}
                                onChange={(e) => setDosis(e.target.value)}
                            />
                            <FormErrorMessage>{errors.dosis}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.fecha_inicio} mb={4}>
                            <FormLabel>Fecha de Inicio</FormLabel>
                            <Input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                            <FormErrorMessage>{errors.fecha_inicio}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.fecha_fin} mb={4}>
                            <FormLabel>Fecha de Fin</FormLabel>
                            <Input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                            <FormErrorMessage>{errors.fecha_fin}</FormErrorMessage>
                        </FormControl>

                        {errors.general && (
                            <FormErrorMessage mb={4}>{errors.general}</FormErrorMessage>
                        )}

                        <Button isLoading={loading} bg="#319795" 
              color="white" 
              _hover={{ bg: "#287f75" }} // Color más oscuro al pasar el cursor
              mt={4} type="submit">
                            Guardar
                        </Button>
                        <Button bg="#319795" 
              color="white" 
              _hover={{ bg: "#287f75" }} // Color más oscuro al pasar el cursor
              mt={4} isLoading={loading} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditPrescriptionModal;
