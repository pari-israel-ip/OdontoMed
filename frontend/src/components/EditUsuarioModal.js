import React, { useState, useEffect } from 'react';
import { Button, Input, Select, FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta

const EditUsuarioModal = ({ usuario, onClose, onSave }) => {
    const [nombres, setNombres] = useState(usuario.nombres);
    const [apellidos, setApellidos] = useState(usuario.apellidos);
    const [ci, setCi] = useState(usuario.ci);
    const [email, setEmail] = useState(usuario.email);
    const [telefono, setTelefono] = useState(usuario.telefono);
    const [fecha_nacimiento, setFechaNacimiento] = useState(usuario.fecha_nacimiento || '');
    const [rol, setRol] = useState(usuario.rol); // Asignar rol del usuario
    const [direccion, setDireccion] = useState(usuario.direccion);
    const [contrasenia, setContrasenia] = useState(usuario.contrasenia);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple de los campos requeridos
        const validationErrors = {};
        if (!nombres.trim()) validationErrors.nombres = 'Los nombres son obligatorios.';
        if (!apellidos.trim()) validationErrors.apellidos = 'Los apellidos son obligatorios.';
        if (!ci.trim()) validationErrors.ci = 'El C.I. es obligatorio.';
        if (!email.trim()) validationErrors.email = 'El email es obligatorio.';
        if (!contrasenia.trim()) validationErrors.contrasenia = 'La contraseña es obligatoria.';
        if (!rol) validationErrors.rol = 'El rol es obligatorio.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
        onSave(updatedUsuario);
        onClose();  // Cerrar el modal después de guardar
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
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

                        <FormControl mb={4}>
                            <FormLabel>Teléfono</FormLabel>
                            <Input
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <Input
                                type="date"
                                value={fecha_nacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isInvalid={!!errors.rol} mb={4}>
                            <FormLabel>Rol</FormLabel>
                            <Select
                                placeholder="Selecciona un rol"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                required
                            >
                                {roles.map((role) => (
                                    <option key={role.id_rol} value={role.id_rol}>
                                        {role.nombre_rol}
                                    </option>
                                ))}
                            </Select>
                            {errors.rol && <FormErrorMessage>{errors.rol}</FormErrorMessage>}
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Dirección</FormLabel>
                            <Input
                                placeholder="Dirección"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                            />
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
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
                        Guardar
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditUsuarioModal;
