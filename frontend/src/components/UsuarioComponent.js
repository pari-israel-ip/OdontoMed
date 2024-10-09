import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, List, ListItem, IconButton, Flex } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import usuarioService from '../services/usuarioService';  // Asegúrate de que la ruta sea correcta
import EditUsuarioModal from './EditUsuarioModal';  // Ruta al modal de edición
import CreateUsuarioModal from './CreateUsuarioModal';  // Ruta al modal de creación

const UsuariosComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            const response = await usuarioService.getUsuarios();
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    };

    const handleDelete = async (id_usuario) => {
        try {
            await usuarioService.deleteUsuario(id_usuario);
            loadUsuarios();
        } catch (error) {
            console.error('Error deleting usuario:', error);
        }
    };

    const handleEdit = (usuario) => {
        setCurrentUsuario(usuario);
        setIsEditModalOpen(true);
    };

    const handleSave = async (updatedUsuario) => {
        try {
            await usuarioService.updateUsuario(updatedUsuario.id_usuario, {
                nombres: updatedUsuario.nombres,
                apellidos: updatedUsuario.apellidos,
                ci: updatedUsuario.ci,
                email: updatedUsuario.email,
                telefono: updatedUsuario.telefono,
                fecha_nacimiento: updatedUsuario.fecha_nacimiento,
                rol: updatedUsuario.rol,
                direccion: updatedUsuario.direccion,
                contrasenia: updatedUsuario.contrasenia,
            });
            loadUsuarios();
            setIsEditModalOpen(false);  // Cerrar modal después de guardar
        } catch (error) {
            console.error('Error updating usuario:', error);
        }
    };

    const handleCreate = async (newUsuario) => {
        try {
            await usuarioService.createUsuario(newUsuario);  // Asegúrate de tener esta función en usuarioService
            loadUsuarios();
            setIsCreateModalOpen(false);  // Cerrar modal después de crear
        } catch (error) {
            console.error('Error creating usuario:', error);
        }
    };

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Usuarios</Heading>

            <Button colorScheme="teal" onClick={() => setIsCreateModalOpen(true)} mb={4}>
                Crear Nuevo Usuario
            </Button>

            <List spacing={3}>
                {usuarios.map((usuario) => (
                    <ListItem key={usuario.id_usuario}>
                        <Flex justify="space-between" align="center">
                            {`${usuario.nombres} ${usuario.apellidos}`}
                            <Box>
                                <IconButton
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleEdit(usuario)}
                                    mr={2}
                                />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleDelete(usuario.id_usuario)}
                                />
                            </Box>
                        </Flex>
                    </ListItem>
                ))}
            </List>

            {/* Modal de edición */}
            {isEditModalOpen && (
                <EditUsuarioModal
                    usuario={currentUsuario}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Modal de creación */}
            {isCreateModalOpen && (
                <CreateUsuarioModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </Box>
    );
};

export default UsuariosComponent;
