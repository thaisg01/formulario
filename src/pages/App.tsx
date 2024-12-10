import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importação do React Router
import Botao from '../components/Button'; 
import Formulario from '../components/Formulario'; 
import ListaClientes from '../components/ListaClientes'; 

function App() {

  localStorage.setItem (
    
  )
  return (
    <Router>
      <div className="App">
        {/* Cabeçalho com os botões */}
        <header style={{ padding: '10px', background: '#f5f5f5', display: 'flex', gap: '10px' }}>
          <Botao
            texto="Cadastrar Cliente"
            onClick={() => (window.location.href = "/cadastro")}
          />
          <Botao
            texto="Lista de Clientes"
            onClick={() => (window.location.href = "/clientes")}
          />
        </header>

        {/* Configuração de Rotas */}
        <Routes>
          <Route path="/cadastro" element={<Formulario />} />
          <Route path="/clientes" element={<ListaClientes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
