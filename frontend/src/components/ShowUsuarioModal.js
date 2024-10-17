import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Box
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';  
import usuarioService from '../services/usuarioService';
import EditUsuarioModal from './EditUsuarioModal';
import EditHistorialModal from './EditHistorialModal'; // Importa el componente de historial
import EditPacienteModal from './EditPacienteModal'; // Importa el componente de paciente

const ShowUsuarioModal = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditHistorialOpen, setIsEditHistorialOpen] = useState(false);
    const [isEditPacienteOpen, setIsEditPacienteOpen] = useState(false);
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const { id } = useParams();  
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await usuarioService.getUsuario(id);
                setUsuario(response.data);
            } catch (error) {
                console.error('Error fetching usuario:', error);
            }
        };

        fetchUsuario();
    }, [id]);

    const loadUsuarios = async () => {
        try {
            const response = await usuarioService.getUsuario(id);
            setUsuario(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    };

    

    const handleEdit = () => {
        setIsEditModalOpen(true);
        loadUsuarios();
    };

    const handleEditHistorial = (historial) => {
        setSelectedHistorial(historial); // Guardar el historial seleccionado para editar
        setIsEditHistorialOpen(true);
        loadUsuarios();
    };

    const handleEditPaciente = () => {
        setIsEditPacienteOpen(true);
        loadUsuarios();
    };
    const onClose = () => {
        navigate('/usuarios');  // Redirige a la lista de usuarios cuando se cierra el modal
    };

    if (!usuario) {
        return null; // Puedes agregar un loader aquí si lo prefieres
    }
    return (
        <>
            <Modal isOpen={!!usuario} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Detalles del Paciente</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text><strong>Nombre Completo:</strong> {usuario.nombre_completo}</Text>
                        <Text><strong>CI:</strong> {usuario.ci}</Text>
                        <Text><strong>Fecha de Nacimiento:</strong> {usuario.fecha_nacimiento}</Text>
                        <Text><strong>Correo Electrónico:</strong> {usuario.email}</Text>
                        <Text><strong>Dirección:</strong> {usuario.direccion}</Text>
                        <Text><strong>Teléfono:</strong> {usuario.telefono}</Text>

                        <Button colorScheme="blue" mt={4} onClick={handleEdit}>
                            Editar Datos Personales
                        </Button>

                        <Text mt={4}><strong>Seguro Médico:</strong> {usuario.seguro_medico}</Text>
                        <Text><strong>Alergias:</strong> {usuario.alergias}</Text>
                        <Text><strong>Antecedentes Médicos:</strong> {usuario.antecedentes_medicos}</Text>
                        <Button colorScheme="green" mt={4} onClick={handleEditPaciente}>
                            Editar Paciente
                        </Button>

                        <Text mt={4}><strong>Historial Clínico:</strong></Text>
                        {usuario.historiales.map(historial => (
                            <div key={historial.id_historial}>
                                <Text>Fecha: {historial.fecha_hora_creacion}</Text>
                                <Text>Notas: {historial.notas_generales}</Text>
                                <Button colorScheme="yellow" onClick={() => handleEditHistorial(historial)}>
                                    Editar Historial
                                </Button>
                            </div>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {isEditModalOpen && (
                <EditUsuarioModal usuario={usuario} onClose={() => setIsEditModalOpen(false)} 
                onSave={(updatedUser) => {
                    setIsEditModalOpen(false);
                    loadUsuarios();

                }} />
            )}

            {isEditHistorialOpen && selectedHistorial && (
                <EditHistorialModal
                    historial={selectedHistorial}
                    onClose={() => setIsEditHistorialOpen(false)}
                    onSave={(updatedHistorial) => {
                        // Puedes actualizar el historial en el estado aquí si es necesario
                        setIsEditHistorialOpen(false);
                        loadUsuarios();

                    }}
                />
            )}

            {isEditPacienteOpen && usuario && (
                <EditPacienteModal
                    paciente={usuario}
                    onClose={() => setIsEditPacienteOpen(false)}
                    onSave={(updatedPaciente) => {
                        // Puedes actualizar el paciente en el estado aquí si es necesario
                        setIsEditPacienteOpen(false);
                        loadUsuarios();
                    }}
                />
            )}
        </>
    );
};

export default ShowUsuarioModal;
