import { useEffect, useState } from "react";

interface Cliente {
  id: string; 
  nome: string;
  fantasia: string;
  cnpj: string;
  inscricao: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  numero: string;
  telefone: string;
  cep: string;
  email: string;
  tipoPessoa: 'fisica' | 'juridica' | '';
  contribuinte: boolean;
  setor: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
  contato: {
    telefone: string;
    celular: string;
    email: string;
    responsavel: string;
  };
  observacoes?: string; // Campo opcional
}

export default function useListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("formData");
    if (dadosSalvos) {
      const parsedData: Cliente[] = JSON.parse(dadosSalvos); // Certifique-se de que o JSON é do tipo Cliente[]
      setClientes(parsedData);
    }
  }, []);

  // Função para adicionar um novo cliente e atualizar no localStorage
  const adicionarCliente = (novoCliente: Cliente) => {
    const listaAtualizada = [...clientes, novoCliente];
    setClientes(listaAtualizada);
    localStorage.setItem('formData', JSON.stringify(listaAtualizada));
  };

  return { clientes, adicionarCliente };
}
