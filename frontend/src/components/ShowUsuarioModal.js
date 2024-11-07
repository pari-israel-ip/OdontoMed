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
    Box, Grid, IconButton,Select
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import jsPDF from 'jspdf';
import { useParams, useNavigate } from 'react-router-dom';  
import usuarioService from '../services/usuarioService';
import EditUsuarioModal from './EditUsuarioModal';
import EditHistorialModal from './EditHistorialModal'; 
import EditPacienteModal from './EditPacienteModal'; 
import CreateDiagnosticoModal from './CreateDiagnosticoModal';
import diagnosticoService from '../services/diagnosticoService'; 
import EditDiagnosticoModal from './EditDiagnosticoModal.js'; 
import CreateTratamientoModal from './CreateTratamientoModal.js'
import tratamientoService from '../services/tratamientoService.js';
import EditTratamientoModal from './EditTratamientoModal.js';
import CreatePrescriptionModal from './CreatePrescriptionModal';
import prescripcionService from '../services/prescripcionService.js'
import EditPrescriptionModal from './EditPrescriptionModal.js';


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
    const [tratamientos, setTratamientos] = useState([]); // Estado para diagnosticos
    const [prescripciones, setPrescripciones] = useState([]); // Estado para diagnosticos
    const [selectedTratamiento, setSelectedTratamiento] = useState(null);
    const [selectedPrescripcion, setSelectedPrescripcion] = useState(null);
    const [selectedDiagnostico, setSelectedDiagnostico] = useState(null); // Estado para el diagnóstico seleccionado
    const [isEditDiagnosticoOpen, setIsEditDiagnosticoOpen] = useState(false); // Estado para abrir el modal de editar diagnóstico
    const [isCreateTratamientoOpen, setIsCreateTratamientoOpen] = useState(false);
    const [isEditTratamientoOpen, setIsEditTratamientoOpen] = useState(false); // Estado para abrir el modal de editar diagnóstico
    const [isCreatePrescriptionOpen, setIsCreatePrescriptionOpen] = useState(false); // Estado para modal de prescripción
    const [isEditPrescripcionOpen, setIsEditPrescripcionOpen] = useState(false); // Estado para abrir el modal de editar diagnóstico
    const downloadHistorial = (format) => {
        const data = {
            usuario: {
                nombre_completo: usuario.nombre_completo,
                ci: usuario.ci,
                fecha_nacimiento: usuario.fecha_nacimiento,
                email: usuario.email,
                direccion: usuario.direccion,
                telefono: usuario.telefono,
                seguro_medico: usuario.seguro_medico,
                alergias: usuario.alergias,
                antecedentes_medicos: usuario.antecedentes_medicos,
            },
            diagnosticos,
            tratamientos,
            prescripciones,
        };
    
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `historial_${usuario.nombre_completo}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (format === 'xml') {
            const xmlData = `
                <historial>
                    <usuario>
                        <nombre_completo>${usuario.nombre_completo}</nombre_completo>
                        <ci>${usuario.ci}</ci>
                        <fecha_nacimiento>${usuario.fecha_nacimiento}</fecha_nacimiento>
                        <email>${usuario.email}</email>
                        <direccion>${usuario.direccion}</direccion>
                        <telefono>${usuario.telefono}</telefono>
                        <seguro_medico>${usuario.seguro_medico}</seguro_medico>
                        <alergias>${usuario.alergias}</alergias>
                        <antecedentes_medicos>${usuario.antecedentes_medicos}</antecedentes_medicos>
                    </usuario>
                    <!-- Agregar diagnosticos, tratamientos y prescripciones en XML -->
                </historial>
            `;
            const blob = new Blob([xmlData], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `historial_${usuario.nombre_completo}.xml`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.text(`Historial Odontológico de ${usuario.nombre_completo}`, 10, 10);
            doc.text(`CI: ${usuario.ci}`, 10, 20);
            // Agrega más detalles como diagnóstico, tratamientos y prescripciones
            doc.save(`historial_${usuario.nombre_completo}.pdf`);
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    // Aquí podrías hacer algo con los datos JSON cargados
                    console.log(json);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await usuarioService.getUsuario(id);
                setUsuario(response.data);
                if (response.data.historiales && response.data.historiales.length > 0) {
                    const historialId = response.data.historiales[0].id_historial;
                    await loadDiagnosticos(historialId);
                    await loadTratamientos(historialId); 
                    await loadPrescripciones(historialId);// Llama a loadDiagnosticos con el primer historial
                    setIdHistorial(historialId);
                }
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
            setDiagnosticos({});
        }
    };

    const loadTratamientos = async (historialId) => {
        try {
            const response = await tratamientoService.getTratamientosHistorial(historialId);
            setTratamientos(response.data); 
        } catch (error) {
            console.error('Error fetching tratamientos:', error);
            setTratamientos({});
        }
    };
    const loadPrescripciones = async (historialId) => {
        try {
            const response = await prescripcionService.getPrescripcionHistorial(historialId);
            setPrescripciones(response.data); 
        } catch (error) {
            console.error('Error fetching prescripciones:', error);
            setPrescripciones({});
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

    const handleCreateTratamiento = (idHistorial) => {
        setIsCreateTratamientoOpen(true);
        setIdHistorial(idHistorial);
        //loadDiagnosticos(idHistorial);
    };
    const handleCreatePrescription = () => {
        setIsCreatePrescriptionOpen(true);
    };
    const handleEditTratamiento = (tratamiento) => {
        setSelectedTratamiento(tratamiento); // Guardar el tratamiento seleccionado para editar
        setIsEditTratamientoOpen(true);
    };

    const handleEditPrescripcion = (prescripcion) => {
        setSelectedPrescripcion(prescripcion);
        //console.log(prescripcion);
        setIsEditPrescripcionOpen(true); // Abre el modal
    };
    

    const handleDeleteDiagnostico = async (id_diagnostico) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este diagnostico?");
        if (confirmDelete) {
            try {
                await diagnosticoService.deleteDiagnostico(id_diagnostico);
                loadDiagnosticos(idHistorial);
            } catch (error) {
                console.error('Error deleting diagnostico:', error);
            }
        }
    };

    const handleDeleteTratamiento = async (id_tratamiento) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este diagnostico?");
        if (confirmDelete) {
            try {
                await tratamientoService.deleteTratamiento(id_tratamiento);
                loadTratamientos(idHistorial);
            } catch (error) {
                console.error('Error deleting diagnostico:', error);
            }
        }
    };

    const handleDeletePrescripcion = async (id_medicamento) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta prescripcion?");
        if (confirmDelete) {
            try {
                await prescripcionService.deletePrescripcion(id_medicamento);
                loadPrescripciones(idHistorial);
            } catch (error) {
                console.error('Error deleting diagnostico:', error);
            }
        }
    };


    const onClose = () => {
        navigate('/usuarios');  // Redirige a la lista de usuarios cuando se cierra el modal
    };
    const [selectedFormat, setSelectedFormat] = useState('json');
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
                        <Select mt={4} onChange={(e) => setSelectedFormat(e.target.value)} value={selectedFormat}>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="pdf">PDF</option>
        </Select>
        <Button colorScheme="blue" mt={4} onClick={() => downloadHistorial(selectedFormat)}>
            Descargar Historial
        </Button>
                                <Button as="label" colorScheme="teal" mt={4}>
                                    Cargar Historial (JSON)
                                    <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
                                </Button>
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
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => handleDeleteDiagnostico(diagnostico.id_diagnostico)}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                            </div>
                        ))}
                        </Box>
                            <Box>
                                <Button colorScheme="green" onClick={() => setIsCreateTratamientoOpen(true)}>
                                    Crear Nuevo Tratamiento
                                </Button>
                                {tratamientos.length > 0 && (
                                    <Box mt={4}>
                                        <Text><strong>Tratamientos:</strong></Text>
                                        {tratamientos.map(tratamiento => (
                                            <Box key={tratamiento.id_tratamiento} p={2} border="1px solid teal" borderRadius="md">
                                                <Text><strong>Nombre:</strong> {tratamiento.nombre_tratamiento}</Text>
                                                <Text><strong>Fecha:</strong> {tratamiento.fecha_tratamiento}</Text>
                                                <Text><strong>Descripción:</strong> {tratamiento.descripcion}</Text>
                                                <Text><strong>Estado:</strong> {tratamiento.estado_tratamiento}</Text>
                                                <Button colorScheme="cyan" onClick={() => handleEditTratamiento(tratamiento)}>
                                                    Editar Tratamiento
                                                </Button>
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => handleDeleteTratamiento(tratamiento.id_tratamiento)}
                                                />
                                                
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                                <Button colorScheme="blue" mt={4} onClick={handleCreatePrescription}>
                                    Crear Nueva Prescripción
                                </Button>
                                {prescripciones.length > 0 && (
                                    <Box mt={4}>
                                        <Text><strong>Prescripciones:</strong></Text>
                                        {prescripciones.map(prescripcion => (
                                            <Box key={prescripcion.id_medicamento} p={2} border="1px solid teal" borderRadius="md">
                                                <Text><strong>Medicamento:</strong> {prescripcion.nombre_medicamento}</Text>
                                                <Text><strong>Dosis:</strong> {prescripcion.dosis}</Text>
                                                <Text><strong>Inicio:</strong> {prescripcion.fecha_inicio}</Text>
                                                <Text><strong>Fin:</strong> {prescripcion.fecha_fin}</Text>
                                                <Button colorScheme="cyan" onClick={() => handleEditPrescripcion(prescripcion)}>
                                                    Editar Prescripcion
                                                </Button>
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => handleDeletePrescripcion(prescripcion.id_medicamento)}
                                                />
                                                
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                            <Box>
                                
                            </Box>
                            
                        </Grid>
                    </ModalBody>
                </ModalContent>
            </Modal>

           
            {isCreatePrescriptionOpen && (
                <CreatePrescriptionModal
                    isOpen={isCreatePrescriptionOpen}
                    onClose={() => setIsCreatePrescriptionOpen(false)}
                    idHistorial={idHistorial}
                    onPrescriptionCreated={() => {
                        setIsCreatePrescriptionOpen(false);
                        loadPrescripciones(idHistorial);
                        // Aquí puedes actualizar la lista de prescripciones si es necesario
                    }}
                />
            )}

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
                        loadDiagnosticos(idHistorial)
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
                        loadDiagnosticos(idHistorial);
                    }}
                />
            )}
            {isCreateTratamientoOpen && (
                <CreateTratamientoModal
                    isOpen={isCreateTratamientoOpen}
                    onClose={() => setIsCreateTratamientoOpen(false)}
                    idHistorial={idHistorial}  // Enviar el historial correspondiente
                    onTratamientoCreated={loadUsuarios}
                    onCreated={() => {
                        setIsCreateTratamientoOpen(false);
                        loadTratamientos(idHistorial);
                    }}
                />
            )}
            {isEditTratamientoOpen && (
                <EditTratamientoModal 
                tratamiento={selectedTratamiento} 
                onClose={() => setIsEditTratamientoOpen(false)} 
                onSave={() => {
                    setIsEditTratamientoOpen(false);
                    loadTratamientos(idHistorial);
                }}/>
            )}

            {isEditPrescripcionOpen && (
                <EditPrescriptionModal 
                prescripcion={selectedPrescripcion} 
                onClose={() => setIsEditPrescripcionOpen(false)} 
                onSave={() => {
                    setIsEditPrescripcionOpen(false);
                    loadPrescripciones(idHistorial);

                }} />
            )}      

        </>
    );
};

export default ShowUsuarioModal;