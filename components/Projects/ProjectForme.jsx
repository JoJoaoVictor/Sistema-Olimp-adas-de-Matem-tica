import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../form/Input.jsx';
import Select from '../form/Select.jsx';
import styles from './Projects.module.css';
import SubmitButton from '../form/SubmitButton.jsx';
import ImageUploader from '../form/ImageUploader.jsx';



function ProjectForme({ handleSubmit,projectData, btnText }) {
    // Estado para armazenar o projeto (inicializado com os dados recebidos por props)
    
    // Definindo os estados para cada campo do formulário
    const [name, setName] = useState(""); // Nome do projeto
    const [professorName, setProfessorName] = useState(""); // Nome do professor
    const [phaseLevel, setPhaseLevel] = useState(""); // Nível da fase
    const [difficultyLevel, setDifficultyLevel] = useState(""); // Nível de dificuldade
    const [knowledgeObjects, setKnowledgeObjects] = useState(""); // Objetos do conhecimento
    const [bnccTheme, setBnccTheme] = useState(""); // Tema da BNCC
    const [abilityCode, setAbilityCode] = useState(""); // Código da habilidade
    const [abilityDescription, setAbilityDescription] = useState(""); // Descrição da habilidade
    const [questionStatement, setQuestionStatement] = useState(""); // Enunciado da questão
    const [alternatives, setAlternatives] = useState(""); // Alternativas da questão
    const [correctAlternative, setCorrectAlternative] = useState(""); // Alternativa correta
    const [detailedResolution, setDetailedResolution] = useState(""); // Resolução detalhada
    const [categoryId, setCategoryId] = useState(1); // Estado para a categoria selecionada

    // Estado para mensagens de erro específicas (ex: nível de dificuldade)
    const [error, setError] = useState("");

    // Estado para mensagens de erro gerais (ex: campos não preenchidos)
    const [formError, setFormError] = useState("");

    // Estado para armazenar as categorias carregadas da API
    const [categoris, setCategoris] = useState([]);

    // useEffect para carregar as categorias da API ao montar o componente
    useEffect(() => {
        // Este useEffect executa duas operações principais:
        // 1. Inicializa os campos do formulário quando projectData está disponível (para edição)
        // 2. Carrega a lista de categorias da API
        
        // ==============================================
        //  INICIALIZAÇÃO DOS CAMPOS DO FORMULÁRIO
        // ==============================================
        if (projectData) {
            // Se projectData existe (modo de edição), preenche os campos do formulário
            // com os valores existentes. O operador || "" fornece um fallback vazio
            // caso algum campo não exista no projectData
            
            setName(projectData.name || "");               // Nome do projeto
            setProfessorName(projectData.professorName || ""); // Nome do professor
            setPhaseLevel(projectData.phaseLevel || "");   // Nível da fase
            setDifficultyLevel(projectData.difficultyLevel || ""); // Nível de dificuldade
            setKnowledgeObjects(projectData.knowledgeObjects || ""); // Objetos de conhecimento
            setBnccTheme(projectData.bnccTheme || "");     // Tema da BNCC
            setAbilityCode(projectData.abilityCode || ""); // Código da habilidade
            setAbilityDescription(projectData.abilityDescription || ""); // Descrição da habilidade
            setQuestionStatement(projectData.questionStatement || ""); // Enunciado
            setAlternatives(projectData.alternatives || ""); // Alternativas
            setCorrectAlternative(projectData.correctAlternative || ""); // Alternativa correta
            setDetailedResolution(projectData.detailedResolution || ""); // Resolução detalhada
            setCategoryId(projectData.categoryId || "");   // ID da categoria
            
            // o operador || para garantir que sempre teremos uma string
            // mesmo que o campo não exista no projectData ou seja null/undefined
        }
    
        //  CARREGAMENTO DAS CATEGORIAS DA API
        // Faz uma requisição GET para obter a lista de categorias disponíveis
        fetch("http://localhost:5000/categoris", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json' // Indica que esperamos JSON na resposta
            },
        })
        .then((resp) => {
            // Converte a resposta para JSON
            return resp.json();
        })
        .then((data) => {
            // Atualiza o estado com as categorias recebidas
            setCategoris(data);
        })
        .catch((err) => {
            // Captura e loga qualquer erro que ocorra durante o fetch
            console.error("Erro ao carregar categorias:", err);
        });
    
    }, [projectData]); // Dependências do useEffect:
                      // - Executa novamente sempre que projectData mudar
                      // - Executa uma vez quando o componente é montado (projectData inicial é undefined)

    // Função para validar o nível de dificuldade
    const handleDifficultyChange = (e) => {
        const value = e.target.value;

        // Verifica se o valor é um número entre 1 e 5
        if (value === "" || (!isNaN(value) && Number(value) >= 1 && Number(value) <= 5)) {
            setDifficultyLevel(value); // Atualiza o estado do nível de dificuldade
            setError(""); // Limpa a mensagem de erro
        } else {
            setError("Nível de dificuldade deve ser entre 1 e 5"); // Exibe mensagem de erro
        }
    };

    // Função para lidar com o envio do formulário
    const submitForm = (e) => {
        e.preventDefault(); // Impede o comportamento padrão de recarregar a página
         
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (
            !name ||
            !professorName ||
            !phaseLevel ||
            !difficultyLevel ||
            !knowledgeObjects ||
            !bnccTheme ||
            !abilityCode ||
            !abilityDescription ||
            !questionStatement ||
            
            !correctAlternative ||
            !detailedResolution  ||
            !categoryId 
            
        ) {
            setFormError("Por favor, preencha todos os campos."); // Exibe mensagem de erro
            return; // Interrompe o envio do formulário
        }
        // Se todos os campos estiverem preenchidos, prossegue com o envio
        // Cria o objeto do projeto
        const project = {
            name,
            professorName,
            phaseLevel,
            difficultyLevel: Number(difficultyLevel), // Converte para número
            knowledgeObjects,
            bnccTheme,
            abilityCode,
            abilityDescription,
            questionStatement,
            alternatives,
            correctAlternative,
            detailedResolution,
            categoryId: Number(categoryId) || 0, // Armazena o ID da categoria no projeto
            categoryName: categoris.find(cat => cat.id === String(categoryId))?.name || "Sem categoria", // Armazena o nome da categoria
            createdAt: new Date().toISOString() // Adiciona data de criação
        };
        
        // Se estiver editando (projectData tem ID), faz PUT/PATCH
        if (projectData?.id) {
        // Chama a função handleSubmit passada como prop (que deve fazer a atualização)
        handleSubmit(project);
        return;
        }

        // Determina o endpoint com base na categoria selecionada
        let endpoint = "projects"; // Endpoint padrão
        // Exibe mensagem de carregamento
        setFormError("Enviando projeto...");
        // Envia o projeto para o backend
        fetch(`http://localhost:5000/${endpoint}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Erro HTTP: ${resp.status}`);
                }
                return resp.json();
            })
            .then((data) => {
                console.log("Projeto enviado com sucesso:", data);
                setFormError(""); // Limpa a mensagem de erro
                
                // Exibe mensagem de sucesso temporária
                alert(`Projeto "${name}" enviado com sucesso para "`);
                
                // Limpa os campos do formulário após o envio
                setName("");
                setProfessorName("");
                setPhaseLevel("");
                setDifficultyLevel("");
                setKnowledgeObjects("");
                setBnccTheme("");
                setAbilityCode("");
                setAbilityDescription("");
                setQuestionStatement("");
                setAlternatives("");
                setCorrectAlternative("");
                setDetailedResolution("");
                setCategoryId("");
            
                
            })
            .catch((err) => {
                console.error("Erro ao enviar o projeto:", err);
                setFormError(`Erro ao enviar o projeto: ${err.message}. Tente novamente.`);
            });
            
    };


    return (
        <form className={styles.form} onSubmit={submitForm}>
            {/* Campo: Nome do Projeto */}
            <Input
                type="text"
                text="Insira o nome do Projeto"
                name="name"
                placeholder="Insira o nome"
                value={name}
                handleOnChange={(e) => setName(e.target.value)}
            />

            {/* Seção 1: Identificação do Professor */}
            <b>1. Identificação do Professor</b>
            <Input
                type="text"
                text="Nome do Professor"
                name="professorName"
                placeholder="Insira o nome do Professor"
                value={professorName}
                handleOnChange={(e) => setProfessorName(e.target.value)}
            />

            {/* Seção 2: Identificação das Questões */}
            <b>2. Identificação das Questões: etapa de elaboração</b>
            <Input
                type="text"
                text="Nível da Fase"
                name="phaseLevel"
                placeholder="Insira o nível da fase"
                value={phaseLevel}
                handleOnChange={(e) => setPhaseLevel(e.target.value)}
            />
            <Input
                type="text"
                text="Nível de Dificuldade"
                name="difficultyLevel"
                placeholder="Insira o nível de dificuldade (1 a 5)"
                value={difficultyLevel}
                handleOnChange={handleDifficultyChange}
            />
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Exibe erro de nível de dificuldade */}
            <Input
                type="text"
                text="Objetos do conhecimento envolvidos na questão"
                name="knowledgeObjects"
                placeholder="Insira o texto"
                value={knowledgeObjects}
                handleOnChange={(e) => setKnowledgeObjects(e.target.value)}
            />

            {/* Seção 3: BNCC */}
            <b>3. BNCC: principal habilidade que deve ser mobilizada pelo discente</b>
            <Input
                type="text"
                text="Tema da BNCC"
                name="bnccTheme"
                placeholder="Insira o tema"
                value={bnccTheme}
                handleOnChange={(e) => setBnccTheme(e.target.value)}
            />
            {/* <Input
                type="text"
                text="Tema da BNCC"
                name="bnccTheme"
                placeholder="Insira o tema"
                value={bnccTheme}
                handleOnChange={(e) => setBnccTheme(e.target.value)}
            />*/}
            <Input
                type="text"
                text="Código da habilidade"
                name="abilityCode"
                placeholder="Insira o código"
                value={abilityCode}
                handleOnChange={(e) => setAbilityCode(e.target.value)}
            />
            <Input
                type="text"
                text="Descrição da habilidade"
                name="abilityDescription"
                placeholder="Insira a descrição"
                value={abilityDescription}
                handleOnChange={(e) => setAbilityDescription(e.target.value)}
            />

            {/* Seção 4: Proposição da Habilidade */}
            <b>4. Proposição da habilidade</b>
            <Input
                type="text"
                text="Enunciado da questão (máximo de 50 palavras)"
                name="questionStatement"
                placeholder="Insira o texto"
                value={questionStatement}
                handleOnChange={(e) => setQuestionStatement(e.target.value)}
            />

            {/* Seção: Upload de Imagem */}
            <b>Área da imagem usada na questão (caso necessário)</b><br />
            <b>Observação: a imagem deve ter boa resolução e tamanhos de letras e figuras adequados.</b>
            <ImageUploader />

            {/* Campo: Alternativas da Questão */}
            <Input
                type="text"
                text="Apresentar 5 (cinco) alternativas (em ordem crescente, nos casos aplicáveis)"
                name="alternatives"
                placeholder="Insira o texto"
                value={alternatives}
                handleOnChange={(e) => setAlternatives(e.target.value)}
            />

            {/* Seção 5: Resolução da Questão */}
            <b>5. Resolução da Questão</b>
            <Input
                type="text"
                text="Indicar a alternativa correta"
                name="correctAlternative"
                placeholder="Insira o texto"
                value={correctAlternative}
                handleOnChange={(e) => setCorrectAlternative(e.target.value)}
            />
            <Input
                type="text"
                text="Resolução detalhada da questão (sem limite de linhas)"
                name="detailedResolution"
                placeholder="Insira o texto"
                value={detailedResolution}
                handleOnChange={(e) => setDetailedResolution(e.target.value)}
            />

            {/* Seção 6: Envio para Análise */}
            <b>6. Envio para Análise</b>
            <Select 
            name="category_id" 
            text="Selecione o tipos de estado da questão" //É o tipo de estado q a questão (revisão,corrigida,aprovada)
            options={categoris}
            value={categoryId}
            handleOnChange={(e) => {
                console.log("Categoria selecionada:", e.target.value); // Debug
                setCategoryId(e.target.value);
            }}
            
                />
    
            {/* Exibe mensagem de erro geral (campos não preenchidos)*/}
            {formError && <p style={{ color: "red" }}>{formError}</p>}

            {/* Botão de envio do formulário */}
            <SubmitButton text={btnText} />
        </form>
    );
}

// Validação da prop btnText (obrigatória e deve ser uma string)
ProjectForme.propTypes = {
    btnText: PropTypes.string.isRequired,
    projectData: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired
};

export default ProjectForme;