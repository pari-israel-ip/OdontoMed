// src/components/EditHistorialModal.js
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
    Select
} from '@chakra-ui/react';
import axios from 'axios';
import odontologoService from '../services/odontologoService'; // Importa el servicio de odontólogos

const EditHistorialModal = ({ historial, onClose, onSave }) => {
    const [notasGenerales, setNotasGenerales] = useState(historial.notas_generales || '');
    const [odontologos, setOdontologos] = useState([]);
    const [selectedOdontologo, setSelectedOdontologo] = useState(historial.id_odontologo?.id_odontologo || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchOdontologos = async () => {
            try {
                const response = await odontologoService.getOdontologos(); // Obtén todos los odontólogos
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
            const response = await axios.put(`http://127.0.0.1:8000/odomed/historial/${historial.id_historial}/`, {
                notas_generales: notasGenerales,
                id_odontologo: selectedOdontologo // Envía el odontólogo seleccionado
            });

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onSave(response.data);
                onClose(); // Cerrar el modal después de guardar
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al actualizar el historial. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
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
                        <FormControl isInvalid={!!errors.notas_generales}>
                            <FormLabel>Notas Generales</FormLabel>
                            <Textarea
                                value={notasGenerales}
                                onChange={(e) => setNotasGenerales(e.target.value)}
                                placeholder="Ingrese las notas generales"
                                required
                            />
                            <FormErrorMessage>{errors.notas_generales}</FormErrorMessage>
                        </FormControl>
                        
                        <FormControl mt={4} isInvalid={!!errors.id_odontologo}>
                            <FormLabel>Odontólogo</FormLabel>
                            <Select
                                value={selectedOdontologo}
                                onChange={(e) => setSelectedOdontologo(e.target.value)}
                                placeholder="Seleccione un odontólogo"
                                required
                            >
                                {odontologos.map(odontologo => (
                                    <option key={odontologo.id_odontologo} value={odontologo.id_odontologo}>
                                        {odontologo.nombre_completo}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.id_odontologo}</FormErrorMessage>
                        </FormControl>

                        <Button mt={4} colorScheme="blue" type="submit">Guardar</Button>
                        <Button mt={4} ml={4} onClick={onClose}>Cancelar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditHistorialModal;
