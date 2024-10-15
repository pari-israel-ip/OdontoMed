// src/components/ShowUsuarioModal.js
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Button
} from '@chakra-ui/react';
import EditUsuarioModal from './EditUsuarioModal';
import EditHistorialModal from './EditHistorialModal'; // Importa el componente de historial
import EditPacienteModal from './EditPacienteModal'; // Importa el componente de paciente

const ShowUsuarioModal = ({ usuario, onClose }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditHistorialOpen, setIsEditHistorialOpen] = useState(false);
    const [isEditPacienteOpen, setIsEditPacienteOpen] = useState(false);
    const [selectedHistorial, setSelectedHistorial] = useState(null);

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleEditHistorial = (historial) => {
        setSelectedHistorial(historial); // Guardar el historial seleccionado para editar
        setIsEditHistorialOpen(true);
    };

    const handleEditPaciente = () => {
        setIsEditPacienteOpen(true);
    };

    return (
        <>
            <Modal isOpen={!!usuario} onClose={onClose}>
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
                <EditUsuarioModal usuario={usuario} onClose={() => setIsEditModalOpen(false)} onSave={onClose} />
            )}

            {isEditHistorialOpen && selectedHistorial && (
                <EditHistorialModal
                    historial={selectedHistorial}
                    onClose={() => setIsEditHistorialOpen(false)}
                    onSave={(updatedHistorial) => {
                        // Puedes actualizar el historial en el estado aquí si es necesario
                        setIsEditHistorialOpen(false);
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
                    }}
                />
            )}
        </>
    );
};

export default ShowUsuarioModal;
