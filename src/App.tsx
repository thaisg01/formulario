import React from 'react'; // Certifique-se de importar o React
import Botao from '../src/components/Button' // Verifique o caminho correto do Botao
import Formulario from '../src/components/Formulario'; // Verifique o caminho correto do Formulario

function App() {
  return (
    <div className="App">
      <Formulario /> {/* Formulario já inclui o Botao internamente */}
    </div>
  );
}

export default App;
