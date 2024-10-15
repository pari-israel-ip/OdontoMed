import React, { useState, useEffect } from 'react';
import { Button, Input, Checkbox, FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Accordion, AccordionItem, AccordionButton, AccordionPanel, Box } from '@chakra-ui/react';
import axios from 'axios';

const EditRoleModal = ({ roleData, onClose, onEdit }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const modulos = [
        {
            nombre: 'Usuarios',
            permisosOpciones: [
                { id: 1, label: 'Crear usuario' },
                { id: 2, label: 'Editar usuario' },
                { id: 3, label: 'Mostrar usuario' },
                { id: 4, label: 'Eliminar usuario' }
            ]
        },
        {
            nombre: 'Costos',
            permisosOpciones: [
                { id: 5, label: 'Crear costo' },
                { id: 6, label: 'Editar costo' },
                { id: 7, label: 'Mostrar costo' },
                { id: 8, label: 'Eliminar costo' }
            ]
        },
        {
            nombre: 'Tratamientos',
            permisosOpciones: [
                { id: 9, label: 'Crear tratamiento' },
                { id: 10, label: 'Editar tratamiento' },
                { id: 11, label: 'Mostrar tratamiento' },
                { id: 12, label: 'Eliminar tratamiento' }
            ]
        }
    ];

    // Cargar datos del rol al iniciar el modal
    useEffect(() => {
        if (roleData) {
            setNombreRol(roleData.nombre_rol);
            setPermisos(roleData.permisos);
        }
    }, [roleData]);

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
        const updatedRole = { nombre_rol, permisos: permisosCombinados };

        try {
            const response = await axios.put(`http://127.0.0.1:8000/odomed/roles/edit/${roleData.id}/`, updatedRole);
            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                onEdit(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al editar el rol. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Rol</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!errors.nombre_rol}>
                            <FormLabel>Nombre del Rol:</FormLabel>
                            <Input
                                placeholder="Nombre del rol"
                                value={nombre_rol}
                                onChange={handleNombreRolChange}
                                mb={4}
                            />
                            {errors.nombre_rol && <FormErrorMessage>{errors.nombre_rol}</FormErrorMessage>}
                        </FormControl>

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
                                            <Checkbox
                                                key={permiso.id}
                                                isChecked={(permisos[modulo.nombre] || []).includes(permiso.id)}
                                                onChange={(e) => handlePermisoChange(modulo.nombre, permiso.id, e.target.checked)}
                                                mb={2}
                                            >
                                                {permiso.label}
                                            </Checkbox>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {errors.permisos && <FormErrorMessage>{errors.permisos}</FormErrorMessage>}
                        {errors.general && <FormErrorMessage>{errors.general}</FormErrorMessage>}
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} isLoading={loading} onClick={handleSubmit}>
                        {loading ? 'Editando...' : 'Guardar Cambios'}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditRoleModal;
