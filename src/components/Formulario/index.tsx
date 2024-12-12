import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography, Checkbox, Radio, FormControlLabel, RadioGroup, Box, MenuItem, GlobalStyles } from '@mui/material'; // Importa o botão do Material-UI
import 'react-phone-number-input/style.css'
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Form } from 'react-router-dom';

interface CnpjInfo {
    nome: string,
    fantasia: string,
    cnpj: string,
    inscricao: string,
    logradouro: string,
    complemento: string,
    bairro: string,
    municipio: string,
    uf: string,
    numero: string,
    telefone: string,
    cep: string
    email: string
}

// Definindo as interfaces para as partes do formulário
interface Endereco {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface Contato {
    telefone: string;
    celular: string;
    email: string;
    responsavel: string;
}

interface FormData {
    tipoPessoa: 'fisica' | 'juridica' | '';
    contribuinte: string;
    documento: string;
    nome: string;
    fantasia: string;
    endereco: Endereco;
    contato: Contato;
    observacoes?: string;
    setor: string;
}


const Formulario = () => {
    //=> indica uma função 
    //no inicio do codigo, como boa pratica, informar sempre as constantes
    const [nome, setNome] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [documento, setDocumento] = useState<string>('');//useState é o valor em tempo real
    const [inscricao, setInscricao] = useState<string>('');
    const [cnpjInfo, setCnpjInfo] = useState<CnpjInfo | null>(null);
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [localidade, setLocalidade] = useState('');
    const [complemento, setComplemento] = useState('');
    const [uf, setUf] = useState('');
    const [ibge, setIbge] = useState('');
    //sera um valor booleano, ou null caso ainda nao tenha sido validado
    const [cepErro, setCepErro] = useState('');
    const [email, setEmail] = useState('');
    const [contribuinte, setContribuinte] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica' | ''>('');
    const [observacoes, setObservacoes] = useState('');
    const [celular, setCelular] = useState('');
    const [telefone, setTelefone] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [setor, setSetor] = useState('');



    const formData: FormData = {
        tipoPessoa: '',
        contribuinte: '',
        documento: 'string',
        nome: '',
        fantasia: '',
        endereco: {
            cep: '',
            logradouro: '',
            numero: '',
            bairro: '',
            localidade: '',
            uf: '',
        },
        contato: {
            telefone: '',
            celular: '',
            email: '',
            responsavel: '',
        },
        observacoes: '',
        setor: '',
    };


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
    };
    const validateEmail = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("O email digitado é inválido");  //! siginifica que nunca pode ser nulo ou indefinido
        }
    };
    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNome(e.target.value);
    };
    const handleTipoPessoaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTipoPessoa(e.target.value === 'fisica' ? 'fisica' : 'juridica');
    };
    const handleCnpjChange = (value: string) => {
        setDocumento(value)
    };

    const validarDocumento = (doc: string) => {
        if (doc) {
            const value = doc.replace(/\D/g, '');
            setDocumento(value);
            if (value.length === 11) {
                //se o valor tiver 11 digitos, vai tentar validar como 
                const textoCpf = value.replace(/\D/g, '');
                if (cpf.isValid(textoCpf)) {
                    console.log('CPF Válido!');
                } else {
                    alert('CPF Inválido!');
                }
            } else if (value.length === 14) {
                const textoCnpj = value.replace(/\D/g, '');
                if (cnpj.isValid(textoCnpj)) {
                    buscarCnpj(textoCnpj); //busca os dados do cnpj se for valido
                } else {
                    alert('CNPJ Inválido!');
                }
            }
        }
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputCep = e.target.value;

        // Impede que o CEP tenha mais de 8 caracteres
        if (inputCep.length <= 8) {
            setCep(inputCep);
        }
    };
    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        //funcao para validar telefone
        const formattedValue = value
            .replace(/\D/g, '') //remove caracteres nao numericos
            .replace(/^(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3') // Adiciona o hífen
            .slice(0, 15); // Limita a 15 caracteres
        setTelefone(formattedValue);
    }
    const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        //funcao para validar celular
        const formattedValue = value
            .replace(/\D/g, '') //remove caracteres nao numericos
            .replace(/^(\d{2})(\d)/, '($1) $2') //parentese e espaco
            .replace(/(\d{5})(\d{1,4})/, '$1-$2') // Adiciona o hífen
            .slice(0, 15); // Limita a 15 caracteres
        setCelular(formattedValue);
    }
    // Função para lidar com o envio do formulário
    const handleSetorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetor(e.target.value);
    }
    //funcao para validar e buscar o endereco atraves do cep
    const buscarCep = async () => { //async significa que a funcao é assincrona
        const cepFormatado = cep.replace(/\D/g, ''); // Remove caracteres não numéricos


        if (cepFormatado.length === 8) {
            const url = `https://viacep.com.br/ws/${cepFormatado}/json/`;
            //try = tentar executar, caso erro, trata em catch
            try {
                const response = await fetch(url); //fecth faz requisicao http
                const data = await response.json(); //await = aguarda requisicao
                console.log("Resposta da API:", data);
                //a variavel data tem um objeto java retornado pela api, e precisa ser convertido para json


                //verifica se cep é valido
                if (data.erro) {
                    setCepErro('CEP inválido!');
                    setLogradouro('');
                    setBairro('');
                    setLocalidade('');
                    setUf('');
                    setIbge('');
                } else {
                    setCepErro('');
                    setLogradouro(data.logradouro);
                    setBairro(data.bairro || ''); //se não tiver bairro, define string vazia
                    setLocalidade(data.localidade || '');
                    setUf(data.uf || '');
                    setIbge(data.ibge || '');
                }
            } catch (error) {
                setCepErro('Erro ao buscar CEP!');
                console.error(error);
            }
        } else {
            setCepErro('CEP inválido!');
        }
    };
    // Função para buscar os dados do CNPJ/
    const buscarCnpj = async (cnpj: string) => {
        // const documento = cnpj.replace(/\D/g, ''); // Remove qualquer caractere não numérico

        if (documento.length === 14) { // Verifica se tem 14 dígitos
            try {
                const response = await axios.get(`http://localhost:5000/api/cnpj/${cnpj}`, {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                console.log('data', response)
                const data = response.data; // Os dados já estão disponíveis aqui

                if (data.status === 'OK') {
                    setCnpjInfo(data); // Armazena as informações do CNPJ no estado
                    console.log('Dados do CNPJ:', data);
                } else {
                    alert('CNPJ não encontrado!');
                }
            } catch (error) {
                console.error('Erro ao buscar CNPJ:', error);
                alert('Erro ao buscar informações do CNPJ.');
            }
        } else {
            alert('CNPJ inválido!');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Verifica se todos os campos obrigatórios estão preenchidos


        console.log("nome",nome)
        console.log("documento",documento)
        console.log("cep",cep)

        if (!nome || !documento || !cep ) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }
    
        // Criação do novo cliente
        const novoCliente = {
            id: String(new Date().getTime()), // Gerando ID com base no timestamp
            nome,
            documento,
            fantasia: fantasia || "",
            endereco: {
                cep,
                logradouro,
                numero,
                bairro,
                localidade,
                uf
            },
            contato: {
                telefone,
                celular,
                email,
                responsavel
            },
            observacoes: observacoes || "",
            setor,
            contribuinte: contribuinte || false, // Atribui 'false' caso contribuinte não tenha sido selecionado
            tipoPessoa,
        };
    
        console.log("Novo Cliente:", novoCliente); // Verifica os dados no console (antes de enviar)
    
        // Recupera os dados do localStorage
        const clientesSalvos = localStorage.getItem('formData');
        let listaClientes = clientesSalvos ? JSON.parse(clientesSalvos) : [];
    
        // Garante que listaClientes seja um array
        if (!Array.isArray(listaClientes)) {
            listaClientes = [];
        }
    
        // Adiciona o novo cliente à lista
        listaClientes.push(novoCliente);
    
        // Salva a lista de clientes atualizada no localStorage
        localStorage.setItem('formData', JSON.stringify(listaClientes));
        alert('Cliente cadastrado com sucesso!');
    };
    
    useEffect(() => {
        if (cnpjInfo) {
            setFantasia(cnpjInfo.fantasia);
            setNome(cnpjInfo.nome);
            setDocumento(cnpjInfo.cnpj);
            setInscricao(cnpjInfo.inscricao);
            setLogradouro(cnpjInfo.logradouro);
            setLocalidade(cnpjInfo.municipio);
            setBairro(cnpjInfo.bairro);
            setNumero(cnpjInfo.numero);
            setComplemento(cnpjInfo.complemento);
            setCep(cnpjInfo.cep);
            setUf(cnpjInfo.uf);
            setTelefone(cnpjInfo.telefone);
            setEmail(cnpjInfo.email)

            console.log('entrou')
        }
    }, [cnpjInfo]);

    return (
        <>
            <GlobalStyles
                styles={{
                    body: {
                        margin: '0', // Remove a margem do body
                        padding: '0', // Remove o padding do body (se houver)
                    },
                }}
            />

            <Box sx={{
                maxWidth: '1000px', //largura
                width: '100%',//responsividade
                margin: '30px auto', //centraliza
                padding: '35px', //espacamento interno
                backgroundColor: '#e0e4e7',
                border: '1px solid #2196F3',
                borderRadius: '16px',// bordas arredondadas            
            }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid
                        container
                        spacing={2}
                        textAlign={'left'}
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12}>
                            <Typography variant='h4'
                                gutterBottom
                                sx={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#2196F3',
                                    fontWeight: '600',
                                    fontSize: '40px',
                                    lineHeight: '49px',
                                    textAlign: 'rigth', // Alinha o texto à esquerda
                                    marginBottom: '16px', // Dá um espaçamento entre o título e o conteúdo
                                }}                        >
                                Cadastro de Cliente
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#696969',
                                    fontWeight: 'bold',
                                    textAlign: 'left', // Garante que o texto fique à esquerda
                                }}
                            >
                                Dados do Cliente
                            </Typography>
                        </Grid>

                        {/* Tipo de Pessoa */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Tipo:</Typography>
                            <RadioGroup
                                row //colocar o radiobutton na vertical, sem ficaria na horizontal
                                value={tipoPessoa}
                                onChange={handleTipoPessoaChange}

                            >
                                <FormControlLabel
                                    value="fisica"
                                    control={<Radio />}
                                    label="Pessoa Física"
                                />
                                <FormControlLabel
                                    value="juridica"
                                    control={<Radio />}
                                    label="Pessoa Jurídica"
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={2}
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                label={tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                                name="documento"
                                id="documento"
                                value={documento}
                                onChange={(e) => handleCnpjChange(e.target.value)}
                                onBlur={() => validarDocumento(documento)} //ativado quando perde o foco
                                fullWidth
                                required
                                autoComplete="off"
                                InputLabelProps={{
                                    shrink: true, // Garante que o label flutue mesmo com valor inicial
                                }}
                                inputProps={{
                                    maxLength: tipoPessoa === 'fisica' ? 11 : 14, // Valida o comprimento
                                }}

                            />
                        </Grid>
                        <Grid item xs={8} sm={4} container spacing={2} alignItems="center">
                            <Grid item xs={10} sm={11}>
                                <TextField
                                    label="Inscrição Estadual"
                                    type='text'
                                    name='inscricao'
                                    id='inscricao'
                                    variant='outlined'
                                    value={inscricao}
                                    onChange={(e) => setInscricao(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2} sm={1}>
                                <FormControlLabel //conferir se é contribuinte
                                    control={
                                        <Checkbox
                                            checked={contribuinte === "sim"}
                                            onChange={(e) =>
                                                setContribuinte(e.target.checked ? "sim" : "não") //atualiza o estado de contribuinte
                                            }
                                        />
                                    }
                                    label="Contribuinte?"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Campo para o Nome Completo */}
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nome Completo"
                                type='text'
                                name='nome'
                                id='nome'
                                variant="outlined"
                                value={nome}
                                fullWidth
                                required
                                onChange={(e) => setNome(e.target.value)}
                                InputLabelProps={{
                                    shrink: true, // Garante que o label flutue mesmo com valor inicial
                                }}
                            />
                        </Grid>

                        {/*Fantasia*/}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nome Fantasia"
                                type='text'
                                name='fantasia'
                                id='fantasia'
                                variant='outlined'
                                value={fantasia}
                                fullWidth
                                onChange={(e) => setFantasia(e.target.value)}
                                InputLabelProps={{
                                    shrink: true, // Garante que o label flutue mesmo com valor inicial
                                }}
                            />
                        </Grid>

                        {/* Título para Endereço */}
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#696969',
                                    fontWeight: 'bold',
                                    textAlign: 'left', // Garante que o texto fique à esquerda
                                }}
                            >
                                Endereço
                            </Typography>
                        </Grid>

                        {/* Campo para CEP */}
                        <Grid
                            container
                            spacing={1}
                            sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    label="Cep"
                                    type="text"
                                    name="cep"
                                    id="cep"
                                    value={cep}
                                    onChange={handleCepChange}
                                    onBlur={buscarCep} // buscar cep quando o campo perde o foco
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                                {/*Exibe mensagem de erro caso o CEP seja inválido*/}
                                {cepErro && <Typography color="error">{cepErro}</Typography>}
                            </Grid>

                            {/* Campo para Endereço */}
                            <Grid item xs={18} sm={9}>
                                <TextField
                                    label="Endereço"
                                    type="text"
                                    name="logradouro"
                                    id="logradouro"
                                    value={logradouro}
                                    onChange={(e) => setLogradouro(e.target.value)} // Permite edição do campo de endereço
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>


                            {/* Campo para Número */}
                            <Grid item xs={4} sm={2}>
                                <TextField
                                    label="Número"
                                    type="text"
                                    name="numero"
                                    id="numero"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>

                            {/*campo para bairro*/}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Bairro"
                                    type="text"
                                    name="bairro"
                                    id="bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>

                            {/*campo para complemento*/}
                            <Grid item xs={8} sm={4}>
                                <TextField
                                    label="Complemento"
                                    type="text"
                                    name="complemento"
                                    id="complemento"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>

                            {/*campo para cidade*/}
                            <Grid item xs={18} sm={9}>
                                <TextField
                                    label="Cidade"
                                    type="text"
                                    name="localidade"
                                    id="localidade"
                                    value={localidade}
                                    onChange={(e) => setLocalidade(e.target.value)}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>
                            {/* UF */}
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    label="UF"
                                    type="text"
                                    name="uf"
                                    id="uf"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Contato do Cliente */}
                    <Grid
                        container spacing={2}
                        justifyContent="center"
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#696969',
                                    fontWeight: 'bold',
                                    textAlign: 'left', // Garante que o texto fique à esquerda
                                }}
                            >
                                Contato do Cliente
                            </Typography>
                        </Grid>
                        {/* Campo Telefone */}
                        <Grid
                            container
                            spacing={2}
                            textAlign={'left'}
                            sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <Grid item xs={12} sm={4}>
                                <TextField //container organiza os elementos na linha, xs para tela menores e sm para telas maiores
                                    label="Telefone"
                                    type="text"
                                    name="telefone"
                                    id="telefone"
                                    placeholder="(XX) XXXX-XXXX"
                                    value={telefone}
                                    onChange={handleTelefoneChange}
                                    fullWidth
                                    inputProps={{ maxLength: 15 }} //limite de caract
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>

                            {/*Campo para Celular*/}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Celular"
                                    type='text'
                                    name='celular'
                                    id='celular'
                                    placeholder="(XX) XXXXX-XXXX"
                                    value={celular}
                                    onChange={handleCelularChange}
                                    fullWidth
                                    inputProps={{ maxLength: 15 }}
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>
                            {/*responsavel pelo telefone de contato*/}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Responsável"
                                    type='text'
                                    name='responsavel'
                                    id='responsavel'
                                    value={responsavel}
                                    onChange={(e) => setResponsavel(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label flutue mesmo com valor inicial
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>


                    {/* Campo para email e seletor de setor */}
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={validateEmail}
                                sx={{ marginBottom: '16px' }}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true, // Garante que o label flutue mesmo com valor inicial
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Setor Responsável"
                                value={setor}
                                onChange={handleSetorChange}
                                fullWidth
                            >
                                <MenuItem value="fiscal">Fiscal</MenuItem>
                                <MenuItem value="financeiro">Financeiro</MenuItem>
                                <MenuItem value="comercial">Comercial</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* Observação */}
                    <Grid
                        container
                        spacing={2}
                        textAlign={'left'}
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#696969',
                                    fontWeight: 'bold',
                                    textAlign: 'left', // Garante que o texto fique à esquerda
                                }}
                            >
                                Informações Adicionais
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={2}
                        textAlign={'left'}
                        sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name='observacoes'
                                id="observacoes"
                                label="Observações"
                                multiline
                                rows={4}
                                fullWidth
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />
                        </Grid>
                    </Grid>



                    {/* Botão de envio */}
                    {/* Adiciona o botão do Material-UI */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '16px',
                        }}>
                        <Button onClick={(e) => handleSubmit(e)}>Enviar</Button>
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default Formulario;
