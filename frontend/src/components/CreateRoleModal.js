import React, { useState } from 'react';
import { Button, Input, Checkbox, FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [nombre_rol, setNombreRol] = useState('');
    const [permisos, setPermisos] = useState({});
    const [selectAll, setSelectAll] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const modulos = [
        { nombre: 'Usuarios', permisosOpciones: [{ id: 1, label: 'Crear usuario' }, { id: 2, label: 'Editar usuario' }, { id: 3, label: 'Mostrar usuario' }, { id: 4, label: 'Eliminar usuario' }] },
        { nombre: 'Costos', permisosOpciones: [{ id: 5, label: 'Crear costo' }, { id: 6, label: 'Editar costo' }, { id: 7, label: 'Mostrar costo' }, { id: 8, label: 'Eliminar costo' }] },
        { nombre: 'Tratamientos', permisosOpciones: [{ id: 9, label: 'Crear tratamiento' }, { id: 10, label: 'Editar tratamiento' }, { id: 11, label: 'Mostrar tratamiento' }, { id: 12, label: 'Eliminar tratamiento' }] }
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
                onCreate(response.data);
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data.errors || { general: 'Error al crear el rol. Inténtelo de nuevo más tarde.' };
            setErrors(errorMessage);
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
                        <FormControl isInvalid={!!errors.nombre_rol}>
                            <FormLabel>Nombre del Rol:</FormLabel>
                            <Input
                                placeholder="Nombre del rol"
                                value={nombre_rol}
                                onChange={handleNombreRolChange}
                            />
                            {errors.nombre_rol && <FormErrorMessage>{errors.nombre_rol}</FormErrorMessage>}
                        </FormControl>

                        {modulos.map(modulo => (
                            <FormControl key={modulo.nombre} mt={4}>
                                <FormLabel>{modulo.nombre}:</FormLabel>
                                <Checkbox
                                    isChecked={isAllSelected(modulo.nombre)}
                                    onChange={(e) => handleSelectAllChange(modulo.nombre, e.target.checked)}
                                >
                                    Seleccionar todos
                                </Checkbox>
                                {modulo.permisosOpciones.map(permiso => (
                                    <Checkbox
                                        key={permiso.id}
                                        isChecked={(permisos[modulo.nombre] || []).includes(permiso.id)}
                                        onChange={(e) => handlePermisoChange(modulo.nombre, permiso.id, e.target.checked)}
                                    >
                                        {permiso.label}
                                    </Checkbox>
                                ))}
                            </FormControl>
                        ))}

                        {errors.permisos && <FormErrorMessage>{errors.permisos}</FormErrorMessage>}
                        {errors.general && <FormErrorMessage>{errors.general}</FormErrorMessage>}
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} isLoading={loading} onClick={handleSubmit}>
                        {loading ? 'Creando...' : 'Crear Rol'}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateRoleModal;
