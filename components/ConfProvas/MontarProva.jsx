import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MontarProva.module.css';
import SearchBar from '../form/SearchBar';
import jsPDF from 'jspdf';


import cabecalho from '../../img/heder.png'; // Imagem do cabeçalho
import rodape from '../../img/footer.png'; // Imagem do rodapé


function MontarProva() {
  const [projeto, setProjeto] = useState({});
  const [questoes, setQuestoes] = useState([]); // Todas as questões salvas no db
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]); // Questões escolhidas pelo usuário para montar a prova
  const { id } = useParams(); // Pegamos o ID do projeto via rota

  const [searchTerm, setSearchTerm] = useState('');
  const [habilidade, setHabilidade] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [mostrarQuestoes, setMostrarQuestoes] = useState(false); // Só mostramos as questões após o filtroj
  // Atualiza o estado de busca e ativa a exibição das questões
  const handleSearch = (term) => {
    setSearchTerm(term);
    setMostrarQuestoes(true);
  };

  // Buscar os dados do projeto atual e todas as questões
useEffect(() => {
  if (id) {
    fetch(`http://localhost:5000/provasMontadas/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Prova com ID ${id} não encontrada`);
        return res.json();
      })
      .then(data => {
        setProjeto(data);
        setQuestoesSelecionadas(data.questoes || []);
      })
      .catch(err => console.log(err));
  }

  fetch('http://localhost:5000/questõesAprovadas')
    .then(res => res.json())
    .then(data => setQuestoes(data))
    .catch(err => console.log(err));
}, [id]);


  // Adiciona uma questão à lista se ainda não estiver presente
  function handleSelecionarQuestao(questao) {
    if (!questoesSelecionadas.find(q => q.id === questao.id)) {
      setQuestoesSelecionadas([...questoesSelecionadas, questao]);
    }
  }

  // Remove uma questão da lista
  function handleRemoverQuestao(idQuestao) {
    setQuestoesSelecionadas(questoesSelecionadas.filter(q => q.id !== idQuestao));
  }

  // Salva a prova no array provasMontadas
 function salvarProva() {
  // Gera data atual formatada (ex: 16/06/2025 às 14:30)
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Monta o objeto da prova com a data 
  const novaProva = {
    ...projeto,
    id: projeto.id || Date.now(),
    name: projeto.name || `Prova ${Date.now()}`,
    questoes: questoesSelecionadas,
    createdAt: projeto.createdAt || dataFormatada // evita sobrescrever caso já tenha
  };

  // Define se será PUT ou POST
  const method = projeto.id ? 'PUT' : 'POST';
  const endpoint = projeto.id
    ? `http://localhost:5000/provasMontadas/${projeto.id}`
    : `http://localhost:5000/provasMontadas`;

  // Requisição ao backend
  fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaProva),
  })
    .then(resp => {
      if (!resp.ok) throw new Error('Erro ao salvar prova');
      return resp.json();
    })
    .then(() => {
      alert('Prova salva com sucesso!');
    })
    .catch(err => console.error('Erro ao salvar prova:', err));
}

  // Aplica os filtros apenas quando mostrarQuestoes for true
  const questoesFiltradas = mostrarQuestoes
    ? questoes.filter(q =>
        q.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        q.abilityCode?.toLowerCase().includes(habilidade.toLowerCase()) &&
        (dificuldade === '' || String(q.difficultyLevel) === dificuldade)
      )
    : [];

function gerarPDF(preview = false) {
  if (questoesSelecionadas.length === 0) {
    alert('Selecione pelo menos uma questão para gerar o PDF.');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const colunaLargura = 90;
  const margemEntreColunas = 1;

  function aplicarCabecalhoRodape() {
    const imgCab = new Image();
    imgCab.src = cabecalho;
    doc.addImage(imgCab, 'PNG', 10, 5, 190, 30);

    const imgRod = new Image();
    imgRod.src = rodape;
    doc.addImage(imgRod, 'PNG', 18, 280, 170, 17);
  }
      // CAPA
    aplicarCabecalhoRodape();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OLIMPÍADA DE MATEMÁTICA DA UNEMAT – 2024 – 3ª FASE – 4º e 5º Anos', 34, 38);
    doc.setFont('helvetica', 'normal');
    doc.text('ALUNO(A): __________________________________________________________________________________', 14, 44);
    doc.text('ESCOLA: _____________________________________________', 14, 51);
    doc.text('MUNICÍPIO: ___________________________', 120, 51);
    
  function renderQuestoes(questoes, incluirResposta = false) {
    let y = 60;
    let coluna = 0;

    aplicarCabecalhoRodape();

    doc.setFontSize(10);

    questoes.forEach((questao, index) => {
      const startX = coluna === 0 ? 10 : pageWidth / 2 + margemEntreColunas;
      const larguraTexto = colunaLargura;

      // Título
     // Enunciado justificado com número da questão
      doc.setFont('helvetica', 'bold');
      const enunciado = doc.splitTextToSize(`${index + 1}) ${questao.questionStatement || 'Sem enunciado'}`, larguraTexto);
      doc.text(enunciado, startX, y, { maxWidth: larguraTexto, align: 'justify' });
      y += enunciado.length * 5;


      // Alternativas horizontalmente (regex)
      if (typeof questao.alternatives === 'string') {
        const matches = questao.alternatives.match(/([a-e]\)\s[^a-e]*)/gi);
        if (matches) {
          const altLinha = matches.join('   ');
          const altLines = doc.splitTextToSize(altLinha, larguraTexto);
          doc.text(altLines, startX, y);
          y += altLines.length * 6;

        }
      }
// Resolução da questão
if (incluirResposta) {
  // Espaço antes da resolução
  y += 2;

  // Título "Resolução"
  doc.setFont('helvetica', 'italic');
  doc.text('Resolução:', startX, y);
  y += 5;

  // Texto da resolução em vermelho
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 0, 0); // Vermelho

  // Quebra automática da resolução conforme largura da coluna
  const resolucao = questao.detailedResolution || 'Sem resolução';
  const resolucaoLines = doc.splitTextToSize(resolucao, larguraTexto);

  // Renderiza resolução em vermelho com quebra
  doc.text(resolucaoLines, startX, y);
  y += resolucaoLines.length * 6;

  doc.setTextColor(0, 0, 0); // Reseta cor para preto
} else {
  // Primeira parte da prova: espaço em branco para aluno responder
  y += 2;
 
  y += 5;

  // Espaços em branco com linhas
  doc.setLineWidth(0.1);

}

      // Verifica se precisa mudar de coluna ou adicionar página
      if (y > 250) {
        if (coluna === 0) {
          coluna = 1;
          y = 60;
        } else {
          doc.addPage();
          aplicarCabecalhoRodape();
          coluna = 0;
          y = 40;
        }
      }
    });
  }

  // Primeira parte: Prova sem respostas
  renderQuestoes(questoesSelecionadas, false);

  // Segunda parte: Prova com resoluções
  doc.addPage();
  aplicarCabecalhoRodape();
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Prova com Resoluções', 65, 40);
  renderQuestoes(questoesSelecionadas, true);

  // Visualização ou download
  if (preview) {
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(`${projeto.name || 'prova_unemat'}.pdf`);
  }
}


  return (
    <div className={styles.container}>
      <div className={styles.select_container}>
        <h2>Buscar Questões</h2>

        {/* Barra de busca por nome */}
        <div style={{ marginLeft: '6px', paddingBottom: '20px'}}>
            <SearchBar 
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              onDebouncedChange={handleSearch}
              delay={400}
            />
        </div>
      
        {/* Filtros adicionais - ainda não funcionais */}
        <select>
          <option value="">Ensino Fundamental</option>
          <option value="">Ensino Médio</option>
        </select>
        <select>
          <option value="">Ano</option>
          <option value="">3º</option>
          <option value="">4º</option>
          <option value="">5º</option>
          <option value="">6º</option>
          <option value="">7º</option>
          <option value="">8º</option>
          <option value="">9º</option>
        </select>
        <select>
          <option value="tema">Unidade Temática</option>
            <option value="tema1"> Álgebra </option>
            <option value="tema2"> Geometria </option> 
            <option value="tema3"> Grandezas e Medidas </option>
            <option value="tema4"> Números </option>
            <option value="tema5"> Probrabilidade e Estatística </option>
        </select>
        <select>
          <option value="">Objetos de Conhecimento</option>
        </select>
        <select
          value={dificuldade}
          onChange={(e) => {
            setDificuldade(e.target.value);
            setMostrarQuestoes(true);
          }}
        >
          <option value="">Nível de Dificuldade</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
           {/* Filtro por código de habilidade */}
        <input
          type="text"
          placeholder="Buscar habilidade"
          value={habilidade}
          onChange={(e) => {
            setHabilidade(e.target.value);
            setMostrarQuestoes(true);
          }}
          style={{ border: '1px solid #ccc' }}
        />
       
      </div>
      <div className={styles.questoes_container}>
          {/* Lista de questões filtradas */}
          {mostrarQuestoes && (
            <>
              <h3>Resultados da busca</h3>
                <ul >
                  {questoesFiltradas.map((questao) => (
                    <li key={questao.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                      {questao.name} - Dificuldade: {questao.difficultyLevel} - Código: {questao.abilityCode}
                      <button onClick={() => handleSelecionarQuestao(questao)}>Adicionar</button>
                    </li>
                    
                  ))}
                </ul>
                {questoesFiltradas.length === 0 && <p>Nenhuma questão encontrada.</p>}

            </>
          )}

      </div>
      <div className={styles.questoes_container}>
         {/* Lista de questões selecionadas */}
         <h2>Questões Selecionadas: </h2>
          <ul>
            {questoesSelecionadas.map((questao) => (
              <li key={questao.id}>
                {questao.name}
                <button onClick={() => handleRemoverQuestao(questao.id)}>Remover</button>
              </li>
            ))}
          </ul>
      </div>
      {/* Botão para salvar a prova */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <button onClick={salvarProva}>Montar Prova</button>
        <button onClick={() => gerarPDF(true)}>Visualizar PDF</button>
      <button onClick={() => gerarPDF(questoesSelecionadas, projeto)}>Gerar PDF</button>

            </div>
    </div>
  );
}

export default MontarProva;
