import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from '@mui/material'

const ListaClientes = () => {
    const [clientes, setClientes] = useState<any[]>([]);

    useEffect(() => {
        //recuperando dados da localStorange
        const dadosSalvos = localStorage.getItem("formData");
        if (dadosSalvos) {
            setClientes(JSON.parse(dadosSalvos)); //adc dados em um array
        }
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant='h4'
                gutterBottom
                sx={{
                    fontFamily: 'Roboto, sans-serif',
                    color: '#3283e2',
                    fontWeight: 'bold',
                    textAlign: 'rigth', // Alinha o texto à esquerda
                    marginBottom: '16px', // Dá um espaçamento entre o título e o conteúdo

                }}
            >
                Lista de Cliente
            </Typography>

            {clientes.length > 0 ? ( //verifica se há cliente. O clientes length retorna o numero do array, se for maior que 0, executa após ? operador ternario se 
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {clientes.map((cliente) => (
                        <Card key={cliente?.id} sx={{ backgroundColor: '#f9f9f9' }}>
                            <CardContent>
                                <Typography variant="h6">ID: {cliente?.id}</Typography>
                                <Typography variant="h6">Nome: {cliente?.nome}</Typography>
                                <Typography variant="body1">Documento: {cliente?.documento}</Typography>
                                <Typography variant="body1">Tipo de Pessoa: {cliente?.tipoPessoa}</Typography>
                                <Typography variant="body1">Contribuinte: {cliente?.contribuinte}</Typography>
                                <Typography variant="body1">Setor: {cliente?.setor}</Typography>
                                <Typography variant="body1">CEP: {cliente?.endereco.cep}</Typography>
                                <Typography variant="body1">Logradouro: {cliente?.endereco.logradouro}</Typography>
                                <Typography variant="body1">Número: {cliente?.endereco.numero}</Typography>
                                <Typography variant="body1">Bairro: {cliente?.endereco.bairro}</Typography>
                                <Typography variant="body1">Cidade: {cliente?.endereco.localidade}</Typography>
                                <Typography variant="body1">UF: {cliente?.endereco.uf}</Typography>
                                <Typography variant="body1">Telefone: {cliente?.contato.telefone}</Typography>
                                <Typography variant="body1">Celular: {cliente?.contato.celular}</Typography>
                                <Typography variant="body1">E-mail: {cliente?.contato.email}</Typography>
                                <Typography variant="body1">Responsável: {cliente?.contato.responsavel}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Observações: {cliente?.observacoes}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant='body1'>
                    Nenhum Cliente Cadastrado
                </Typography>
            )}
        </Box>
    );
};

export default ListaClientes;