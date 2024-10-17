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
function Layout({ children }) {
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';
    const isUserOrRolesPage = location.pathname === '/usuarios' || location.pathname === '/roles'
    || location.pathname === '/usuarios:id';

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
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/usuarios" element={<UsuariosComponent />} />
                        <Route path="/roles" element={<RolesComponent />} />
                        <Route path="/usuarios/:id" element={<ShowUsuarioModal />} /> {/* Nueva ruta */}

                        {/* Otras rutas si es necesario */}
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
