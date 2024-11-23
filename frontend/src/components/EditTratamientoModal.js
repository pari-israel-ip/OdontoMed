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
    Select,
    useToast,
    FormErrorMessage
} from '@chakra-ui/react';
import tratamientoService from '../services/tratamientoService';
import axios from 'axios';

const EditTratamientoModal = ({ tratamiento, onClose, onSave }) => {
    const [nombreTratamiento, setNombreTratamiento] = useState('');
    const [fechaTratamiento, setFechaTratamiento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState(0);
    const [estadoTratamiento, setEstadoTratamiento] = useState('');
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (tratamiento) {
            console.log(tratamiento);
            setNombreTratamiento(tratamiento.nombre_tratamiento);
            setFechaTratamiento(tratamiento.fecha_tratamiento);
            setDescripcion(tratamiento.descripcion || '');
            setEstadoTratamiento(tratamiento.estado_tratamiento);
            setMonto(0)
            // Recuperar el costo del tratamiento
            const fetchCosto = async () => {
                try {
                    const response = await tratamientoService.getCosto(tratamiento.id_costo_id);
                    setMonto(response.data.monto);  // Asumimos que la respuesta contiene el monto
                } catch (error) {
                    console.error('Error al obtener el costo:', error);
                    toast({
                        title: "Error al obtener el costo.",
                        description: "No se pudo recuperar el costo del tratamiento.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            };

            fetchCosto();
        }
    }, [tratamiento]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y agregar un 0 al inicio si es necesario
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes y agregar un 0 al inicio si es necesario
        const year = date.getFullYear(); // Obtener el año
        return `${day}-${month}-${year}`; // Retornar el formato deseado
    };
    
    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setMonth(maxDate.getMonth() + 1);
        const previousDate = new Date(tratamiento.fecha_tratamiento); // Fecha anterior
    
        // Formatear la fecha anterior a formato dd-mm-yyyy
        const formattedPreviousDate = formatDate(previousDate); // Formato dd-mm-yyyy
    
        // Validaciones
        if (!nombreTratamiento || nombreTratamiento.length < 5 || nombreTratamiento.length > 50) {
            newErrors.nombre_tratamiento = "EL NOMBRE DEL TRATAMIENTO DEBE TENER ENTRE 5 Y 50 CARACTERES.";
        }
        if (!fechaTratamiento) {
            newErrors.fecha_tratamiento = "LA FECHA DEL TRATAMIENTO ES OBLIGATORIA.";
        } else {
            const selectedDate = new Date(fechaTratamiento);
            if (selectedDate < previousDate) {
                newErrors.fecha_tratamiento = `LA FECHA NO PUEDE SER ANTERIOR A ${formattedPreviousDate}.`;
            } else if (selectedDate > maxDate) {
                newErrors.fecha_tratamiento = "LA FECHA NO PUEDE SER MAYOR A UN MES EN ADELANTE.";
            }
        }
        if (!descripcion || descripcion.length < 5 || descripcion.length > 200) {
            newErrors.descripcion = "LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES.";
        }
        if (!monto || monto < 0) {
            newErrors.monto = "EL MONTO DEBE SER UN NÚMERO MAYOR O IGUAL QUE CERO.";
        }
        if (!estadoTratamiento) {
            newErrors.estado_tratamiento = "EL ESTADO DEL TRATAMIENTO ES OBLIGATORIO.";
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
        setErrors({}); // Limpiar errores previos
        try {
            setLoading(true); // Inicia el estado de carga

            const response = await axios.put(`http://127.0.0.1:8000/odomed/tratamiento/${tratamiento.id_tratamiento}/`, {
                nombre_tratamiento: nombreTratamiento,
                fecha_tratamiento: fechaTratamiento,
                descripcion: descripcion,
                monto: parseFloat(monto), // Convertir monto a número en la actualización
                estado_tratamiento: estadoTratamiento,
            });
            console.log('Response:', response.data); // Verifica la respuesta

            // Verificar si hay errores en la respuesta
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Tratamiento actualizado.",
                    description: "El tratamiento ha sido actualizado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSave(response.data);
                onClose();
            }

        } catch (error) {
            // Manejo de errores generales
            const errorMessage = error.response?.data?.error || "OCURRIÓ UN ERROR AL INTENTAR ACTUALIZAR.";
            setErrors({ general: errorMessage });
            toast({
                title: "Error al actualizar tratamiento.",
                description: errorMessage.toUpperCase(), // Mostrar mensaje de error en mayúsculas
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
                <ModalHeader>Editar Tratamiento</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.nombre_tratamiento}>
                            <FormLabel>Nombre del Tratamiento</FormLabel>
                            <Input
                                value={nombreTratamiento}
                                onChange={(e) => setNombreTratamiento(e.target.value)}
                            />
                            <FormErrorMessage>{errors.nombre_tratamiento}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.fecha_tratamiento}>
                            <FormLabel>Fecha del Tratamiento</FormLabel>
                            <Input
                                type="date"
                                value={fechaTratamiento}
                                onChange={(e) => setFechaTratamiento(e.target.value)}
                            />
                            <FormErrorMessage>{errors.fecha_tratamiento}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.descripcion}>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.monto} isRequired>
                            <FormLabel>Monto</FormLabel>
                            <Input
                                type='number'
                                value={monto}
                                step="0.01"
                                onChange={(e) => setMonto(e.target.value)}
                            />
                            <FormErrorMessage>{errors.monto}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.estado_tratamiento} isRequired>
                            <FormLabel>Estado del Tratamiento</FormLabel>
                            <Select
                                value={estadoTratamiento}
                                onChange={(e) => setEstadoTratamiento(e.target.value)}
                            >
                                <option value="en curso">En Curso</option>
                                <option value="finalizado">Finalizado</option>
                            </Select>
                            <FormErrorMessage>{errors.estado_tratamiento}</FormErrorMessage>
                        </FormControl>

                        {errors.general && <FormErrorMessage>{errors.general}</FormErrorMessage>}

                        <Button isLoading={loading} mt={4} colorScheme="blue" type="submit">
                            Guardar
                        </Button>
                        <Button isLoading={loading} mt={4} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditTratamientoModal;
