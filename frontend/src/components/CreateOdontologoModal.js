import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

const CreateOdontologoModal = ({ onClose, onCreate }) => {
    // Estados para el usuario
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ci, setCi] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [rol, setRol] = useState('1'); // Asignar rol por defecto
    
    // Estados para el odontólogo
    const [numeroLicencia, setNumeroLicencia] = useState('');
    const [especializacion, setEspecializacion] = useState('');
    
    // Estados para manejo de errores y carga
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    // Cargar roles al montar el componente
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRoles();
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Validación de los campos requeridos para Usuario
        const validationErrors = {};
        if (!nombres.trim()) validationErrors.nombres = 'LOS NOMBRES SON OBLIGATORIOS.';
        if (!apellidos.trim()) validationErrors.apellidos = 'LOS APELLIDOS SON OBLIGATORIOS.';
        if (!ci.trim()) validationErrors.ci = 'EL C.I. ES OBLIGATORIO.';
        if (!email.trim()) validationErrors.email = 'EL EMAIL ES OBLIGATORIO.';
        if (!telefono.trim()) validationErrors.telefono = 'EL TELEFONO ES OBLIGATORIO.';
        if (!fechaNacimiento.trim()) validationErrors.fechaNacimiento = 'LA FECHA DE NACIMIENTO ES OBLIGATORIA.';
        if (!direccion.trim()) validationErrors.direccion = 'LA DIRECCION ES OBLIGATORIA.';
        if (!contrasenia.trim()) validationErrors.contrasenia = 'LA CONTRASEÑA ES OBLIGATORIA.';
        if (!numeroLicencia.trim()) validationErrors.numeroLicencia = 'EL NÚMERO DE LICENCIA ES OBLIGATORIO.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true); // Inicia el estado de carga

        // Datos del nuevo usuario
        const newUsuario = {
            nombres,
            apellidos,
            ci,
            email,
            telefono,
            fecha_nacimiento: fechaNacimiento,  // Cambiado para coincidir con lo que espera el backend
            direccion,
            rol: parseInt(rol),  // Asegúrate de que este ID existe en la base de datos
            contrasenia, // Aquí se obtiene la contraseña del estado
        };

        // Datos del nuevo odontólogo
        const newOdontologo = {
            nombres,
            apellidos,
            ci,
            email,
            telefono,
            fecha_nacimiento: fechaNacimiento,  // Cambiado para coincidir con lo que espera el backend
            direccion,
            rol: parseInt(rol),  // Asegúrate de que este ID existe en la base de datos
            contrasenia, // Aquí se obtiene la contraseña del estado
            numero_licencia: numeroLicencia,
            especializacion,
            activo: true, // Siempre activo por defecto
        };

        try {
            // Enviar datos del usuario
            /*const usuarioResponse = await axios.post('http://127.0.0.1:8000/odomed/usuario/create/', newUsuario);
            const idUsuario = usuarioResponse.data.id_usuario; // Asume que la respuesta incluye el ID del nuevo usuario*/

            // Enviar datos del odontólogo usando el ID del nuevo usuario
            const odontologoResponse = await axios.post('http://127.0.0.1:8000/odomed/odontologo/create/', {
                ...newOdontologo,
             // Relaciona el odontólogo con el usuario
            });

            if (odontologoResponse.data.errors) {
                setErrors(odontologoResponse.data.errors);
            } else {
                onCreate(odontologoResponse.data);
                onClose();
            }
        } catch (error) {
            console.error("Error response:", error.response?.data); // Imprimir la respuesta de error del servidor
            const errorMessage = error.response?.data.errors || { general: 'ERROR AL CREAR EL ODONTÓLOGO. INTÉNTELO DE NUEVO MÁS TARDE.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Nuevo Odontólogo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        {/* Campos de Usuario */}
                        <FormControl isInvalid={!!errors.nombres} mb={4}>
                            <FormLabel>Nombres</FormLabel>
                            <Input
                                placeholder="Nombres"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                            />
                            {errors.nombres && <FormErrorMessage>{errors.nombres}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.apellidos} mb={4}>
                            <FormLabel>Apellidos</FormLabel>
                            <Input
                                placeholder="Apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                            />
                            {errors.apellidos && <FormErrorMessage>{errors.apellidos}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.ci} mb={4}>
                            <FormLabel>C.I.</FormLabel>
                            <Input
                                placeholder="C.I."
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                                required
                            />
                            {errors.ci && <FormErrorMessage>{errors.ci}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.email} mb={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.telefono} mb={4}>
                            <FormLabel>Teléfono</FormLabel>
                            <Input
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                            {errors.telefono && <FormErrorMessage>{errors.telefono}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.fechaNacimiento} mb={4}>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <Input
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                            />
                            {errors.fechaNacimiento && <FormErrorMessage>{errors.fechaNacimiento}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.direccion} mb={4}>
                            <FormLabel>Dirección</FormLabel>
                            <Input
                                placeholder="Dirección"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                            {errors.direccion && <FormErrorMessage>{errors.direccion}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!errors.contrasenia} mb={4}>
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                required
                            />
                            {errors.contrasenia && <FormErrorMessage>{errors.contrasenia}</FormErrorMessage>}
                        </FormControl>

                        {/* Campos de Odontólogo */}
                        <FormControl isInvalid={!!errors.numeroLicencia} mb={4}>
                            <FormLabel>Número de Licencia</FormLabel>
                            <Input
                                placeholder="Número de Licencia"
                                value={numeroLicencia}
                                onChange={(e) => setNumeroLicencia(e.target.value)}
                                required
                            />
                            {errors.numeroLicencia && <FormErrorMessage>{errors.numeroLicencia}</FormErrorMessage>}
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Especialización</FormLabel>
                            <Input
                                placeholder="Especialización (opcional)"
                                value={especializacion}
                                onChange={(e) => setEspecializacion(e.target.value)}
                            />
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={handleSubmit} isLoading={loading}>
                        Crear Odontólogo
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateOdontologoModal;
