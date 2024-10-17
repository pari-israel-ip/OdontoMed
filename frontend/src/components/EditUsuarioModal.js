import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Grid,
    GridItem,
    useToast,
    FormErrorMessage
} from '@chakra-ui/react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

const EditUsuarioModal = ({ usuario, onClose, onSave }) => {
    const [nombres, setNombres] = useState(usuario.nombres.toUpperCase());
    const [apellidos, setApellidos] = useState(usuario.apellidos.toUpperCase());
    const [ci, setCi] = useState(usuario.ci.toUpperCase());
    const [email, setEmail] = useState(usuario.email.toUpperCase());
    const [telefono, setTelefono] = useState(usuario.telefono.toUpperCase());
    const [fecha_nacimiento, setFechaNacimiento] = useState(usuario.fecha_nacimiento || '');
    const [rol, setRol] = useState(usuario.rol || ''); // Incluimos el rol que ya tiene el usuario si existe
    const [direccion, setDireccion] = useState(usuario.direccion.toUpperCase());
    const [contrasenia, setContrasenia] = useState(usuario.contrasenia || '');
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const toast = useToast(); // Para mostrar notificaciones

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRoles();
                setRoles(response.data);
            } catch (error) {
                console.error("ERROR FETCHING ROLES:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Activar estado de carga
    
        const updatedUsuario = {
            ...usuario,
            nombres,
            apellidos,
            ci,
            email,
            telefono,
            fecha_nacimiento,
            rol,
            direccion,
            contrasenia
        };
    
        try {
            const response = await axios.put(`http://127.0.0.1:8000/odomed/usuario/${usuario.id_usuario}/`, updatedUsuario);
    
            // Si hay errores específicos en la respuesta
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                // Si la actualización fue exitosa
                onSave(response.data);
                onClose();
            }
        } catch (error) {
            // Si ocurre un error en el servidor o en la solicitud
            const errorMessage = error.response?.data.errors || { general: 'ERROR AL ACTUALIZAR EL USUARIO. INTÉNTELO DE NUEVO MÁS TARDE.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <Modal isOpen={!!usuario} onClose={onClose}>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>Editar Usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                            <GridItem>
                                <FormControl isRequired isInvalid={!!errors.nombres}>
                                    <FormLabel>Nombres</FormLabel>
                                    <Input
                                        type="text"
                                        value={nombres}
                                        onChange={(e) => setNombres(e.target.value)}
                                    />
                                    {errors.nombres && <FormErrorMessage>{errors.nombres}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errors.apellidos}>
                                    <FormLabel>Apellidos</FormLabel>
                                    <Input
                                        type="text"
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                    />
                                    {errors.apellidos && <FormErrorMessage>{errors.apellidos}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errors.ci}>
                                    <FormLabel>C.I.</FormLabel>
                                    <Input
                                        type="text"
                                        value={ci}
                                        onChange={(e) => setCi(e.target.value)}
                                    />
                                    {errors.ci && <FormErrorMessage>{errors.ci}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errors.email}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={!!errors.telefono}>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input
                                        type="text"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                    {errors.telefono && <FormErrorMessage>{errors.telefono}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Fecha de Nacimiento</FormLabel>
                                    <Input
                                        type="date"
                                        value={fecha_nacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                    />
                                    {errors.fecha_nacimiento && <FormErrorMessage>{errors.fecha_nacimiento}</FormErrorMessage>}

                                </FormControl>
                            </GridItem>


                            <GridItem>
                                <FormControl isInvalid={!!errors.direccion}>
                                    <FormLabel>Dirección</FormLabel>
                                    <Input
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                    />
                                    {errors.direccion && <FormErrorMessage>{errors.direccion}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errors.contrasenia}>
                                    <FormLabel>Contraseña</FormLabel>
                                    <Input
                                        type="password"
                                        value={contrasenia}
                                        onChange={(e) => setContrasenia(e.target.value)}
                                    />
                                    {errors.contrasenia && <FormErrorMessage>{errors.contrasenia}</FormErrorMessage>}
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                Guardar
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditUsuarioModal;
