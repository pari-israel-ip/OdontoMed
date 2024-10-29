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
    Box, Grid
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';  
import usuarioService from '../services/usuarioService';
import EditUsuarioModal from './EditUsuarioModal';
import EditHistorialModal from './EditHistorialModal'; // Importa el componente de historial
import EditPacienteModal from './EditPacienteModal'; // Importa el componente de paciente
import CreateDiagnosticoModal from './CreateDiagnosticoModal';
import diagnosticoService from '../services/diagnosticoService'; // Importa el servicio de diagnóstico
import EditDiagnosticoModal from './EditDiagnosticoModal.js'; // Asegúrate de que la ruta sea correcta

const ShowUsuarioModal = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditHistorialOpen, setIsEditHistorialOpen] = useState(false);
    const [isEditPacienteOpen, setIsEditPacienteOpen] = useState(false);
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { id } = useParams();  
    const [usuario, setUsuario] = useState(null);
    const [idHistorial, setIdHistorial] = useState(null);  // Variable para guardar el id del historial
    const [diagnosticos, setDiagnosticos] = useState([]); // Estado para diagnosticos
    const [selectedDiagnostico, setSelectedDiagnostico] = useState(null); // Estado para el diagnóstico seleccionado
    const [isEditDiagnosticoOpen, setIsEditDiagnosticoOpen] = useState(false); // Estado para abrir el modal de editar diagnóstico

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

    const loadDiagnosticos = async (historialId) => {
        try {
            const response = await diagnosticoService.getDiagnosticoHistorial(historialId);
            setDiagnosticos(response.data); // Almacenar los diagnósticos en el estado
        } catch (error) {
            console.error('Error fetching diagnosticos:', error);
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

    const handleCreate = (idHistorial) => {
        setIsCreateModalOpen(true);
        setIdHistorial(idHistorial);
        loadDiagnosticos(idHistorial);
    };

    const handleEditDiagnostico = (diagnostico) => {
        setSelectedDiagnostico(diagnostico); // Guardar el diagnóstico seleccionado para editar
        setIsEditDiagnosticoOpen(true);

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
                    <ModalHeader>Historial Odontologico del Paciente</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Grid templateColumns="1fr 1fr" gap={4}>
                    <Box>
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
                                <Button colorScheme="teal" onClick={() => handleCreate(historial.id_historial)} >
                                    Crear Nuevo Diagnóstico
                                </Button>

                                {/* Mostrar los diagnósticos asociados al historial */}
                                {diagnosticos.length > 0 && (
                                    <Box mt={4}>
                                        <Text><strong>Diagnósticos:</strong></Text>
                                        {diagnosticos.map(diagnostico => (
                                            <Box key={diagnostico.id_diagnostico} p={2} border="1px solid teal" borderRadius="md">
                                                <Text><strong>Nombre:</strong> {diagnostico.nombre_diagnostico}</Text>
                                                <Text><strong>Fceha:</strong> {diagnostico.fecha_diagnostico}</Text>
                                                <Text><strong>Descripción:</strong> {diagnostico.descripcion}</Text>
                                                <Button colorScheme="purple" onClick={() => handleEditDiagnostico(diagnostico)}>
                                                    Editar Diagnóstico
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                            </div>
                        ))}
                        </Box>
                            <Box>
                                {/* Aquí puedes agregar cualquier contenido adicional que quieras mostrar en la columna de la derecha */}
                                <Text>Esta es la columna de la derecha, puedes agregar información adicional aquí.</Text>
                                {/* Puedes añadir más elementos según lo que necesites mostrar */}
                            </Box>
                        </Grid>
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
            {/* Modal de creación de diagnóstico */}
            {isCreateModalOpen && (
                <CreateDiagnosticoModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    idHistorial={idHistorial}  // Enviar idHistorial para la creación
                    onDiagnosticoCreated={loadUsuarios}
                    onCreated={() => {setIsCreateModalOpen(false);
                    }}
                    
                />
            )}
            {/* Modal de edición de diagnóstico */}
            {isEditDiagnosticoOpen && selectedDiagnostico && (
                <EditDiagnosticoModal
                    diagnostico={selectedDiagnostico}
                    onClose={() => setIsEditDiagnosticoOpen(false)}
                    onSave={() => {
                        setIsEditDiagnosticoOpen(false);
                    }}
                />
            )}

        </>
    );
};

export default ShowUsuarioModal;
