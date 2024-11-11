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

function Layout({ children }) {
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';
    const isUserOrRolesPage = location.pathname === '/usuarios' || location.pathname === '/roles' || location.pathname === '/citas' || location.pathname === '/odontologos'
    || location.pathname === '/usuarios:id' || location.pathname === '/recepcionistas';

    return (
        <>
            {!isLoginPage && !isUserOrRolesPage && <NavComponent />}
            {isUserOrRolesPage && <NavComponentLogin />}
            {!isUserOrRolesPage && !isLoginPage && <BodyComponent />}
            {children}
            {!isUserOrRolesPage && !isLoginPage && <FooterComponent />}
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                    <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/login" element={<LoginComponent />} />
                        
                        <Route path="/usuarios" element={
                            <ProtectedRoute roles={['RECEPCIONISTA','ODONTOLOGO','ADMINISTRADOR']}>
                                <UsuariosComponent />
                            </ProtectedRoute>
                        } />
                        <Route path="/odontologos" element={<ProtectedRoute roles={['RECEPCIONISTA','ADMINISTRADOR']}>
                                <OdontologosComponent />
                            </ProtectedRoute>} />
                        <Route path="/roles" element={<ProtectedRoute roles={['ADMINISTRADOR']}>
                                <RolesComponent />
                            </ProtectedRoute>} />
                        <Route path="/recepcionistas" element={<ProtectedRoute roles={['ODONTOLOGO','ADMINISTRADOR']}>
                                <RecepcionistasComponent />
                            </ProtectedRoute>} />
                        <Route path="/citas" element={ <ProtectedRoute roles={['RECEPCIONISTA','ODONTOLOGO','ADMINISTRADOR']}>
                                <CitasComponent />
                            </ProtectedRoute>} />

                        <Route path="/odontologos/:id" element={<ProtectedRoute roles={['ADMINISTRADOR']}>
                                <ShowOdontologoModal />
                            </ProtectedRoute>} /> 

                        <Route path="/usuarios/:id" element={ <ProtectedRoute roles={['RECEPCIONISTA','ODONTOLOGO','ADMINISTRADOR']}>
                                <ShowUsuarioModal />
                            </ProtectedRoute>} /> 

                        {/* Otras rutas si es necesario */}
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
