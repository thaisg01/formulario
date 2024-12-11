import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; // Importação do React Router
import { AppBar, Toolbar, Button, Container, Box } from '@mui/material'
import Botao from '../components/Button';
import Formulario from '../components/Formulario';
import ListaClientes from '../components/ListaClientes';


const MenuVertical = () => {
  return (
    <Box
      sx={{
        fontFamily: 'Montserrat, sans-serif',
        width: '240px',
        height: '200vh',
        bgcolor: '#e0e4e7', // Cor de fundo (azul)
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
      }}
    >
      <Toolbar />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginBottom: '8px' }}
        href="/cadastro"
      >
        Cadastrar Cliente
      </Button>
      <Button variant="contained" color="primary" fullWidth href="/clientes">
        Lista de Clientes
      </Button>
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* Menu Vertical */}
        <MenuVertical />
        <Box
          sx={{
            flexGrow: 1,
            p: 4, // Padding interno
            backgroundColor: '#f9f9f9', // Fundo claro para contraste
            minHeight: '100vh', // Garante altura completa
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/cadastro" />} />
            <Route path="/cadastro" element={<Formulario />} />
            <Route path="/clientes" element={<ListaClientes />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;

