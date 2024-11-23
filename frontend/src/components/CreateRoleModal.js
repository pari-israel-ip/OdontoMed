import React, { useState } from 'react';
import {
    Button, Input, Checkbox, FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, Box, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState({});
    const [selectAll, setSelectAll] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const modulos = [
        { nombre: 'Roles', permisosOpciones: [
            { id: 1, label: 'Crear rol' },
            { id: 2, label: 'Editar rol' },
            { id: 3, label: 'Eliminar rol' }
            //{ id: 4, label: 'Ver roles' },
            //{ id: 5, label: 'Asignar permisos a rol' },
            //{ id: 6, label: 'Ver permisos de rol' },
            //{ id: 7, label: 'Eliminar permisos de rol' },
            //{ id: 8, label: 'Activar rol' },
            //{ id: 9, label: 'Desactivar rol' },
            //{ id: 10, label: 'Actualizar rol' }
        ]},
        { nombre: 'Pacientes', permisosOpciones: [
            { id: 11, label: 'Ver Pacientes' },
            { id: 12, label: 'Crear Paciente' },
            { id: 13, label: 'Ver Historial de Paciente' },
            { id: 14, label: 'Editar Datos Personales' },
            { id: 15, label: 'Editar Datos del Paciente' },
            { id: 16, label: 'Editar Datos del Historial' },
            { id: 17, label: 'Crear Diagnistico' },
            { id: 18, label: 'Editar Diagnistico' },
            { id: 19, label: 'Eliminar Diagnostico' },
            { id: 20, label: 'Crear Tratamiento' },
            { id: 21, label: 'Editar Tratamiento' },
            { id: 22, label: 'Eliminar Tratamiento' },
            { id: 23, label: 'Crear Prescripcion' },
            { id: 24, label: 'Editar Prescripcion' },
            { id: 25, label: 'Eliminar Prescripcion' }
            //{ id: 26, label: 'Crear Diagnistico' },
            //{ id: 27, label: 'Editar Diagnistico' },
            //{ id: 28, label: 'Eliminar Diagnostico' }
        ]},
        { nombre: 'Odontólogos', permisosOpciones: [
            { id: 31, label: 'Ver Odontólogos' },
            { id: 32, label: 'Crear odontólogo' },
            { id: 33, label: 'Eliminar odontólogo' },
            { id: 34, label: 'Editar Datos Personales' },
            { id: 35, label: 'Editar Datos de Oodntólogo' }
            //{ id: 36, label: 'Ver tratamientos asignados' },
            //{ id: 37, label: 'Modificar tratamiento de odontólogo' },
            //{ id: 38, label: 'Ver historial de odontólogo' },
            //{ id: 39, label: 'Actualizar datos de odontólogo' },
            //{ id: 40, label: 'Eliminar registros de odontólogo' }
        ]},
        { nombre: 'Citas', permisosOpciones: [
            { id: 41, label: 'Ver citas' },
            { id: 42, label: 'Editar cita' },
            { id: 43, label: 'Eliminar cita' }
            //{ id: 44, label: 'Eliminar cita' },
            //{ id: 45, label: 'Asignar citas' },
            //{ id: 46, label: 'Ver todas las citas' },
            //{ id: 47, label: 'Cancelar cita' },
            //{ id: 48, label: 'Modificar fecha de cita' },
            //{ id: 49, label: 'Confirmar cita' },
            //{ id: 50, label: 'Reagendar cita' }
        ]},
        { nombre: 'Recepcionistas', permisosOpciones: [
            { id: 51, label: 'Ver Recepcionistas' },
            { id: 52, label: 'Editar Recepcionista' },
            { id: 53, label: 'Eliminar Recepcionista' }
            //{ id: 54, label: 'Eliminar tratamiento' },
            //{ id: 55, label: 'Asignar tratamiento a paciente' },
            //{ id: 56, label: 'Ver tratamientos de paciente' },
            //{ id: 57, label: 'Modificar tratamiento de paciente' },
            //{ id: 58, label: 'Eliminar tratamiento de paciente' },
            //{ id: 59, label: 'Actualizar tratamiento' },
            //{ id: 60, label: 'Ver historial de tratamientos' }
        ]}
    ];

    const handlePermisoChange = (modulo, permisoId, checked) => {
        setPermisos(prevState => {
            const permisosModulo = prevState[modulo] || [];
            return {
                ...prevState,
                [modulo]: checked ? [...permisosModulo, permisoId] : permisosModulo.filter(id => id !== permisoId)
            };
        });
    };

    const handleSelectAllChange = (modulo, checked) => {
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
        setPermisos(prevState => ({
            ...prevState,
            [modulo]: checked ? allPermisos : []
        }));
        setSelectAll(prevState => ({
            ...prevState,
            [modulo]: checked
        }));
    };

    const isAllSelected = (modulo) => {
        const permisosModulo = permisos[modulo] || [];
        const allPermisos = modulos.find(m => m.nombre === modulo).permisosOpciones.map(p => p.id);
        return permisosModulo.length === allPermisos.length;
    };

    const handleNombreRolChange = (e) => {
        setNombreRol(e.target.value);
        setErrors(prevErrors => ({ ...prevErrors, nombre_rol: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setErrors({});
        const frontendErrors = {};
        if (!nombre_rol.trim()) {
            frontendErrors.nombre_rol = 'El nombre del rol es obligatorio.';
        }

        const permisosCombinados = Object.values(permisos).flat().join(',');
        if (!permisosCombinados) {
            frontendErrors.permisos = 'Debe seleccionar al menos un permiso.';
        }

        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        setLoading(true);
        const newRole = { nombre_rol, permisos: permisosCombinados };

        try {
            const response = await axios.post('http://127.0.0.1:8000/odomed/roles/create/', newRole);
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                toast({
                    title: "Rol creado.",
                    description: "El rol ha sido creado exitosamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onCreate(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al crear el rol. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
            console.error('Error creating role:', error);
            toast({
                title: "Error al crear.",
                description: "No se pudo crear el rol.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Nuevo Rol</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        {/* Nombre del Rol */}
                        <FormControl isInvalid={!!errors.nombre_rol}>
                            <FormLabel>Nombre del Rol:</FormLabel>
                            <Input
                                placeholder="Nombre del rol"
                                value={nombre_rol}
                                onChange={handleNombreRolChange}
                            />
                            {errors.nombre_rol && <FormErrorMessage>{errors.nombre_rol}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.permisos}>
                        <FormLabel>Permisos del Rol:</FormLabel>

                        {/* Accordion para mostrar permisos */}
                        <Accordion allowToggle mt={4}>
                            {modulos.map(modulo => (
                                <AccordionItem key={modulo.nombre}>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            {modulo.nombre}
                                        </Box>
                                        <Checkbox
                                            isChecked={isAllSelected(modulo.nombre)}
                                            onChange={(e) => handleSelectAllChange(modulo.nombre, e.target.checked)}
                                            ml="auto"
                                        >
                                            Seleccionar todos
                                        </Checkbox>
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>

                                        {modulo.permisosOpciones.map(permiso => (
                                            <Box key={permiso.id} mb={2}>  {/* Opcional: Añade un margen para separar los checkboxes */}
                                                <Checkbox
                                                    isChecked={(permisos[modulo.nombre] || []).includes(permiso.id)}
                                                    onChange={(e) => handlePermisoChange(modulo.nombre, permiso.id, e.target.checked)}
                                                >
                                                    {permiso.label}
                                                </Checkbox>
                                            </Box>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {/* Error handling for permisos */}
                        {errors.permisos && <FormErrorMessage >{errors.permisos}</FormErrorMessage>}
                        </FormControl>

                    </form>
                </ModalBody>

                {/* General errors */}
                {errors.general && (
                    <Box color="red.500" mt={2} fontSize="sm">
                        {errors.general}
                    </Box>
                )}

                <ModalFooter>
                    <Button colorScheme="teal" mr={3} isLoading={loading} onClick={handleSubmit}>
                        {loading ? 'Creando...' : 'Crear Rol'}
                    </Button>
                    <Button isLoading={loading} variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateRoleModal;
