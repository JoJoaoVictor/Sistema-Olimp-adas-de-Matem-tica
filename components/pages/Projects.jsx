// Importação de dependências e componentes
import styles from './Projects.module.css' // Estilos CSS module específicos para este componente
import Container from '../Layout/Container' // Componente de container para layout
import LinkButton from '../Layout/LinkButton' // Componente de botão com link
import ProjectsCard from '../Projects/ProjectsCard' // Componente que exibe cada card de projeto
import { useState, useEffect } from 'react' // Hooks do React para estado e efeitos colaterais
import Loading from '../Layout/Loading' // Componente de loading (carregamento)
import SearchBar from '../form/SearchBar'

function Project() {
    // Estados principais
 
    const [projects, setProjects] = useState([]) // Armazena a lista de projetos
    const [loading, setLoading] = useState(true) // Controla o estado de carregamento
    const [error, setError] = useState(null) // Armazena mensagens de erro

    // Estados para filtragem e ordenação
    const [searchTerm, setSearchTerm] = useState('') // Termo da barra de busca
    const [sortOrder, setSortOrder] = useState('recentes') // Ordenação: recentes ou modificados
    const [dificuldade, setDificuldade] = useState(''); // Nível de dificuldade selecionado

    const [tipoQuestao, setTipoQuestao] = useState('aprovadas'); // 'aprovadas' ou 'pendentes'


    // Requisição dos projetos da API quando o componente é montado
  useEffect(() => {
    const endpoint = tipoQuestao === 'aprovadas' 
        ? 'http://localhost:5000/questõesAprovadas' 
        : 'http://localhost:5000/projects';

    setLoading(true);
    fetch(endpoint)
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar questões');
            return res.json();
        })
        .then(data => {
            setProjects(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
}, [tipoQuestao]); 
 // Dependência: reexecuta sempre que tipoQuestao mudar

    
    // Função para remover um projeto
    async function removeProject(id) {
        if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return

        try {
            setLoading(true)
            const response = await fetch(`http://localhost:5000/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                throw new Error('Falha ao remover projeto')
            }

            // Remove projeto da lista local
            setProjects(prevProjects => prevProjects.filter(project => project.id !== id))
            alert('Projeto removido com sucesso!')

        } catch (err) {
            console.error('Erro:', err)
            alert('Erro ao remover projeto')
        } finally {
            setLoading(false)
        }
    }

    // Filtragem e ordenação dos projetos
    const filteredAndSortedProjects = projects
        .filter((difficultyLevel) => 
            dificuldade === '' || String(difficultyLevel.difficultyLevel) === dificuldade
        )
        .filter((project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'recentes') {
                return new Date(b.createdAt) - new Date(a.createdAt)
            } else if (sortOrder === 'modificados') {
                return new Date(b.updatedAt) - new Date(a.updatedAt)
            }
            return 0
        })
        // filtro com debounce
        const handleSearch = (term) => {
            setSearchTerm(term);
          };

           // Buscar todas as questões (armazenadas em questõesAprovadas)
      
    // Renderiza loading enquanto carrega os dados
    if (loading) return (
        <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
        }}>
            <Loading />
        </div>
    )

    // Renderiza mensagem de erro
    if (error) return <p style={{color: 'red'}}>{error}</p>
    if (projects.length === 0 && !loading) return <p style={{color: 'red'}}>Não há projetos cadastrados</p>

    
    // Renderização principal
    return (
        <div className={styles.projects_container}>
            {/* Título e botão de criar projeto */}
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/montarProva/" text="Montar Prova" />
            </div>

            {/* Área dos filtros e resultados */}
            <div className={styles.projects_card} style={{ boxShadow: '4px 8px rgba(0, 0, 0, 0.2)' }}>
                <h1 style={{marginBottom: '10px'}}>Documentos</h1>
                {/* Cabeçalho com busca e ordenação */}
                <div className={styles.filter_button}>
                    
                    <button 
                        className={styles.button}
                        onClick={() => setTipoQuestao('aprovadas')}
                        >
                        Questões Aprovadas 
                    </button>
                    <button 
                        className={styles.button}
                        onClick={() => setTipoQuestao('pendentes')}
                    >
                        Questões Pendentes
                    </button>

                    <select className={styles.select}>
                        <option value="">Ano</option>
                        <option value="">3º</option>
                        <option value="">4º</option>
                        <option value="">5º</option>
                        <option value="">6º</option>
                        <option value="">7º</option>
                        <option value="">8º</option>
                        <option value="">9º</option>
                    </select>
                
                    
                  
                  
                    {/* Ordenação */}
                     <select    className={styles.select}
                        value={dificuldade}
                        onChange={(e) => {
                            setDificuldade(e.target.value);
                            setSortOrder(e.target.value);
                        }}
                        >
                        <option value="">Nível de Dificuldade</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <select className={styles.select}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="recentes">Recentes</option>
                        <option value="modificados">Últimas Modificadas</option>
                        
                    </select>
                      {/* Campo de busca */}
                    
                    <SearchBar 
                     value={searchTerm} 
                     onDebouncedChange={handleSearch} 
                     placeholder="Buscar por nome..." 
                     delay={400}
                    />

                </div>

                {/* Container com os projetos */}
                <Container customClass="start">
                    {filteredAndSortedProjects.length > 0 &&
                        filteredAndSortedProjects.map((project) => (
                            <ProjectsCard 
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                professorName={project.professorName}
                                phaseLevel={project.phaseLevel}
                                difficultyLevel={project.difficultyLevel}
                                knowledgeObjects={project.knowledgeObjects}
                                bnccTheme={project.bnccTheme}
                                abilityCode={project.abilityCode}
                                abilityDescription={project.abilityDescription}
                                questionStatement={project.questionStatement}
                                alternatives={project.alternatives}
                                correctAlternative={project.correctAlternative}
                                detailedResolution={project.detailedResolution}
                                categoryId={project.categoryId}
                                categoryName={project.categoryName}
                                handleRemove={removeProject}
                                createdAt={project.createdAt}
                            />
                        ))
                    }
                </Container>
            </div>
        </div>
    )
}

export default Project
