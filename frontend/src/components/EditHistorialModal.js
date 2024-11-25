import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    FormErrorMessage,
    Select,
    useToast
} from '@chakra-ui/react';
import odontologoService from '../services/odontologoService';
import axios from 'axios';

const EditHistorialModal = ({ historial, onClose, onSave }) => {
    const [notasGenerales, setNotasGenerales] = useState(historial.notas_generales || '');
    const [odontologos, setOdontologos] = useState([]);
    const [selectedOdontologo, setSelectedOdontologo] = useState(historial.id_odontologo || '');
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchOdontologos = async () => {
            try {
                const response = await odontologoService.getOdontologos();
                setOdontologos(response.data);
            } catch (error) {
                console.error('Error al obtener los odontólogos:', error);
            }
        };
        fetchOdontologos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Inicia el estado de carga

            const response = await axios.put(`http://127.0.0.1:8000/odomed/historial/${historial.id_historial}/`, {
                notas_generales: notasGenerales,
                id_odontologo: selectedOdontologo
            });

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Historial actualizado.",
                    description: "El historial clínico ha sido actualizado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSave(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al actualizar el historial. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
            toast({
                title: "Error al actualizar historial.",
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
                <ModalHeader>Editar Historial Clínico</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.notas_generales} isRequired>
                            <FormLabel>Notas Generales</FormLabel>
                            <Textarea
                                value={notasGenerales}
                                onChange={(e) => setNotasGenerales(e.target.value)}
                                placeholder="Ingrese las notas generales"
                            />
                            <FormErrorMessage>{errors.notas_generales}</FormErrorMessage>
                        </FormControl>
                        
                        <FormControl mt={4} isInvalid={!!errors.id_odontologo} isRequired>
                            <FormLabel>Odontólogo</FormLabel>
                            <Select
                                value={selectedOdontologo}
                                onChange={(e) => setSelectedOdontologo(e.target.value)}
                                placeholder="Seleccione un odontólogo"
                            >
                                {odontologos.map(odontologo => (
                                    <option key={odontologo.id_odontologo} value={odontologo.id_odontologo}>
                                        {odontologo.nombre_completo}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.id_odontologo}</FormErrorMessage>
                        </FormControl>

                        <Button  isLoading={loading} bg="#319795" 
              color="white" 
              _hover={{ bg: "#287f75" }} // Color más oscuro al pasar el cursor
              mt={4} type="submit">Guardar</Button>
                        <Button mt={4} isLoading={loading} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditHistorialModal;