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
    useToast
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
    const [errorMessages, setErrorMessages] = useState({});
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
        setErrorMessages({}); // Limpiar mensajes de error previos
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
            const response = await axios.put(`http://127.0.0.1:8000/odomed/usuario/${usuario.id_paciente}/`, updatedUsuario);
    
            // Si hay errores específicos en la respuesta
            if (response.data.errors) {
                setErrorMessages(response.data.errors);
            } else {
                // Si la actualización fue exitosa
                onSave(response.data);
                onClose();
            }
        } catch (error) {
            // Si ocurre un error en el servidor o en la solicitud
            const errorMessage = error.response?.data.errors || { general: 'ERROR AL ACTUALIZAR EL USUARIO. INTÉNTELO DE NUEVO MÁS TARDE.' };
            setErrorMessages(errorMessage);
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
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.nombres}>
                                    <FormLabel>Nombres</FormLabel>
                                    <Input
                                        type="text"
                                        value={nombres}
                                        onChange={(e) => setNombres(e.target.value)}
                                    />
                                    {errorMessages.nombres && <p>{errorMessages.nombres[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.apellidos}>
                                    <FormLabel>Apellidos</FormLabel>
                                    <Input
                                        type="text"
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                    />
                                    {errorMessages.apellidos && <p>{errorMessages.apellidos[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.ci}>
                                    <FormLabel>C.I.</FormLabel>
                                    <Input
                                        type="text"
                                        value={ci}
                                        onChange={(e) => setCi(e.target.value)}
                                    />
                                    {errorMessages.ci && <p>{errorMessages.ci[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.email}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errorMessages.email && <p>{errorMessages.email[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={!!errorMessages.telefono}>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input
                                        type="text"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                    {errorMessages.telefono && <p>{errorMessages.telefono[0]}</p>}
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
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.rol}>
                                    <FormLabel>Rol</FormLabel>
                                    <Select value={rol} onChange={(e) => setRol(e.target.value)} required>
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((role) => (
                                            <option key={role.id_rol} value={role.id_rol}>
                                                {role.nombre_rol}
                                            </option>
                                        ))}
                                    </Select>
                                    {errorMessages.rol && <p>{errorMessages.rol[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={!!errorMessages.direccion}>
                                    <FormLabel>Dirección</FormLabel>
                                    <Input
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                    />
                                    {errorMessages.direccion && <p>{errorMessages.direccion[0]}</p>}
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isRequired isInvalid={!!errorMessages.contrasenia}>
                                    <FormLabel>Contraseña</FormLabel>
                                    <Input
                                        type="password"
                                        value={contrasenia}
                                        onChange={(e) => setContrasenia(e.target.value)}
                                    />
                                    {errorMessages.contrasenia && <p>{errorMessages.contrasenia[0]}</p>}
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
