import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Dependência para navegação
import useListaClientes from './useListaClientes';

const ListaClientes = () => {
  const { clientes } = useListaClientes();
  const navigate = useNavigate();

  const handleEditar = (id: string) => {
    navigate(`/editar-cliente/${id}`); // Redireciona para a página de edição
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          color: '#3283e2',
          fontWeight: 'bold',
          textAlign: 'left',
          marginBottom: '16px',
        }}
      >
        Lista de Clientes
      </Typography>

      {clientes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.id}</TableCell>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditar(cliente.id)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">Nenhum Cliente Cadastrado</Typography>
      )}
    </Box>
  );
};

export default ListaClientes;
