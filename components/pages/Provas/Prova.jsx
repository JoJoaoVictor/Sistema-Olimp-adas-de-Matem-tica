import  { useState, useEffect } from 'react';
import styles from './Prova.module.css';


function Prova() {
  const [provas, setProvas] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [provasFiltradas, setProvasFiltradas] = useState([]);
  

  useEffect(() => {
    fetch('http://localhost:5000/provasMontadas')
      .then(res => res.json())
      .then(data => setProvas(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (searchDate) {
      setProvasFiltradas(provas.filter(prova => {
        // Supondo que sua prova tem campo `date` no formato ISO (ex: 2025-06-02)
        return prova.date?.startsWith(searchDate);
      }));
    } else {
      setProvasFiltradas(provas);
    }
  }, [searchDate, provas]);

  return (
    <div className={styles.container}>
      <h2>Buscar Provas </h2>

      <input 
        type="date" 
        value={searchDate} 
        onChange={(e) => setSearchDate(e.target.value)} 
      />

      <div className={styles.provas_container}>
        {provasFiltradas.length === 0 
          ? <p>Nenhuma prova encontrada para essa data.</p>
          : provasFiltradas.map(prova => (
            <div key={prova.id} className={styles.prova_card}>
              <h3>{prova.name}</h3>
              <p>Data: {prova.date}</p>
              <p>Quantidade de questões: {prova.questoes?.length || 0}</p>
              {/* Você pode colocar mais detalhes e botões para ver/editar/excluir */}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Prova;
