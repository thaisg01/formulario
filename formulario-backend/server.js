const express = require('express');
const cors = require('cors');  // Importando o CORS
const axios = require('axios');

const app = express();

// Habilitando o CORS para permitir requisições do front-end
app.use(cors());

app.get('/api/cnpj/:cnpj', async (req, res) => {
  const cnpj = req.params.cnpj;
  try {
    const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`);
    res.json(response.data);  // Retorna os dados do CNPJ
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error);
    res.status(500).json({ error: 'Erro ao buscar CNPJ' });
  }
});

app.listen(5000, () => {
  console.log('Servidor rodando em http://localhost:5000');
});
