import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography, Checkbox, Radio, FormControlLabel, RadioGroup, Box, MenuItem, GlobalStyles } from '@mui/material'; // Importa o botão do Material-UI
import 'react-phone-number-input/style.css'



const Formulario = () => {
    //=> indica uma função 
    //no inicio do codigo, como boa pratica, informar sempre as constantes
    const [nome, setNome] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [documento, setDocumento] = useState<string>('');//useState é o valor em tempo real
    const [inscricao, setInscricao] = useState<string>('');
    const [cnpjInfo, setCnpjInfo] = useState<any | null>(null); // O tipo 'any' pode ser ajustado conforme a estrutura exata dos dados
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [localidade, setLocalidade] = useState('');
    const [complemento, setComplemento] = useState ('');
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
        setTipoPessoa(e.target.value as 'fisica' | 'juridica')
    };
    const handleCnpjChange = (value: string) => {
        setDocumento(value)
    };

    const validarDocumento = (doc: string) => {
        const value = doc.replace(/\D/g, '');
        setDocumento(value);
        if (value.length === 11) {
            //se o valor tiver 11 digitos, vai tentar validar como cpf
            if (validarCPF(value)) {
                console.log('CPF Válido!');
            } else {
                alert('CPF Inválido!');
            }
        } else if (value.length === 14) {
            if (validarCNPJ(value)) {
                buscarCnpj(value); //busca os dados do cnpj se for valido
            } else {
                alert('CNPJ Inválido!');
            }
        }
    }
    const validarCNPJ = (cnpj: string): boolean => {
        cnpj = cnpj.replace(/\D/g, '');  // Remover caracteres não numéricos
        console.log('CNPJ:', cnpj);

        if (cnpj.length !== 14) return false;  // CNPJ precisa ter 14 dígitos
        let tamanho = cnpj.length - 2;  // Considera os 12 primeiros dígitos
        let numeros = cnpj.substring(0, tamanho);  // Extrai os 12 primeiros dígitos
        let digitos = cnpj.substring(tamanho);  // Extrai os 2 últimos dígitos
        console.log('Numeros:', numeros);  // Depuração: Verificar os 12 primeiros dígitos
        console.log('Digitos:', digitos);  // Depuração: Verificar os 2 últimos dígitos

        let soma = 0;
        let pos = 5;  // Multiplicadores começam no 5 e reiniciam no 9

        // Cálculo do primeiro dígito verificador
        for (let i = tamanho; i >= 1; i--) {
            let char = numeros.charAt(i - 1);
            let valor = parseInt(char);
            soma += valor * pos;
            console.log(`Multiplicando ${valor} * ${pos}, soma agora: ${soma}`);
            pos--;
            if (pos < 2) pos = 9;  // Reinicia multiplicador quando chega em 2
        }
        let resultado = soma % 11 > 2 ? 0 : 11 - (soma % 11);  // Cálculo do primeiro dígito
        console.log('Primeiro dígito calculado:', resultado);
        if (resultado !== parseInt(digitos.charAt(0))) return false;  // Verificação do primeiro dígito

        // Cálculo do segundo dígito
        soma = 0;
        tamanho = tamanho + 1;  // Agora considera os 13 primeiros dígitos
        numeros = cnpj.substring(0, tamanho);
        pos = 6;  // O multiplicador agora começa no 6, e reinicia em 9

        for (let i = tamanho; i >= 1; i--) {
            let char = numeros.charAt(i - 1);
            let valor = parseInt(char);
            soma += valor * pos;
            console.log(`Multiplicando ${valor} * ${pos}, soma agora: ${soma}`);
            pos--;
            if (pos < 2) pos = 9;  // Reinicia multiplicador quando chega em 2
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);  // Cálculo do segundo dígito
        console.log('Segundo dígito calculado:', resultado);

        return resultado === parseInt(digitos.charAt(1));  // Verifica o segundo dígito
    };

    const validarCPF = (cpf: string): boolean => {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; //tem que ter 11 dig e não pode repertir
        let soma = 0;
        let resto: number;

        //calc 1digito
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        //cal 2digito
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.substring(10, 11)); // Verifica o segundo dígito
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
        const documento = cnpj.replace(/\D/g, ''); // Remove qualquer caractere não numérico

        if (documento.length === 14) { // Verifica se tem 14 dígitos
            try {
                const response = await axios.get(`http://localhost:5000/api/cnpj/${documento}`, {
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

    // Criação do objeto de dados a ser enviado
    const [formData, setFormData] = useState({
        tipoPessoa,
        contribuinte,
        documento,
        nome,
        fantasia,
        endereco: {
            cep,
            logradouro,
            numero,
            bairro,
            localidade,
            uf,
        },
        contato: {
            telefone,
            celular,
            email,
            responsavel,
        },
        observacoes,
        setor,
    });
    //função para envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!nome || !documento || !cep || !email) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }
        console.log("Form Data:", formData); // Verifica os dados no console (antes de enviar)
        localStorage.setItem('formData', JSON.stringify(formData)); // Salva no localStorage
    };

    const recuperarDados = () => {
        const dadosSalvos = localStorage.getItem('formData');
        if (dadosSalvos) {
            const formDataRecuperado = JSON.parse(dadosSalvos);
            setFormData(formDataRecuperado); // Atualiza o estado com os dados recuperados
        }
    };
    // useEffect para carregar os dados do localStorage quando o componente for montado
    React.useEffect(() => {
        recuperarDados();
    }, []); // O array vazio faz isso ocorrer apenas uma vez, na montagem do componente.

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
                <Grid container spacing={2} textAlign={'left'} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Grid item xs={12}>
                        <Typography variant='h4'
                            gutterBottom
                            sx={{
                                fontFamily: 'Montserrat, sans-serif',
                                color: '#2196F3',
                                fontWeight: '600',
                                fontSize: '40px',
                                lineHeight:'49px',
                                textAlign: 'rigth', // Alinha o texto à esquerda
                                marginBottom: '16px', // Dá um espaçamento entre o título e o conteúdo

                            }}
                        >
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

                <Grid container spacing={2} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Grid item xs={8} sm={4}>
                        <TextField
                            label='CPF/CNPJ'
                            placeholder="Digite CPF ou CNPJ"  // O placeholder aparece dentro do campo
                            name="documento"
                            id="documento"
                            value={documento}
                            onChange={(e) => handleCnpjChange(e.target.value)}
                            onBlur={() => validarDocumento(documento)} //ativado quando perde o foco
                            fullWidth
                            required
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
                

                {/* Exibe mensagem de erro caso CPF/CNPJ seja inválido */}
                {documento.length === 14 && cnpjInfo && (
                    <div>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Informações do CNPJ:
                        </Typography>
                        <Typography>
                            <strong>Nome:</strong> {cnpjInfo?.nome}
                        </Typography>
                        <Typography>
                            <strong>Fantasia:</strong> {cnpjInfo?.fantasia || 'Não disponível'}
                        </Typography>
                        <Typography>
                            <strong>Atividade:</strong> {cnpjInfo.atividade_principal?.[0]?.text || 'Não disponível'}
                        </Typography>
                        <Typography>
                            <strong>Endereço:</strong> {cnpjInfo?.logradouro || 'Não disponível'}, {cnpjInfo.bairro || 'Não disponível'}, {cnpjInfo.municipio || 'Não disponível'} - {cnpjInfo.uf || 'Não disponível'}
                        </Typography>
                    </div>
                )}


                {/* Campo para o Nome Completo */}
                <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                    <Grid container spacing={1} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Cep"
                            type="text"
                            name="cep"
                            id="cep"
                            placeholder="Digite o CEP"
                            value={cep}
                            onChange={handleCepChange}
                            onBlur={buscarCep} // buscar cep quando o campo perde o foco
                            fullWidth
                            required
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
                            placeholder="Número da casa, apartamento"
                            fullWidth
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
                            placeholder="Bairro"
                            fullWidth
                            required
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
                        placeholder='Complemento'
                        fullWidth
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
                            placeholder="Cidade"
                            fullWidth
                            required
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
                            placeholder='UF'
                            fullWidth
                        />
                    </Grid>
                </Grid>
                </Grid>

                {/* Contato do Cliente */}
                <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                    <Grid container spacing={2} textAlign={'left'} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
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

                            />
                        </Grid>
                        {/*responsavel pelo telefone de contato*/}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Responsável"
                                type='text'
                                name='responsavel'
                                id='responsavel'
                                placeholder='Responsável pelo Contato'
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                                fullWidth

                            />
                        </Grid>
                    </Grid>
                </Grid>


                {/* Campo para email e seletor de setor */}
                <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={validateEmail}
                            sx={{ marginBottom: '16px' }}
                            fullWidth
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
                <Grid container spacing={2} textAlign={'left'} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
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

                <Grid container spacing={2} textAlign={'left'} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Button variant="contained" color="primary" type="submit">
                        Enviar
                    </Button>
                </Box>
            </form>
        </Box >
        </>
    );
};

export default Formulario;
