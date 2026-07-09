const Alert = ({ type, message }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{type === 'error' ? '⚠ Error' : '✔ Success'}</span>
      {message}
    </div>
  );
};

export default Alert;