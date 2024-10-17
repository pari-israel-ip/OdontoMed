import React, { useState, useEffect } from 'react';
import { Button, Input, Select, FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Textarea 

} from '@chakra-ui/react';
import roleService from '../services/roleService'; // Asegúrate de que la ruta sea correcta
import odontologoService from '../services/odontologoService'; // Importa el servicio de odontólogos
import axios from 'axios';

const CreateUsuarioModal = ({ onClose, onCreate }) => {
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ci, setCi] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fecha_nacimiento, setFechaNacimiento] = useState('');
    const [rol, setRol] = useState('');
    const [direccion, setDireccion] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [seguro_medico, setSeguroMedico] = useState('');
    const [alergias, setAlergias] = useState('Ninguna');
    const [antecedentes_medicos, setAntecedentesMedicos] = useState('Ninguno');
    const [notas_generales, setNotasGenerales] = useState('Ninguna Observacion');
    const [id_odontologo, setIdOdontologo] = useState('');
    const [roles, setRoles] = useState([]);
    const [odontologos, setOdontologos] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    // Cargar roles y odontólogos al montar el componente
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRolesPaciente();
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        const fetchOdontologos = async () => {
            try {
                const response = await odontologoService.getOdontologos();
                setOdontologos(response.data);
            } catch (error) {
                console.error("Error fetching odontologos:", error);
            }
        };

        fetchRoles();
        fetchOdontologos();
    }, []);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        // Validación simple de los campos requeridos
        const validationErrors = {};
        if (!nombres.trim()) validationErrors.nombres = 'LOS NOMBRES SON OBLIGATORIOS.';
        if (!apellidos.trim()) validationErrors.apellidos = 'LOS APELLIDOS SON OBLIGATORIOS.';
        if (!ci.trim()) validationErrors.ci = 'EL C.I. ES OBLIGATORIO.';
        if (!email.trim()) validationErrors.email = 'EL EMAIL ES OBLIGATORIO.';
        if (!contrasenia.trim()) validationErrors.contrasenia = 'LA CONTRASEÑA ES OBLIGATORIA.';
        if (!seguro_medico.trim()) validationErrors.seguro_medico = 'EL SEGURO MEDICO ES OBLIGATORIA.';
        if (!telefono.trim()) validationErrors.telefono = 'EL TELEFONO ES OBLIGATORIO.';
        if (!fecha_nacimiento.trim()) validationErrors.fecha_nacimiento = 'LA FECHA DE NACIMIENTO ES OBLIGATORIA.';
        if (!direccion.trim()) validationErrors.direccion = 'LA DIRECCION ES OBLIGATORIA.';
        if (!alergias.trim()) validationErrors.alergias = 'LAS ALERGIAS SON OBLIGATORIAS.';
        if (!antecedentes_medicos.trim()) validationErrors.antecedentes_medicos = 'LOS ANTECEDENTES SON OBLIGATORIOS.';
        if (!rol) validationErrors.rol = 'EL ROL ES OBLIGATORIO.';
        if (!id_odontologo) validationErrors.id_odontologo = 'EL ODONTÓLOGO ES OBLIGATORIO.';
        if (!notas_generales.trim()) validationErrors.notas_generales = 'LAS NOTAS SON OBLIGATORIAS.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        setLoading(true); // Inicia el estado de carga

        const newUsuario = { 
            nombres, apellidos, ci, email, telefono, fecha_nacimiento, rol, direccion, contrasenia, 
            seguro_medico, alergias, antecedentes_medicos, notas_generales, id_odontologo 
        };
    
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/odomed/usuario/create/', newUsuario);
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onCreate(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'ERROR AL CREAR EL USUARIO. INTÉNTELO DE NUEVO MÁS TARDE.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Nuevo Usuario</ModalHeader>
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

                        <FormControl  isInvalid={!!errors.fecha_nacimiento} mb={4}>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <Input
                                type="date"
                                value={fecha_nacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                            />
                            {errors.fecha_nacimiento && <FormErrorMessage>{errors.fecha_nacimiento}</FormErrorMessage>}

                        </FormControl>

                        <FormControl isInvalid={!!errors.rol} mb={4}>
                            <FormLabel>Rol</FormLabel>
                            <Select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                required
                            >
                                    <option value="">Seleccione un rol</option>

                                {roles.map((role) => (
                                    <option selected key={role.id_rol} value={role.id_rol}>
                                        {role.nombre_rol}
                                    </option>
                                ))}
                            </Select>
                            {errors.rol && <FormErrorMessage>{errors.rol}</FormErrorMessage>}
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

                        {/* Campos de Pacientes */}
                        <FormControl isInvalid={!!errors.seguro_medico} mb={4}>
                            <FormLabel>Seguro Médico</FormLabel>
                            <Input
                                placeholder="Seguro Médico"
                                value={seguro_medico}
                                onChange={(e) => setSeguroMedico(e.target.value)}
                                required
                            />
                            {errors.seguro_medico && <FormErrorMessage>{errors.seguro_medico}</FormErrorMessage>}

                        </FormControl>

                        <FormControl isInvalid={!!errors.alergias} mb={4}>
                            <FormLabel>Alergias</FormLabel>
                            <Input
                                placeholder="Alergias"
                                value={alergias}
                                defaultValue="Ninguno"
                                onChange={(e) => setAlergias(e.target.value)}
                                required
                            />
                            {errors.alergias && <FormErrorMessage>{errors.alergias}</FormErrorMessage>}

                        </FormControl>

                        <FormControl isInvalid={!!errors.antecedentes_medicos} mb={4}>
                            <FormLabel>Antecedentes Médicos</FormLabel>
                            <Textarea
                                placeholder="Antecedentes Médicos"
                                value={antecedentes_medicos}
                                defaultValue="Ninguno"
                                onChange={(e) => setAntecedentesMedicos(e.target.value)}
                                required
                            />
                            {errors.antecedentes_medicos && <FormErrorMessage>{errors.antecedentes_medicos}</FormErrorMessage>}

                        </FormControl>

                        {/* Campos de Historiales Clínicos */}
                        

                        <FormControl isInvalid={!!errors.id_odontologo} mb={4}>
                            <FormLabel>Odontólogo</FormLabel>
                            <Select
                                placeholder="Selecciona un odontólogo"
                                value={id_odontologo}
                                onChange={(e) => setIdOdontologo(e.target.value)}
                                required
                            >
                                {odontologos.map((odontologo) => (
                                    <option key={odontologo.id_odontologo} value={odontologo.id_odontologo}>
                                        {odontologo.nombre_completo}
                                    </option>
                                ))}
                            </Select>
                            {errors.id_odontologo && <FormErrorMessage>{errors.id_odontologo}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.notas_generales} mb={4}>
                            <FormLabel>Notas Generales</FormLabel>
                            <Textarea
                                placeholder="Notas Generales"
                                value={notas_generales}
                                defaultValue="Ninguna observacion"
                                onChange={(e) => setNotasGenerales(e.target.value)}
                                required
                            />
                            {errors.notas_generales && <FormErrorMessage>{errors.notas_generales}</FormErrorMessage>}

                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
                        Crear Usuario
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateUsuarioModal;
