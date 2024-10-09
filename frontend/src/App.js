import logo from './logo.svg';
import './App.css';
import React from 'react';
import RolesComponent from './components/RolesComponent';  // Ajusta la ruta si es necesario
import UsuariosComponent from './components/UsuarioComponent';
import LoginComponent from './components/LoginComponent';  // Importa el componente de login


function App() {
    return (
        <div className="App">
            <h1>Gestión de Roles</h1>
            <RolesComponent />
            <h1>Gestion Usuarios</h1>
            <UsuariosComponent/>
            <LoginComponent/>
           
        </div>
    );
}

export default App;
