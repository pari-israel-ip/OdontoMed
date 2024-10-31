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
import tratamientoService from '../services/tratamientoService';

const EditTratamientoModal = ({ tratamiento, onClose, onSave }) => {
    const [nombreTratamiento, setNombreTratamiento] = useState('');
    const [fechaTratamiento, setFechaTratamiento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [errors, setErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (tratamiento) {
            setNombreTratamiento(tratamiento.nombre_tratamiento);
            setFechaTratamiento(tratamiento.fecha_tratamiento);
            setDescripcion(tratamiento.descripcion);
            setMonto(tratamiento.monto); // Asegúrate de que este campo exista en el objeto tratamiento
        }
    }, [tratamiento]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await tratamientoService.updateTratamiento(tratamiento.id_tratamiento, {
                nombre_tratamiento: nombreTratamiento,
                fecha_tratamiento: fechaTratamiento,
                descripcion: descripcion,
                monto: monto, // Incluir el campo monto en la actualización
            });
            toast({
                title: "Tratamiento actualizado.",
                description: "El tratamiento ha sido actualizado exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating tratamiento:', error);
            toast({
                title: "Error al actualizar tratamiento.",
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
                <ModalHeader>Editar Tratamiento</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.nombre_tratamiento} isRequired>
                            <FormLabel>Nombre del Tratamiento</FormLabel>
                            <Input
                                value={nombreTratamiento}
                                onChange={(e) => setNombreTratamiento(e.target.value)}
                            />
                            <FormErrorMessage>{errors.nombre_tratamiento}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.fecha_tratamiento} isRequired>
                            <FormLabel>Fecha del Tratamiento</FormLabel>
                            <Input
                                type="date"
                                value={fechaTratamiento}
                                onChange={(e) => setFechaTratamiento(e.target.value)}
                            />
                            <FormErrorMessage>{errors.fecha_tratamiento}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.descripcion}>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.monto} isRequired>
                            <FormLabel>Monto</FormLabel>
                            <Input
                                type="number"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                            />
                            <FormErrorMessage>{errors.monto}</FormErrorMessage>
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

export default EditTratamientoModal;
