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
    Box, Grid, IconButton, useToast, Select, Flex,Spinner,Center
} from '@chakra-ui/react';
import {  DeleteIcon } from '@chakra-ui/icons';
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
    const toast = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const diagnosticosPerPage = 3;
    const [isLoading, setIsLoading] = useState(true); // Estado de carga inicializado en true


    // Calcular diagnósticos actuales a mostrar
    const indexOfLastDiagnostico = currentPage * diagnosticosPerPage;
    const indexOfFirstDiagnostico = indexOfLastDiagnostico - diagnosticosPerPage;
    const currentDiagnosticos = diagnosticos.length > 0 
    ? diagnosticos.slice(indexOfFirstDiagnostico, indexOfLastDiagnostico) 
    : [];    
    const [currentTratamientosPage, setCurrentTratamientosPage] = useState(1);
    const [currentPrescripcionesPage, setCurrentPrescripcionesPage] = useState(1);
    const itemsPerPage = 4;

    // Paginación de tratamientos
    const indexOfLastTratamiento = currentTratamientosPage * itemsPerPage;
    const indexOfFirstTratamiento = indexOfLastTratamiento - itemsPerPage;
    const currentTratamientos = tratamientos.length > 0 
    ? tratamientos.slice(indexOfFirstTratamiento, indexOfLastTratamiento) 
    : [];
    // Paginación de prescripciones
    const indexOfLastPrescripcion = currentPrescripcionesPage * itemsPerPage;
    const indexOfFirstPrescripcion = indexOfLastPrescripcion - itemsPerPage;
    const currentPrescripciones = prescripciones.length > 0 
    ? prescripciones.slice(indexOfFirstPrescripcion, indexOfLastPrescripcion) 
    : [];
    // Cambiar de página
    const handleNextTratamientosPage = () => {
        if (currentTratamientosPage < Math.ceil(tratamientos.length / itemsPerPage)) {
            setCurrentTratamientosPage(currentTratamientosPage + 1);
        }
    };

    const handlePreviousTratamientosPage = () => {
        if (currentTratamientosPage > 1) {
            setCurrentTratamientosPage(currentTratamientosPage - 1);
        }
    };

    const handleNextPrescripcionesPage = () => {
        if (currentPrescripcionesPage < Math.ceil(prescripciones.length / itemsPerPage)) {
            setCurrentPrescripcionesPage(currentPrescripcionesPage + 1);
        }
    };

    const handlePreviousPrescripcionesPage = () => {
        if (currentPrescripcionesPage > 1) {
            setCurrentPrescripcionesPage(currentPrescripcionesPage - 1);
        }
    };
    // Cambiar de página
    const handleNextPage = () => {
        if (currentPage < Math.ceil(diagnosticos.length / diagnosticosPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
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
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
    
                    // Datos del usuario, paciente y historial clínico
                    const usuarioData = {
                        nombres: data.usuario.nombres.trim().toUpperCase(),
                        apellidos: data.usuario.apellidos.trim().toUpperCase(),
                        ci: data.usuario.ci.trim(),
                        fecha_nacimiento: data.usuario.fecha_nacimiento,
                        email: data.usuario.email.trim().toUpperCase(),
                        direccion: data.usuario.direccion.trim().toUpperCase(),
                        telefono: data.usuario.telefono.trim(),
                        contrasenia: data.usuario.contrasenia,
                        seguro_medico: data.usuario.seguro_medico.trim().toUpperCase(),

                        alergias: data.usuario.alergias.trim().toUpperCase(),
                        antecedentes_medicos: data.usuario.antecedentes_medicos.trim().toUpperCase(),
                        id_odontologo: data.historial_clinico.id_odontologo, // ID del odontólogo
                        notas_generales: data.historial_clinico.notas_generales.trim().toUpperCase()
                    };
    
                    // Realizar la solicitud de creación al backend
                    try {
                        
                        const response = await usuarioService.createUsuario(usuarioData);
                        console.log('Paciente creado correctamente:', response.data);
                
                        // Obtener el id_historial utilizando el email del usuario recién creado
                        const userResponse = await usuarioService.getIDPorEmail(data.usuario.email);
                        console.log('ID USUARIO:', userResponse.data.id_usuario);
                
                        // Asumimos que el backend devuelve el id_historial asociado al usuario creado
                        const historialId = userResponse.data.id_historial; // ID del historial clínico
                
                        // Ahora puedes usar historialId para asociarlo con otros objetos o realizar más operaciones
                        console.log('ID Historial:', historialId);
    
                        // Crear diagnósticos
                        if (data.diagnosticos && data.diagnosticos.length > 0) {
                            for (const diagnostico of data.diagnosticos) {
                                const diagnosticoData = {
                                    ...diagnostico,
                                    id_historial: historialId // Asociar al historial clínico creado
                                };
                                await diagnosticoService.createDiagnostico(diagnosticoData);
                            }
                        }
    
                        // Crear tratamientos
                        if (data.tratamientos && data.tratamientos.length > 0) {
                            for (const tratamiento of data.tratamientos) {
                                const tratamientoData = {
                                    ...tratamiento,
                                    id_historial: historialId // Asociar al historial clínico creado
                                };
                                await tratamientoService.createTratamiento(tratamientoData);
                            }
                        }
    
                        // Crear prescripciones
                        if (data.prescripciones && data.prescripciones.length > 0) {
                            for (const prescripcion of data.prescripciones) {
                                const prescripcionData = {
                                    ...prescripcion,
                                    id_historial: historialId // Asociar al historial clínico creado
                                };
                                await prescripcionService.createPrescripcion(prescripcionData);
                            }
                        }
    
                        console.log('Usuario, historial clínico y registros asociados subidos exitosamente');
                    } catch (error) {
                        if (error.response && error.response.data.errors) {
                            // Si el backend devuelve errores de validación, los mostramos en consola
                            console.error('Errores de validación:', error.response.data.errors);
                        } else {
                            console.error('Error al crear el usuario:', error);
                        }
                    }
                } catch (error) {
                    console.error('Error al procesar el archivo JSON:', error);
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
            }finally{
                setIsLoading(false);
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
                toast({
                    title: "Diagnostico eliminado.",
                    description: "El diagnostico ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error deleting diagnostico:', error);
                toast({
                    title: 'Error al eliminar diagnóstico.',
                    description: error.response?.data?.error || 'Ocurrió un error inesperado.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const handleDeleteTratamiento = async (id_tratamiento) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este diagnostico?");
        if (confirmDelete) {
            try {
                
                await tratamientoService.deleteTratamiento(id_tratamiento);
                loadTratamientos(idHistorial);
                toast({
                    title: "Tratamiento eliminado.",
                    description: "El tratamiento ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error deleting diagnostico:', error);
                toast({
                    title: 'Error al eliminar Tratamieto.',
                    description: error.response?.data?.error || 'Ocurrió un error inesperado.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleDeletePrescripcion = async (id_medicamento) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta prescripcion?");
        if (confirmDelete) {
            try {
                await prescripcionService.deletePrescripcion(id_medicamento);
                loadPrescripciones(idHistorial);
                toast({
                    title: "Medicamento eliminado.",
                    description: "El medicamento ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
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
  
    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }
    return (
        <>
            <Modal isOpen={!!usuario} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">HISTORIAL ODONTOLOGICO DEL PACIENTE</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="1fr 1fr" gap={6}>
            <Box
              border="1px solid #319795"
              borderRadius="lg"
              p={5}
              boxShadow="sm"
              bg="white"
            >
              <Text fontSize="xl" mb={4}><strong>Nombre Completo:</strong> {usuario.nombre_completo}</Text>
              <Text><strong>CI:</strong> {usuario.ci}</Text>
              <Text><strong>Fecha de Nacimiento:</strong> {usuario.fecha_nacimiento}</Text>
              <Text><strong>Correo Electrónico:</strong> {usuario.email}</Text>
              <Text><strong>Dirección:</strong> {usuario.direccion}</Text>
              <Text><strong>Teléfono:</strong> {usuario.telefono}</Text>
              <Button colorScheme="blue" mt={4} onClick={handleEdit}>Editar Datos Personales</Button>
            </Box>

            <Box
              border="1px solid #319795"
              borderRadius="lg"
              p={5}
              boxShadow="sm"
              bg="white"
            >
              <Text fontSize="xl" mb={4}><strong>Seguro Médico:</strong> {usuario.seguro_medico}</Text>
              <Text><strong>Alergias:</strong> {usuario.alergias}</Text>
              <Text><strong>Antecedentes Médicos:</strong> {usuario.antecedentes_medicos}</Text>
              <Button colorScheme="green" mt={4} onClick={handleEditPaciente}>Editar Datos del Paciente</Button>
            </Box>
          </Grid>

          <Text fontSize="2xl" mt={6}><strong>Historial Clínico:</strong></Text>
          {usuario.historiales.map(historial => (
            <Box key={historial.id_historial} border="1px solid #319795" borderRadius="lg" p={4} mt={4} bg="white">
              <Text><strong>Fecha:</strong> {historial.fecha_hora_creacion}</Text>
              <Text><strong>Notas:</strong> {historial.notas_generales}</Text>
              <Flex justify="space-between" mt={4}>
                <Button colorScheme="yellow" onClick={() => handleEditHistorial(historial)}>Editar Datos del Historial</Button>
                <Button colorScheme="teal" onClick={() => handleCreate(historial.id_historial)}>Crear Nuevo Diagnóstico</Button>
              </Flex>

              <Text fontSize="lg" mt={4}><strong>Diagnósticos:</strong></Text>
              {currentDiagnosticos.map(diagnostico => (
                <Box key={diagnostico.id_diagnostico} border="1px solid teal" borderRadius="md" p={4} mt={2} bg="gray.50">
                  <Text><strong>Nombre:</strong> {diagnostico.nombre_diagnostico}</Text>
                  <Text><strong>Fecha:</strong> {diagnostico.fecha_diagnostico}</Text>
                  <Text><strong>Descripción:</strong> {diagnostico.descripcion}</Text>
                  <Button colorScheme="purple" onClick={() => handleEditDiagnostico(diagnostico)} mr={2}>Editar Diagnóstico</Button>
                  <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleDeleteDiagnostico(diagnostico.id_diagnostico)} />
                </Box>
              ))}
            </Box>
          ))}
          
          <Flex justify="space-between" align="center" mt={6}>
            <Button colorScheme="teal" onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</Button>
            <Box>PAGINA {currentPage} DE {Math.ceil(diagnosticos.length / diagnosticosPerPage)}</Box>
            <Button colorScheme="teal" onClick={handleNextPage} disabled={currentPage === Math.ceil(diagnosticos.length / diagnosticosPerPage)}>Siguiente</Button>
          </Flex>

          <Box mt={6} border="1px solid #319795" borderRadius="lg" p={5} bg="white">
            <Select onChange={(e) => setSelectedFormat(e.target.value)} value={selectedFormat}>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="pdf">PDF</option>
            </Select>
            <Button colorScheme="blue" mt={4} onClick={() => downloadHistorial(selectedFormat)}>Descargar Historial</Button>
            <Button as="label" colorScheme="teal" mt={4}>Cargar Historial (JSON)
              <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
            </Button>
          </Box>

          <Flex mt={4} gap={6}>
  {/* Tratamientos */}
  <Box flex="1" border="1px solid #319795" borderRadius="lg" p={5} bg="white">
    <Button colorScheme="green" mt={4} onClick={() => setIsCreateTratamientoOpen(true)}>Crear Nuevo Tratamiento</Button>
    <Text><strong>Tratamientos:</strong></Text>
    {currentTratamientos.map(tratamiento => (
      <Box key={tratamiento.id_tratamiento} p={4} border="1px solid teal" borderRadius="md" mt={2} bg="gray.50">
        <Text><strong>Nombre:</strong> {tratamiento.nombre_tratamiento}</Text>
        <Text><strong>Fecha:</strong> {tratamiento.fecha_tratamiento}</Text>
        <Text><strong>Descripción:</strong> {tratamiento.descripcion}</Text>
        <Text><strong>Estado:</strong> {tratamiento.estado_tratamiento.toUpperCase()}</Text>
        <Button colorScheme="cyan" onClick={() => handleEditTratamiento(tratamiento)} mr={2}>Editar Tratamiento</Button>
        <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleDeleteTratamiento(tratamiento.id_tratamiento)} />
      </Box>
    ))}
    {/* Paginación de Tratamientos */}
    <Flex justify="space-between" align="center" mt={6}>
      <Button colorScheme="teal" onClick={handlePreviousTratamientosPage} disabled={currentTratamientosPage === 1}>Anterior</Button>
      <Box>PAGINA {currentTratamientosPage} DE {Math.ceil(tratamientos.length / itemsPerPage)}</Box>
      <Button colorScheme="teal" onClick={handleNextTratamientosPage} disabled={currentTratamientosPage === Math.ceil(tratamientos.length / itemsPerPage)}>Siguiente</Button>
    </Flex>
  </Box>

  {/* Prescripciones */}
  <Box flex="1" border="1px solid #319795" borderRadius="lg" p={5} bg="white">
    <Button colorScheme="blue" mt={4} onClick={handleCreatePrescription}>Crear Nueva Prescripción</Button>
    <Text><strong>Prescripciones:</strong></Text>
    {currentPrescripciones.map(prescripcion => (
      <Box key={prescripcion.id_medicamento} p={4} border="1px solid teal" borderRadius="md" mt={2} bg="gray.50">
        <Text><strong>Medicamento:</strong> {prescripcion.nombre_medicamento}</Text>
        <Text><strong>Dosis:</strong> {prescripcion.dosis}</Text>
        <Text><strong>Inicio:</strong> {prescripcion.fecha_inicio}</Text>
        <Text><strong>Fin:</strong> {prescripcion.fecha_fin}</Text>
        <Button colorScheme="cyan" onClick={() => handleEditPrescripcion(prescripcion)} mr={2}>Editar Prescripción</Button>
        <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleDeletePrescripcion(prescripcion.id_medicamento)} />
      </Box>
    ))}
    {/* Paginación de Prescripciones */}
    <Flex justify="space-between" align="center" mt={6}>
      <Button colorScheme="teal" onClick={handlePreviousPrescripcionesPage} disabled={currentPrescripcionesPage === 1}>Anterior</Button>
      <Box>PAGINA {currentPrescripcionesPage} DE {Math.ceil(prescripciones.length / itemsPerPage)}</Box>
      <Button colorScheme="teal" onClick={handleNextPrescripcionesPage} disabled={currentPrescripcionesPage === Math.ceil(prescripciones.length / itemsPerPage)}>Siguiente</Button>
    </Flex>
  </Box>
</Flex>

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