import { useState, useEffect } from 'react';
import styles from './Prova.module.css';
import { gerarPDF } from '../../ConfProvas/pdfUtils'; 

function Prova() {
  const [provas, setProvas] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [provasFiltradas, setProvasFiltradas] = useState([]);

  // Carrega todas as provas montadas ao iniciar o componente
  useEffect(() => {
    fetch('http://localhost:5000/provasMontadas')
      .then(res => res.json())
      .then(data => setProvas(data))
      .catch(err => console.log(err));
  }, []);

  // Filtra as provas por data (com base no campo createdAt)
  useEffect(() => {
    if (searchDate) {
      setProvasFiltradas(provas.filter(prova => {
        // Filtra por data inicial (dd/mm/yyyy), ignorando horário
        const dataFormatada = prova.createdAt?.split(' ')[0];
        return dataFormatada === new Date(searchDate).toLocaleDateString('pt-BR');
      }));
    } else {
      setProvasFiltradas(provas);
    }
  }, [searchDate, provas]);

  // Chama o gerador de PDF com visualização
  function visualizarPDF(prova) {
    gerarPDF(prova.questoes, prova, true); 
  }

  return (
    <div className={styles.container}>
      <h2>Buscar Provas</h2>
          /*Campo de busca*/
          /*
          nome:
          ano: 4°ano e 5° assim em diante 
          fase da prova:
          data de criação:

          */
      <div className={styles.provas_container}>
        <div className={styles.provas_list}>
          {provasFiltradas.length === 0 
            ? <p>Nenhuma prova encontrada para essa data.</p>
            : provasFiltradas.map(prova => (
              <div key={prova.id} className={styles.prova_card}>
                <h4>{prova.name}</h4>
                <p>Data de criação{prova.createdAt || 'Não informada'}</p>
                <p>Quantidade de questões: {prova.questoes?.length || 0}</p>
                  
                    <button className={styles.prova_button} onClick={() => window.location.href = `/provas/${prova.id}`}>Editar</button>
                    <button onClick={() => visualizarPDF(prova)}>Visualizar PDF</button>
                  
                  
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Prova;
