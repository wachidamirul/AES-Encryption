import React, { useState, useEffect } from 'react';
import { aesEducational } from '../crypto';

interface KeyInputProps {
  keyValue: string;
  onChange: (key: string) => void;
  onKeyValidChange: (isValid: boolean) => void;
}

const KeyInput: React.FC<KeyInputProps> = ({ keyValue, onChange, onKeyValidChange }) => {
  const [keySize, setKeySize] = useState<number>(128);
  const [error, setError] = useState<string>('');
  
  // Effect to check key validity whenever it changes
  useEffect(() => {
    validateKey(keyValue);
  }, [keyValue]);
  
  // Validate the key format and length
  const validateKey = (key: string) => {
    // Empty key is allowed during typing
    if (!key.trim()) {
      setError('');
      onKeyValidChange(false);
      return;
    }
    
    // Check if it's valid hex
    if (!aesEducational.isValidHex(key)) {
      setError('Key must be a valid hexadecimal value');
      onKeyValidChange(false);
      return;
    }
    
    // Check key length based on selected size
    const keyBytes = aesEducational.hexToBytes(key);
    const expectedBytes = keySize / 8;
    
    if (keyBytes.length !== expectedBytes) {
      setError(`Key length must be ${expectedBytes * 2} hex characters for ${keySize}-bit encryption`);
      onKeyValidChange(false);
      return;
    }
    
    // Valid key
    setError('');
    onKeyValidChange(true);
  };
  
  // Generate a random key of the current size
  const generateRandomKey = () => {
    const newKey = aesEducational.generateKey(keySize);
    onChange(newKey);
  };
  
  // Handle key size change
  const handleKeySizeChange = (size: number) => {
    setKeySize(size);
    // Generate a new key when size changes
    const newKey = aesEducational.generateKey(size);
    onChange(newKey);
  };
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Encryption Key
      </label>
      
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-2">
        <div className="flex space-x-4">
          {[128, 192, 256].map((size) => (
            <label key={size} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={keySize === size}
                onChange={() => handleKeySizeChange(size)}
              />
              <span className="ml-2 text-sm text-gray-700">{size}-bit</span>
            </label>
          ))}
        </div>
        
        <button
          type="button"
          onClick={generateRandomKey}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 
                    transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Random Key
        </button>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={keyValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={`Enter ${keySize}-bit key in hex (${keySize / 4} characters)`}
          className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none focus:ring-2 
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
                    transition duration-200 uppercase`}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        <p className="mt-1 text-xs text-gray-500">
          A {keySize}-bit key requires {keySize / 4} hex characters ({keySize / 8} bytes)
        </p>
      </div>
    </div>
  );
};

export default KeyInput;