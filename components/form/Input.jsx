import PropTypes from 'prop-types'; 
import styles from './Input.module.css';

function Input({ type, text, name, placeholder, handleOnChange, value, img, hasError }) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        className={hasError ? styles.error : ""}
      />
      
      {/* Exibe a imagem se houver uma */}
      {img && <img src={img} alt="input icon" />}
    </div>
  );
}

// Definição dos tipos das props (corrige o erro do ESLint)
Input.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  handleOnChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  img: PropTypes.string,
  hasError: PropTypes.bool, // Adiciona a validação para hasError
};




export default Input;
