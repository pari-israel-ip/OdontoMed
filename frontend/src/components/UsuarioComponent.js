// src/components/UsuariosComponent.js
import React, { useEffect, useState } from 'react';
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
        } catch (error) {
            console.error('Error updating usuario:', error);
        }
    };

    const handleCreate = async (newUsuario) => {
        try {
            await usuarioService.createUsuario(newUsuario);  // Asegúrate de tener esta función en usuarioService
            loadUsuarios();
        } catch (error) {
            console.error('Error creating usuario:', error);
        }
    };

    return (
        <div>
            <h2>Usuarios</h2>
            <button onClick={() => setIsCreateModalOpen(true)}>Crear Nuevo Usuario</button>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id_usuario}>
                        {`${usuario.nombres} ${usuario.apellidos}`}
                        <button onClick={() => handleEdit(usuario)}>Edit</button>
                        <button onClick={() => handleDelete(usuario.id_usuario)}>Delete</button>
                    </li>
                ))}
            </ul>

            {isEditModalOpen && (
                <EditUsuarioModal
                    usuario={currentUsuario}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {isCreateModalOpen && (
                <CreateUsuarioModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default UsuariosComponent;
