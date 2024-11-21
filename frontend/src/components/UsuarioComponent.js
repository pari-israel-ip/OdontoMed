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
                
                <Button as="label" colorScheme="teal" >Cargar Historial (JSON)
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
                                        icon={<InfoIcon />}
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
