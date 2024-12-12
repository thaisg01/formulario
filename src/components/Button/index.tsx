import React from 'react';
import { Button } from '@mui/material';  // Usando Material-UI 
//no header significa que ele esta no topo do relatório. 
//o onclick redireciona 
const Botao = ({ texto, onClick }: { texto: string; onClick: () => void }) => {
    return (
        <header>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.href = "/cadastro"} // Redireciona para a página de cadastro
            >
                Cadastrar Cliente
            </Button>
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => window.location.href = "/clientes"} // Redireciona para a página de lista de clientes
            >
                Lista de Clientes
            </Button>
            <Button variant="contained" color="primary" type="submit">Enviar</Button>
        </header>
    );
};

export default Botao;