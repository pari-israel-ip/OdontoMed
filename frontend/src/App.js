import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavComponent from './components/NavComponent';
import RolesComponent from './components/RolesComponent';
import LoginComponent from './components/LoginComponent';
import UsuariosComponent from './components/UsuarioComponent';  // Otros componentes que necesites

// Componente para manejar la estructura de la aplicación
function Layout({ children }) {
    const location = useLocation();  // Hook para obtener la ruta actual

    // Condicionamos que el NavComponent no se renderice en la ruta "/login"
    return (
        <>
            {location.pathname !== '/login' && <NavComponent />}
            {children}  {/* Aquí se renderizan las rutas hijas */}
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
                        <Route path="/usuarios" element={<UsuariosComponent />} />
                        <Route path="/roles" element={<RolesComponent />} />

                        {/* Agrega más rutas si es necesario */}
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
