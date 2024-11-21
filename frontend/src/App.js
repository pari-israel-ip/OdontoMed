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
import VerificarCodigoComponent from './components/VerificarCodigoComponent'; // Importar el componente
import RurteOfControl from './components/rurte_ofcontrol'; // Importa el componente de rutas fuera de control

function Layout({ children }) {
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';
    const isUnauthorizedPage = location.pathname === '/unauthorized'; // Nueva excepción
    const isUserOrRolesPage =
        location.pathname === '/usuarios' ||
        location.pathname === '/roles' ||
        location.pathname === '/citas' ||
        location.pathname === '/odontologos' ||
        location.pathname === '/usuarios:id' ||
        location.pathname === '/recepcionistas';
    const isRecoveryPage = location.pathname === '/recuperar-contrasena';
    const isRecoveryPage2 = location.pathname === '/verificar-codigo';

    if (isLoginPage || isUnauthorizedPage || isRecoveryPage || isRecoveryPage2) {
        return <>{children}</>; // Sin Nav, Body ni Footer
    }

    return (
        <>
            {!isUserOrRolesPage && <NavComponent />}
            {isUserOrRolesPage && <NavComponentLogin />}
            {!isUserOrRolesPage && <BodyComponent />}
            {children}
            {!isUserOrRolesPage && <FooterComponent />}
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        {/* Rutas definidas */}
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/recuperar-contrasena" element={<RecuperarContrasenaComponent />} />
                        <Route path="/verificar-codigo" element={<VerificarCodigoComponent />} />
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
                        <Route
                            path="/roles"
                            element={
                                
                                    <RolesComponent />
                                    
                            }
                        />
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
                        <Route
                            path="/odontologos/:id"
                            element={
                              
                                    <ShowOdontologoModal />
                         
                            }
                        />
                        <Route
                            path="/usuarios/:id"
                            element={
                               
                                    <ShowUsuarioModal />
                             
                            }
                        />
                        {/* Ruta para manejar páginas no encontradas */}
                        <Route path="*" element={<RurteOfControl />} />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
