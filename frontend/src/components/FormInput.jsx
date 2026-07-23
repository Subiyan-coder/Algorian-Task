const FormInput = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  touched,
  label
}) => {
  const getInputClass = () => {
    if (!touched) return '';
    return error ? 'invalid' : 'valid';
  };

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-input ${getInputClass()}`}
      />
      {touched && error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default FormInput;