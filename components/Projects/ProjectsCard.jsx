import styles from './ProjectsCard.module.css';
import { BsPencil, BsFillTrashFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';



function ProjectsCard({ 
  id,
  name,
  professorName,
  phaseLevel,
  difficultyLevel,
  knowledgeObjects,
  bnccTheme,
  abilityCode,
  abilityDescription,
  questionStatement,
  alternatives,
  correctAlternative,
  detailedResolution,
  categoryName,
  handleRemove,
  createdAt
}) {

  const remove =(e) =>{
    e.preventDefault()
    handleRemove(id)
  }
  const formatDate = (isoString) => {
    const date = new Date(isoString); // Cria um objeto de data a partir da string ISO
    const dia = String(date.getDate()).padStart(2, '0');
    // getDate() pega o dia do mês (1–31)
    // padStart(2, '0') garante que fique com dois dígitos (ex: 3 → "03")
    const mes = String(date.getMonth() + 1).padStart(2, '0');
     // getMonth() retorna de 0 a 11 (então +1 ajusta pra 1 a 12)
    const ano = date.getFullYear();
    // Pega o ano com 4 dígitos (ex: 2025)
    return `${dia}/${mes}/${ano}`;
    // Retorna no formato desejado
  };


  return (
       <div className={styles.project_container}>
               <div className={styles.card_body}>
                    <div className={styles.card_header}>
                      <h3>{name}</h3>
                      <span className={styles.difficulty}>Dificuldade: {difficultyLevel}/5</span>
                      <span className={styles.card_data}>Data de Criação : {formatDate(createdAt)}</span>
                    </div>
                  
                     <div className={styles.info_group}>
                        <h4>Informações Básicas</h4>
                        <p><strong>Professor:</strong> {professorName}</p>
                        <p><strong>Fase:</strong> {phaseLevel}</p>
                        <p className={styles.categori_text}><strong>Categoria:</strong> <span className={`${styles[categoryName.toLowerCase()]}`}></span>{categoryName}</p>
                        <br/>
                        <h4>Detalhes Pedagógicos</h4>
                        <p><strong>Tema BNCC:</strong> {bnccTheme}</p>
                        <p><strong>Código Habilidade:</strong> {abilityCode}</p>
                        <p><strong>Descrição Habilidade:</strong> {abilityDescription}</p>
                        <p><strong>Objetos de Conhecimento:</strong> {knowledgeObjects}</p>
                        <br/>
                        <h4>Questão</h4>
                        <p><strong>Enunciado:</strong> {questionStatement}</p>
                        <p><strong>Alternativas:</strong> {alternatives}</p>
                        <p><strong>Resposta Correta:</strong> {correctAlternative}</p>
                        <br/>
                        <h4>Resolução Detalhada</h4>
                        <p>{detailedResolution}</p>
                      
                      <div className={styles.card_footer}>
                      <Link className={styles.edit_btn} to={`/projetos/${id}`}>
                        <BsPencil /> Editar
                      </Link>
                      <button className={styles.delete_btn} onClick={remove}>
                        <BsFillTrashFill /> Remover
                      </button>
                    </div>
                     </div>
                 
              </div>
       </div>
      
  );
}
// Validação de tipos com PropTypes
ProjectsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  professorName: PropTypes.string.isRequired,
  phaseLevel: PropTypes.string.isRequired,
  difficultyLevel: PropTypes.number.isRequired,
  knowledgeObjects: PropTypes.string.isRequired,
  bnccTheme: PropTypes.string.isRequired,
  abilityCode: PropTypes.string.isRequired,
  abilityDescription: PropTypes.string.isRequired,
  questionStatement: PropTypes.string.isRequired,
  alternatives: PropTypes.string.isRequired,
  correctAlternative: PropTypes.string.isRequired,
  detailedResolution: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
  createdAt: PropTypes.string
};
// Valores padrão para props opcionais
ProjectsCard.defaultProps = {
  categoryName: ''
};
export default ProjectsCard;