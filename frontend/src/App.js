import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavComponent from './components/NavComponent';
import NavComponentLogin from './components/NavComponentLogin';
import BodyComponent from './components/BodyComponent';

import FooterComponent from './components/FooterComponent';
import LoginComponent from './components/LoginComponent';
import RolesComponent from './components/RolesComponent';
import UsuariosComponent from './components/UsuarioComponent';
import ShowUsuarioModal from './components/ShowUsuarioModal'; // Importa el modal
import OdontologosComponent from './components/OdontologoComponent';
import ShowOdontologoModal from './components/ShowOdontologoModal';
import RecepcionistasComponent from './components/RecepcionistaComponent';
import CitasComponent from './components/CitasComponent';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/unauthorized';
import RecuperarContrasenaComponent from './components/RecuperarContrasenaComponent';
import VerificarCodigoComponent from './components/VerificarCodigoComponent';
import PageNotFound from './components/PageNotFound'; // Importar el componente 404
import PageNotFoundShow from './components/PageNotFoundShow'; // Importar el componente 404


import { useEffect, useState } from 'react';

function Layout({ children }) {
    const location = useLocation();

    // Verifica si estamos en una página especial
    const isSpecialPage =
        location.pathname === '/login' ||
        location.pathname === '/unauthorized' ||
        location.pathname === '/recuperar-contrasena' ||
        location.pathname === '/verificar-codigo' ||
        location.pathname === '*' || // Esto asegura que captura cualquier ruta no válida
        location.pathname === '/404'||
        location.pathname === '/show404'; // Página 404

    // Si estamos en una página especial, no renderizamos el Nav ni el Footer
    if (isSpecialPage) {
        return <>{children}</>; // Solo renderiza el contenido (sin Nav ni Footer)
    }

    // Renderizado normal (con Navbar y Footer)
    return (
        <>
            {location.pathname.startsWith('/recepcionistas') ||location.pathname.startsWith('/citas') ||location.pathname.startsWith('/usuarios') || location.pathname.startsWith('/roles') || location.pathname.startsWith('/odontologos') ? (
                <NavComponentLogin />
            ) : (
                <NavComponent />
            )}
            {children}
            <FooterComponent />
        </>
    );
}





function App() {
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        {/* Rutas principales */}
                        <Route path="/" element={<BodyComponent />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<PageNotFound />} />
                        <Route path="/show404" element={<PageNotFoundShow />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/recuperar-contrasena" element={<RecuperarContrasenaComponent />} />
                        <Route path="/verificar-codigo" element={<VerificarCodigoComponent />} />
                        
                        {/* Rutas protegidas */}
                        <Route
                            path="/usuarios"
                            element={
                                <ProtectedRoute permisoRequerido="Ver Pacientes">
                                    <UsuariosComponent />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/odontologos"
                            element={
                                <ProtectedRoute permisoRequerido="Ver Odontólogos">
                                    <OdontologosComponent />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/roles" element={<RolesComponent />} />
                        <Route
                            path="/recepcionistas"
                            element={
                                <ProtectedRoute permisoRequerido="Ver Recepcionistas">
                                    <RecepcionistasComponent />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/citas"
                            element={
                                <ProtectedRoute permisoRequerido="Ver citas">
                                    <CitasComponent />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/odontologos/:id" element={<ShowOdontologoModal />} />
                        <Route path="/usuarios/:id" element={<ShowUsuarioModal />} />

                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
