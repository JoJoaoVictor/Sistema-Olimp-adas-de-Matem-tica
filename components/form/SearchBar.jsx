import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiSearch } from 'react-icons/fi';
import styles from './SearchBar.module.css';

function SearchBar({ value, onDebouncedChange, placeholder = "Buscar...", delay = 300 }) {
  // Estado local para controlar o valor digitado no input
  const [inputValue, setInputValue] = useState(value);

  // useEffect com debounce: espera um tempo antes de acionar a função de busca
  useEffect(() => {
    // Cria o temporizador (delay)
    const handler = setTimeout(() => {
      onDebouncedChange(inputValue); // Chama a função passada com o valor final
    }, delay);

    // Limpa o timeout anterior se o usuário continuar digitando
    return () => clearTimeout(handler);
  }, [inputValue, onDebouncedChange, delay]); // Reexecuta quando inputValue, onDebouncedChange ou delay mudarem

  return (
    <div className={styles.searchBar}>
      {/* Ícone de busca */}
      <FiSearch className={styles.icon} />

      {/* Campo de input controlado */}
      <input
        type="text"
        placeholder={placeholder} // Texto exibido quando o campo está vazio
        value={inputValue} // Valor do input vem do estado local
        onChange={(e) => setInputValue(e.target.value)} // Atualiza o estado local ao digitar
        className={styles.input}
      />
    </div>
  );
}

// Validação das props recebidas pelo componente
SearchBar.propTypes = {
  value: PropTypes.string.isRequired, 
  onDebouncedChange: PropTypes.func.isRequired, 
  placeholder: PropTypes.string, 
  delay: PropTypes.number,
};

export default SearchBar;
