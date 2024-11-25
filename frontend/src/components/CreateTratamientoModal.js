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
import tratamientoService from '../services/tratamientoService';

const CreateTratamientoModal = ({ isOpen, onClose, idHistorial, onCreated }) => {
    const [nombreTratamiento, setNombreTratamiento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaTratamiento, setFechaTratamiento] = useState('');
    const [monto, setMonto] = useState('0');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        let validationErrors = {};

        if (monto < 0) {
            validationErrors.monto = "El monto debe ser mayor o igual a cero.";
        }
        
        if (!fechaTratamiento) {
            validationErrors.fecha_tratamiento = "La fecha del tratamiento es obligatoria.";
        }
        
        if (!nombreTratamiento) {
            validationErrors.nombre_tratamiento = "El nombre del tratamiento es obligatorio.";
        }
        
        if (!descripcion) {
            validationErrors.descripcion = "La descripcion del tratamiento es obligatoria.";
        }
        

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        const nuevoTratamiento = {
            id_historial: idHistorial,
            nombre_tratamiento: nombreTratamiento,
            descripcion,
            fecha_tratamiento: fechaTratamiento,
            monto
        };

        try {
            const response = await tratamientoService.createTratamiento(nuevoTratamiento);
            console.log(nuevoTratamiento);

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onCreated(response.data);
                toast({
                    title: "Tratamiento creado.",
                    description: "El tratamiento ha sido creado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al crear el tratamiento. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Tratamiento</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired isInvalid={!!errors.nombre_tratamiento}>
                        <FormLabel>Nombre del Tratamiento</FormLabel>
                        <Input
                            value={nombreTratamiento}
                            onChange={(e) => setNombreTratamiento(e.target.value)}
                        />
                        {errors.nombre_tratamiento && <FormErrorMessage>{errors.nombre_tratamiento}</FormErrorMessage>}
                    </FormControl>

                    <FormControl mt={4} isRequired isInvalid={!!errors.descripcion}>
                        <FormLabel>Descripción</FormLabel>
                        <Textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                        {errors.descripcion && <FormErrorMessage>{errors.descripcion}</FormErrorMessage>}
                    </FormControl>

                    <FormControl mt={4} isRequired isInvalid={!!errors.fecha_tratamiento}>
                        <FormLabel>Fecha del Tratamiento</FormLabel>
                        <Input
                            type="date"
                            value={fechaTratamiento}
                            onChange={(e) => setFechaTratamiento(e.target.value)}
                        />
                        {errors.fecha_tratamiento && <FormErrorMessage>{errors.fecha_tratamiento}</FormErrorMessage>}
                    </FormControl>

                    <FormControl mt={4} isRequired isInvalid={!!errors.monto}>
                        <FormLabel>Monto</FormLabel>
                        <Input
                            type="number"
                            step="0.01"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value || '0')}
                        />
                        {errors.monto && <FormErrorMessage>{errors.monto}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button bg="#319795" 
              color="white" 
              _hover={{ bg: "#287f75" }} // Color más oscuro al pasar el cursor
              mt={4} onClick={handleSubmit} isLoading={loading}>
                        Crear
                    </Button>
                    <Button isLoading={loading} ml={3} mt={4} onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTratamientoModal;
