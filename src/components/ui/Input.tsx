import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="
          w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
          text-white placeholder-gray-500 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          hover:border-gray-600
        "
      />
    </div>
  );
};