import React, { useState } from 'react';
import axios from 'axios';
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
    List,
    ListItem,
    IconButton,
    FormErrorMessage, useToast
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

function CreatePrescriptionModal({ isOpen, onClose, idHistorial, onPrescriptionCreated }) {
    const [medicamento, setMedicamento] = useState({
        nombre_medicamento: '',
        dosis: '',
        fecha_fin: ''
    });
    const [listaMedicamentos, setListaMedicamentos] = useState([]);
    const [errorNombre, setErrorNombre] = useState('');
    const [errorFechaFin, setErrorFechaFin] = useState('');
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicamento({ ...medicamento, [name]: value });

        // Limpiar errores correspondientes al campo que se está modificando
        if (name === 'nombre_medicamento') {
            setErrorNombre('');
        }
        if (name === 'fecha_fin') {
            setErrorFechaFin('');
        }
    };

    const addMedicamento = () => {
        const { nombre_medicamento, fecha_fin } = medicamento;
        const nombreMedicamentoRegex = /^[A-Za-z0-9 ]{5,}$/; // Expresión regular para letras, números y espacios
        let hasError = false;

        // Validaciones
        if (!nombreMedicamentoRegex.test(nombre_medicamento)) {
            setErrorNombre('El nombre del medicamento debe tener al menos 5 caracteres y solo contener letras, números y espacios.');
            hasError = true;
        }

        // Validar la fecha
        const currentDate = new Date();
        const selectedDate = new Date(fecha_fin);
        const daysDifference = Math.ceil((selectedDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysDifference < 0 || daysDifference > 30) {
            setErrorFechaFin('La fecha fin debe estar entre hoy y los próximos 30 días.');
            hasError = true;
        }

        // Si hay errores, no se añade el medicamento
        if (hasError) {
            return;
        }

        setListaMedicamentos([...listaMedicamentos, medicamento]);
        setMedicamento({ nombre_medicamento: '', dosis: '', fecha_fin: '' });
    };

    const removeMedicamento = (index) => {
        setListaMedicamentos(listaMedicamentos.filter((_, i) => i !== index));
    };

    const handleSavePrescriptions = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/odomed/prescripcion/create/', {
                id_historial: idHistorial,
                prescripciones: listaMedicamentos,
            });
            toast({
                title: "Prescripcion creado.",
                description: "La prescripcion ha sido creado exitosamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onPrescriptionCreated();
            onClose();
            setListaMedicamentos([]);
        } catch (error) {
            console.error("Error al crear las prescripciones:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Prescripción</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4} isInvalid={!!errorNombre}>
                        <FormLabel>Nombre del Medicamento</FormLabel>
                        <Input
                            type="text"
                            name="nombre_medicamento"
                            value={medicamento.nombre_medicamento}
                            onChange={handleChange}
                            required
                        />
                        <FormErrorMessage>{errorNombre}</FormErrorMessage>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Dosis</FormLabel>
                        <Input
                            type="text"
                            name="dosis"
                            value={medicamento.dosis}
                            onChange={handleChange}
                            required
                        />
                    </FormControl>
                    <FormControl mb={4} isInvalid={!!errorFechaFin}>
                        <FormLabel>Fecha Fin</FormLabel>
                        <Input
                            type="date"
                            name="fecha_fin"
                            value={medicamento.fecha_fin}
                            onChange={handleChange}
                        />
                        <FormErrorMessage>{errorFechaFin}</FormErrorMessage>
                    </FormControl>
                    <Button colorScheme="teal" onClick={addMedicamento} mb={4}>
                        Añadir a la lista
                    </Button>
                    
                    <List spacing={3}>
                        {listaMedicamentos.map((med, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                {`${med.nombre_medicamento} - ${med.dosis} - ${med.fecha_fin}`}
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    ml="auto"
                                    onClick={() => removeMedicamento(index)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </ModalBody>
                <ModalCloseButton />
                <Button colorScheme="blue" onClick={handleSavePrescriptions} mt={4}>
                    Crear Prescripción
                </Button>
            </ModalContent>
        </Modal>
    );
}

export default CreatePrescriptionModal;
