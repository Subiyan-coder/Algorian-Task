import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const requirements = [
  { id: 'length', label: 'At least 6 characters', test: (v) => v.length >= 6 },
  { id: 'lowercase', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'uppercase', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'One number', test: (v) => /\d/.test(v) }
];

const getProgressColor = (strength) => {
  if (strength === 0) return '#e5e7eb';
  if (strength === 1) return '#ef4444';
  if (strength === 2) return '#f97316';
  if (strength === 3) return '#eab308';
  return '#16a34a';
};

const PasswordInput = ({ value, onChange, error, touched, placeholder = 'Password', showRequirements = true }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const metRequirements = requirements.filter(r => r.test(value));
  const strength = metRequirements.length;
  const progressWidth = (strength / requirements.length) * 100;

  const getInputClass = () => {
    if (!touched) return '';
    return error ? 'invalid' : 'valid';
  };

  return (

    <div className="input-wrapper">

      <div className="password-input-container">

        <input

          className={`form-input ${getInputClass()}`}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}

        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff  size={18} strokeWidth={2} /> : <Eye  size={18} strokeWidth={2} />}
        </button>

      </div>

        {touched && error && <p className="field-error">{error}</p>}

      {showRequirements && (focused || value.length > 0) && (
        <div className="password-requirements">
          <div className="password-progress">
            <div
              className="password-progress-bar"
              style={{
                width: `${progressWidth}%`,
                backgroundColor: getProgressColor(strength)
              }}
            />
          </div>
          <p>Password must contain:</p>
          {requirements.map(req => (
            <div
              key={req.id}
              className={`requirement ${req.test(value) ? 'met' : ''}`}
            >
              <span className="requirement-icon">
                {req.test(value) ? '✓' : '○'}
              </span>
              {req.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;