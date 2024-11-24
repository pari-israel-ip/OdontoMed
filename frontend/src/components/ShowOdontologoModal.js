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
    Box,
    Grid,
    Spinner, // Importa Spinner de Chakra UI
    Center,Tabs, TabList, TabPanels, TabPanel, Tab,Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';  
import odontologoService from '../services/odontologoService';
import usuarioService from '../services/usuarioService';  // Servicio de usuario
import EditUsuarioModal from './EditUsuarioModal';  // Modal de edición de usuario
import EditOdontologoModal from './EditOdontologoModal'; // Modal de edición de odontólogo
import ConPermiso from './ConPermiso'
const ShowOdontologoModal = () => {
    const [isEditUsuarioOpen, setIsEditUsuarioOpen] = useState(false);
    const [isEditOdontologoOpen, setIsEditOdontologoOpen] = useState(false);
    const { id } = useParams();  
    const [usuario, setUsuario] = useState(null);
    const [odontologo, setOdontologo] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga inicializado en true
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUsuarioYOdontologo = async () => {
            try {
                const usuarioResponse = await usuarioService.getUsuario(id);
                const odontologoResponse = await odontologoService.getOdontologo(id);
                setUsuario(usuarioResponse.data);
                setOdontologo(odontologoResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/show404'); // Redirigir a la página NotFound
                } else {
                    console.error('Error fetching usuario:', error);
                }            } finally {
                setIsLoading(false); // Finaliza la carga
            }
        };
    
        fetchUsuarioYOdontologo();
    }, [id]);
    const [activeTab, setActiveTab] = useState(1);
    const loadUsuarioYOdontologo = async () => {
        try {
            const usuarioResponse = await usuarioService.getUsuario(id);
            const odontologoResponse = await odontologoService.getOdontologo(id);
            setUsuario(usuarioResponse.data);
            setOdontologo(odontologoResponse.data);
        } catch (error) {
            console.error('Error fetching usuario o odontólogo:', error);
        } 
    };

    const handleEditUsuario = () => {
        setIsEditUsuarioOpen(true);
        loadUsuarioYOdontologo();
    };

    const handleEditOdontologo = () => {
        setIsEditOdontologoOpen(true);
        loadUsuarioYOdontologo();
    };

    const onClose = () => {
        navigate('/odontologos');
    };

    // Mostrar spinner mientras se cargan los datos
    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    if (!usuario || !odontologo) {
        return null; // Si no hay datos, no muestra nada (esto se puede personalizar)
    }

    return (
        <>
           <Modal isOpen={!!odontologo} onClose={onClose} size="full">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader textAlign="center">DATOS DEL ODONTÓLOGO</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* Barra de pestañas */}
      <Flex justify="center" mb={4}>
        <Button colorScheme={activeTab === 1 ? "teal" : "gray"} onClick={() => setActiveTab(1)}>Datos Personales</Button>
        
        {/*<Button colorScheme={activeTab === 2 ? "teal" : "gray"} onClick={() => setActiveTab(2)}>Licencia y Especialización</Button>*/}
      </Flex>

      {/* Contenido de las pestañas */}
      {activeTab === 1 && (
        <Grid templateColumns="1fr 1fr" gap={6}>
          <Box border="1px solid #319795" borderRadius="lg" p={5} boxShadow="sm" bg="white">
            <Text fontSize="xl" mb={4}><strong>Nombre Completo:</strong> {odontologo.nombres} {odontologo.apellidos}</Text>
            <Text><strong>CI:</strong> {odontologo.ci}</Text>
            <Text><strong>Fecha de Nacimiento:</strong> {odontologo.fecha_nacimiento}</Text>
            <Text><strong>Correo Electrónico:</strong> {odontologo.email}</Text>
            <Text><strong>Dirección:</strong> {odontologo.direccion}</Text>
            <Text><strong>Teléfono:</strong> {odontologo.telefono}</Text>
            <ConPermiso permiso='Editar Datos Personales'>
              <Button colorScheme="blue" mt={4} onClick={handleEditUsuario}>Editar Datos Personales</Button>
            </ConPermiso>
          </Box>

          <Box border="1px solid #319795" borderRadius="lg" p={5} boxShadow="sm" bg="white">
            <Text fontSize="xl" mb={4}><strong>Número de Licencia:</strong> {odontologo.numero_licencia}</Text>
            <Text><strong>Especialización:</strong> {odontologo.especializacion}</Text>
            <ConPermiso permiso='Editar Datos de Odontólogo'>
              <Button colorScheme="green" mt={4} onClick={handleEditOdontologo}>Editar Datos Profesionales</Button>
            </ConPermiso>
          </Box>
        </Grid>
      )}
    </ModalBody>
  </ModalContent>
</Modal>


            {/* Modal para editar el usuario */}
            {isEditUsuarioOpen && (
                <EditUsuarioModal 
                    usuario={usuario} 
                    onClose={() => setIsEditUsuarioOpen(false)} 
                    onSave={(updatedUser) => {
                        setIsEditUsuarioOpen(false);
                        loadUsuarioYOdontologo();
                    }} 
                />
            )}

            {/* Modal para editar el odontólogo */}
            {isEditOdontologoOpen && (
                <EditOdontologoModal 
                    odontologo={odontologo} 
                    id={id}
                    onClose={() => setIsEditOdontologoOpen(false)}
                    onSave={(updatedOdontologo) => {
                        setIsEditOdontologoOpen(false);
                        loadUsuarioYOdontologo();
                    }} 
                />
            )}
        </>
    );
};

export default ShowOdontologoModal;
