import { useRef } from 'react';

const OtpInput = ({ value, onChange, error, touched }) => {
    const inputs = useRef([]);

    const handleChange = (index, e) => {
        const digit = e.target.value.replace(/\D/g, '');

        if (!digit && e.target.value !== '') return;

        const otp = value.split('');
        otp[index] = digit;

        const newOtp = otp.join('').slice(0, 6);

        onChange(newOtp);

        if (digit && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        onChange(pasted);

        const last = Math.min(pasted.length - 1, 5);
        inputs.current[last]?.focus();
    };

    return (
        <div className="input-wrapper">

            <div className="otp-container">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`otp-input ${touched ? (error ? 'invalid' : 'valid') : ''}`}
                        value={value[index] || ''}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>

            {touched && error && (
                <p className="field-error">{error}</p>
            )}

        </div>
    );
};

export default OtpInput;