import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavComponent from './components/NavComponent';
import NavComponentLogin from './components/NavComponentLogin'; // Importa el nuevo componente
import BodyComponent from './components/BodyComponent';
import FooterComponent from './components/FooterComponent';
import LoginComponent from './components/LoginComponent';
import RolesComponent from './components/RolesComponent';
import UsuariosComponent from './components/UsuarioComponent';

// Componente para manejar la estructura de la aplicación
function Layout({ children }) {
    const location = useLocation();  // Hook para obtener la ruta actual

    // Verificamos las rutas que deben mostrarse sin el Nav, Body y Footer
    const isLoginPage = location.pathname === '/login';
    const isUserOrRolesPage = location.pathname === '/usuarios' || location.pathname === '/roles';

    return (
        <>
            {!isLoginPage && !isUserOrRolesPage && <NavComponent />} {/* No mostrar Nav en /login y en /usuarios y /roles */}
            {isUserOrRolesPage && <NavComponentLogin />} {/* Mostrar NavComponentLogin en /usuarios y /roles */}
            {!isUserOrRolesPage && !isLoginPage && <BodyComponent />} {/* No mostrar Body en /usuarios y /roles */}
            {children}  {/* Aquí se renderizan las rutas hijas */}
            {!isUserOrRolesPage && !isLoginPage && <FooterComponent />} {/* No mostrar Footer en /usuarios y /roles */}
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/pacientes" element={<UsuariosComponent />} />
                        <Route path="/roles" element={<RolesComponent />} />
                        {/* Agrega más rutas si es necesario */}
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
