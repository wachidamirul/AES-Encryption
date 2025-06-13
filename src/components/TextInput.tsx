import React, { useState } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMultiline?: boolean;
  rows?: number;
  className?: string;
  readOnly?: boolean;
  isHex?: boolean;
  isCode?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  isMultiline = false,
  rows = 4,
  className = '',
  readOnly = false,
  isHex = false,
  isCode = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    // If it's a hex input, validate and format
    if (isHex && !readOnly) {
      // Remove non-hex characters
      newValue = newValue.replace(/[^0-9A-Fa-f\s]/g, '');
    }
    
    onChange(newValue);
  };
  
  const baseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                       focus:ring-blue-500 transition duration-200 font-mono ${className}`;
  
  const inputClasses = `${baseClasses} 
                       ${readOnly ? 'bg-gray-100 text-gray-700' : 'bg-white'} 
                       ${isCode ? 'font-mono text-sm' : ''}
                       ${isHex ? 'uppercase' : ''}`;
  
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 transition-colors duration-200 
                       ${isFocused ? 'text-blue-600' : 'text-gray-700'}`}>
        {label}
      </label>
      
      {isMultiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
    </div>
  );
};

export default TextInput;