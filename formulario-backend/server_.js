const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// Definir a porta para o servidor
const PORT = process.env.PORT || 5000;

// Habilitar CORS para o servidor
app.use(cors());

// Servir as APIs da aplicação (back-end)
app.get('/api/cnpj/:cnpj', (req, res) => {
  // Simulando resposta da API
  console.log('chegou')
  const cnpjData = {
    cnpj: req.params.cnpj,
    nome: 'Exemplo de Empresa',
    situacao: 'Ativa',
    // ... outros dados
  };
  res.json(cnpjData);
});

// Servir o front-end (React) após a build
app.use(express.static(path.join(__dirname, 'build')));

// Roteamento para o front-end (React)
app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});