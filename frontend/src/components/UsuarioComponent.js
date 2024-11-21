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
import CreateUsuarioModal from './CreateUsuarioModal';

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

    // Calcular el rango de datos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const userRole = localStorage.getItem('role');

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>PACIENTES</Heading>
            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>
                    CREAR NUEVO PACIENTE
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
                                     {(userRole === 'ADMINISTRADOR'||userRole==='RECEPCIONISTA') &&<IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(usuario.id_paciente)}
                                    />}
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
