const Alert = ({ type, message }) => {
  if (!message) return null;

  const icon = type === "error" ? "⚠" : "✓";
  const label = type === "error" ? "Error:" : "Success:";

  return (
    <div className={`alert alert-${type}`}>
      <span>{icon}</span>
      <strong>{label}</strong>
      <span>{message}</span>
    </div>
  );
};

export default Alert;