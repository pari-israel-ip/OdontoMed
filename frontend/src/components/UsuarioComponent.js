import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Flex,
    useToast,
    Input,
    Spinner, Center
} from '@chakra-ui/react';
import {  DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '@chakra-ui/icons';
import usuarioService from '../services/usuarioService';
import diagnosticoService from '../services/diagnosticoService';
import tratamientoService from '../services/tratamientoService';
import prescripcionService from '../services/prescripcionService';
import CreateUsuarioModal from './CreateUsuarioModal';
import ConPermiso from './ConPermiso';
const UsuariosComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); // Estado de carga para detalles del odontólogo


    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setIsLoading(true); // Finaliza el estado de carga

            const response = await usuarioService.getUsuarios();
            setUsuarios(response.data);
            setFilteredUsuarios(response.data); // Inicialmente sin filtro
        } catch (error) {
            console.error('Error fetching usuarios:', error);
        }
        finally{
            setIsLoading(false); // Finaliza el estado de carga

        }
    };

    const handleDelete = async (id_usuario) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este Paciente?");
        if (confirmDelete) {
            try {
                await usuarioService.deleteUsuario(id_usuario);
                loadUsuarios();
                toast({
                    title: "Paciente eliminado.",
                    description: "El paciente ha sido eliminado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error deleting usuario:', error);
            }
        }
    };

    const handleCreate = (newUsuario) => {
        setUsuarios((prevUsuarios) => [...prevUsuarios, newUsuario]);
        setFilteredUsuarios((prevUsuarios) => [...prevUsuarios, newUsuario]);
        setIsCreateModalOpen(false);
    };

    const handleShow = (usuarioId) => {
        setIsLoading(true); // Finaliza el estado de carga
        try {
            navigate(`/usuarios/${usuarioId}`);
        } 
        finally{
            setIsLoading(false); // Finaliza el estado de carga
        }
        
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const searchTermLower = e.target.value.toLowerCase();
    
        const filtered = usuarios.filter((usuario) =>
            usuario.nombre_completo.toLowerCase().includes(searchTermLower) ||
            usuario.ci.toString().toLowerCase().includes(searchTermLower) ||
            usuario.seguro_medico.toString().toLowerCase().includes(searchTermLower) ||
            usuario.fecha_nacimiento.toString().toLowerCase().includes(searchTermLower) ||
            usuario.email.toLowerCase().includes(searchTermLower)
        );
    
        setFilteredUsuarios(filtered);
        setCurrentPage(1); // Resetear a la primera página tras filtrar
    };
  

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
    
                    // Validación del objeto JSON antes de procesar
                    if (!data.usuario || !data.historial_clinico) {
                        return toast({
                            title: "Error en el archivo",
                            description: "Faltan datos del usuario o historial clínico en el archivo JSON.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
    
                    // Preparar datos del usuario
                    const usuarioData = {
                        nombres: data.usuario.nombres?.trim().toUpperCase() || "SIN NOMBRE",
                        apellidos: data.usuario.apellidos?.trim().toUpperCase() || "SIN APELLIDO",
                        ci: data.usuario.ci?.trim(),
                        fecha_nacimiento: data.usuario.fecha_nacimiento,
                        email: data.usuario.email?.trim().toUpperCase(),
                        direccion: data.usuario.direccion?.trim().toUpperCase(),
                        telefono: data.usuario.telefono?.trim(),
                        contrasenia: data.usuario.contrasenia,
                        seguro_medico: data.usuario.seguro_medico?.trim().toUpperCase(),
                        alergias: data.usuario.alergias?.trim().toUpperCase(),
                        antecedentes_medicos: data.usuario.antecedentes_medicos?.trim().toUpperCase(),
                        id_odontologo: data.historial_clinico.id_odontologo,
                        notas_generales: data.historial_clinico.notas_generales?.trim().toUpperCase(),
                    };
    
                    // Crear usuario e historial clínico
                    try {
                        const response = await usuarioService.createUsuario(usuarioData);
                        console.log("Paciente creado correctamente:", response.data);
    
                        const userResponse = await usuarioService.getIDPorEmail(data.usuario.email);
                        console.log("ID USUARIO:", userResponse.data.id_usuario);
    
                        const historialId = userResponse.data.id_historial;
                        console.log("ID Historial:", historialId);
    
                        // Validación y creación de diagnósticos
                        if (data.diagnosticos && data.diagnosticos.length > 0) {
                            for (const diagnostico of data.diagnosticos) {
                                if (!diagnostico.nombre || !diagnostico.descripcion) {
                                    toast({
                                        title: "Error en diagnóstico",
                                        description: "Faltan campos obligatorios en los diagnósticos. Revisa el archivo JSON.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    continue;
                                }
                                const diagnosticoData = {
                                    ...diagnostico,
                                    id_historial: historialId,
                                };
                                await diagnosticoService.createDiagnostico(diagnosticoData);
                            }
                        }
    
                        // Validación y creación de tratamientos
                        if (data.tratamientos && data.tratamientos.length > 0) {
                            for (const tratamiento of data.tratamientos) {
                                if (!tratamiento.nombre || !tratamiento.duracion) {
                                    toast({
                                        title: "Error en tratamiento",
                                        description: `Faltan campos obligatorios en el tratamiento ${tratamiento.nombre || "sin nombre"}.`,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    continue;
                                }
                                const tratamientoData = {
                                    ...tratamiento,
                                    id_historial: historialId,
                                };
                                await tratamientoService.createTratamiento(tratamientoData);
                            }
                        }
    
                        // Validación y creación de prescripciones
                        if (data.prescripciones && data.prescripciones.length > 0) {
                            for (const prescripcion of data.prescripciones) {
                                if (!prescripcion.medicamento || !prescripcion.dosis) {
                                    toast({
                                        title: "Error en prescripción",
                                        description: `Faltan campos obligatorios en la prescripción del medicamento ${prescripcion.medicamento || "sin nombre"}.`,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    continue;
                                }
                                const prescripcionData = {
                                    ...prescripcion,
                                    id_historial: historialId,
                                };
                                await prescripcionService.createPrescripcion(prescripcionData);
                            }
                        }
    
                        toast({
                            title: "Importación exitosa",
                            description: "El usuario, historial clínico y sus registros asociados fueron creados correctamente.",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                    } catch (error) {
                        if (error.response && error.response.data.errors) {
                            toast({
                                title: "Error al importar datos",
                                description: "Ocurrieron errores en la validación del servidor. Por favor, revisa los datos.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        } else {
                            toast({
                                title: "Error en el servidor",
                                description: "Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                    }
                } catch (error) {
                    toast({
                        title: "Archivo no válido",
                        description: "El archivo seleccionado no es un JSON válido. Por favor, revisa su formato.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            };
            reader.readAsText(file);
        } else {
            toast({
                title: "Archivo no seleccionado",
                description: "Por favor, selecciona un archivo JSON para continuar.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    
    
    // Calcular el rango de datos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const userRole = localStorage.getItem('role');

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>PACIENTES</Heading>
            <ConPermiso permiso="Crear Paciente">
            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>
                    CREAR NUEVO PACIENTE
                </Button>

                </ConPermiso>
                
                <Button as="label" colorScheme="teal" >CARGAR HISTORIAL (JSON)
              <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
            </Button>
            <Flex justify="space-between" mb={4}>
                
                <Input
                    placeholder="BUSCAR PACIENTE..."
                    value={searchTerm}
                    onChange={handleSearch}
                    ml={4}
                    marginTop={4}
                />
            </Flex>
            {isLoading ? ( // Mostrar spinner mientras se cargan los detalles
                <Center mt={4}>
                    <Spinner size="xl" color="teal.500" />
                </Center>
            ) : (
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>NOMBRE COMPLETO</Th>
                        <Th>CI</Th>
                        <Th>CORREO ELECTRONICO</Th>
                        <Th>FECHA DE NACIMIENTO</Th>
                        <Th>CODIGO DE SEGURO MEDICO</Th>
                        <Th>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {currentUsuarios.map((usuario) => (
                        <Tr key={usuario.id_paciente}>
                            <Td>{usuario.nombre_completo}</Td>
                            <Td>{usuario.ci}</Td>
                            <Td>{usuario.email}</Td>
                            <Td>{usuario.fecha_nacimiento}</Td>
                            <Td>{usuario.seguro_medico}</Td>
                            <Td>
                                <Flex justify="space-between">
                                
                                <IconButton
    icon={<SettingsIcon />}
    colorScheme="cyan"
    size="sm"
    onClick={() => handleShow(usuario.id_paciente)}
    mr={2}
/>


                                     <ConPermiso permiso="Eliminar Paciente">
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(usuario.id_paciente)}
                                    /></ConPermiso>
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table> )}

            <Flex justify="space-between" align="center" mt={4} >
                <Button colorScheme="teal"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    ANTERIOR
                </Button>
                <Box>PAGINA {currentPage} DE {totalPages}</Box>
                <Button colorScheme="teal"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    SIGUIENTE
                </Button>
            </Flex>

            {isCreateModalOpen && (
                <CreateUsuarioModal
                    onClose={() => { setIsCreateModalOpen(false); loadUsuarios(); }}
                    onCreate={handleCreate}
                />
            )}
        </Box>
    );
};

export default UsuariosComponent;
