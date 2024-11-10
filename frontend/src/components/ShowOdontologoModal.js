// src/components/ShowOdontologoModal.js
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
import odontologoService from '../services/odontologoService';
import usuarioService from '../services/usuarioService';  // Servicio de usuario
import EditUsuarioModal from './EditUsuarioModal';  // Modal de edición de usuario
import EditOdontologoModal from './EditOdontologoModal'; // Modal de edición de odontólogo

const ShowOdontologoModal = () => {
    const [isEditUsuarioOpen, setIsEditUsuarioOpen] = useState(false);
    const [isEditOdontologoOpen, setIsEditOdontologoOpen] = useState(false);
    const { id } = useParams();  
    const [usuario, setUsuario] = useState(null);
    const [odontologo, setOdontologo] = useState(null);
    

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUsuarioYOdontologo = async () => {
            try {
                const usuarioResponse = await usuarioService.getUsuario(id);
                const odontologoResponse = await odontologoService.getOdontologo(id);
                console.log('Fetched odontologo:', odontologoResponse.data); // Check for id_odontologo here
                setUsuario(usuarioResponse.data);
                setOdontologo(odontologoResponse.data);
            } catch (error) {
                console.error('Error fetching usuario o odontólogo:', error);
            }
        };
    
        fetchUsuarioYOdontologo();
    }, [id]);

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
        console.log("Editing odontologo with ID:", id); // Log before opening modal
        setIsEditOdontologoOpen(true);
        loadUsuarioYOdontologo();
    };
    

    



    const onClose = () => {
        navigate('/odontologos');
    };

    if (!usuario || !odontologo) {
        return null; // Puedes agregar un loader aquí si lo prefieres
    }

    return (
        <>
            <Modal isOpen={!!odontologo} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>DATOS DEL ODONTOLOGO</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns="1fr 1fr" gap={4}>
                            <Box>
                                {/* Información del usuario */}
                                <Text><strong>Nombre Completo:</strong> {usuario.nombre_completo}</Text>
                                <Text><strong>CI:</strong> {usuario.ci}</Text>
                                <Text><strong>Fecha de Nacimiento:</strong> {usuario.fecha_nacimiento}</Text>
                                <Text><strong>Correo Electrónico:</strong> {usuario.email}</Text>
                                <Text><strong>Dirección:</strong> {usuario.direccion}</Text>
                                <Text><strong>Teléfono:</strong> {usuario.telefono}</Text>
                                <Button colorScheme="blue" mt={4} onClick={handleEditUsuario}>
                                    Editar Datos Personales
                                </Button>

                                {/* Información específica del odontólogo */}
                               
                                <Text mt={4}><strong>Número de Licencia:</strong> {odontologo.numero_licencia}</Text>
                                <Text><strong>Especialización:</strong> {odontologo.especializacion}</Text>
                                <Text><strong>Activo:</strong> {odontologo.activo ? 'Sí' : 'No'}</Text>
                                <Button colorScheme="green" mt={4} onClick={handleEditOdontologo}>
                                    Editar Datos del Odontólogo
                                </Button>

                             
                            </Box>
                            <Box>
                                {/* Información adicional en la columna derecha */}
                                <Text></Text>
                            </Box>
                        </Grid>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal para editar el usuario */}
            {isEditUsuarioOpen && (
                <EditUsuarioModal usuario={usuario} onClose={() => setIsEditUsuarioOpen(false)} 
                onSave={(updatedUser) => {
                    setIsEditUsuarioOpen(false);
                    loadUsuarioYOdontologo();
                }} />
            )}

            {/* Modal para editar el odontólogo */}
            {isEditOdontologoOpen && (
    <EditOdontologoModal 
        odontologo={odontologo} 
        id={id} // Ensure this is the right id
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
