import React, { useState } from 'react';
import { aesEducational } from '../crypto';

interface AESVisualizationProps {
  showSubBytesDemo?: boolean;
  showShiftRowsDemo?: boolean;
  showMixColumnsDemo?: boolean;
}

const AESVisualization: React.FC<AESVisualizationProps> = ({
  showSubBytesDemo = true,
  showShiftRowsDemo = true,
  showMixColumnsDemo = true
}) => {
  // This component shows visual demonstrations of AES transformations
  
  // Generate sample data for demonstrations
  const [demoState, setDemoState] = useState(() => {
    // Create a 4x4 matrix with sample values for demonstration
    const sampleState = [
      [0x19, 0xa0, 0x9a, 0xe9],
      [0x3d, 0xf4, 0xc6, 0xf8],
      [0xe3, 0xe2, 0x8d, 0x48],
      [0xbe, 0x2b, 0x2a, 0x08]
    ];
    
    return sampleState;
  });
  
  // Format a byte as a hex string
  const formatByte = (byte: number) => {
    return byte.toString(16).padStart(2, '0').toUpperCase();
  };
  
  // SubBytes demonstration
  const SubBytesDemo = () => {
    // Apply S-box substitution to each cell
    const afterSubBytes = demoState.map(row => 
      row.map(byte => {
        // Get the S-box value (simplified for demo)
        const row = (byte >> 4) & 0xF;
        const col = byte & 0xF;
        
        // This is a simplified demo - in reality we'd use the actual S-box
        // but for visualization purposes, we'll just modify the value
        return (byte + 0x63) & 0xFF;
      })
    );
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">SubBytes Transformation</h3>
        <p className="mb-4 text-gray-700">
          The SubBytes step substitutes each byte with another according to a lookup table (S-box).
          This provides confusion by making the relationship between the key and ciphertext complex.
        </p>
        
        <div className="flex flex-col md:flex-row md:space-x-8 items-center">
          {/* Before matrix */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">Before SubBytes</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {demoState.map((row, rowIndex) => (
                row.map((byte, colIndex) => (
                  <div 
                    key={`before-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded text-sm font-mono"
                  >
                    {formatByte(byte)}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="my-4 md:my-0 transform rotate-90 md:rotate-0">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* After matrix */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">After SubBytes</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {afterSubBytes.map((row, rowIndex) => (
                row.map((byte, colIndex) => (
                  <div 
                    key={`after-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 flex items-center justify-center bg-blue-50 border border-blue-300 rounded text-sm font-mono"
                  >
                    {formatByte(byte)}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // ShiftRows demonstration
  const ShiftRowsDemo = () => {
    // Apply row shifting
    const afterShiftRows = [
      [...demoState[0]], // Row 0: No shift
      [demoState[1][1], demoState[1][2], demoState[1][3], demoState[1][0]], // Row 1: Shift by 1
      [demoState[2][2], demoState[2][3], demoState[2][0], demoState[2][1]], // Row 2: Shift by 2
      [demoState[3][3], demoState[3][0], demoState[3][1], demoState[3][2]]  // Row 3: Shift by 3
    ];
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">ShiftRows Transformation</h3>
        <p className="mb-4 text-gray-700">
          The ShiftRows step cyclically shifts the bytes in each row of the state. 
          The first row is not shifted, the second row is shifted by one position, 
          the third row by two positions, and the fourth row by three positions.
        </p>
        
        <div className="flex flex-col md:flex-row md:space-x-8 items-center">
          {/* Before matrix */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">Before ShiftRows</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {demoState.map((row, rowIndex) => (
                row.map((byte, colIndex) => (
                  <div 
                    key={`before-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded text-sm font-mono"
                  >
                    {formatByte(byte)}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="my-4 md:my-0 transform rotate-90 md:rotate-0">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* After matrix with highlights */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">After ShiftRows</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {afterShiftRows.map((row, rowIndex) => (
                row.map((byte, colIndex) => {
                  // Determine if this byte has moved
                  let bgColor = "bg-white";
                  let borderColor = "border-gray-300";
                  
                  // Highlighting based on how much the byte has shifted
                  if (rowIndex === 1) {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-300";
                  } else if (rowIndex === 2) {
                    bgColor = "bg-green-100";
                    borderColor = "border-green-400";
                  } else if (rowIndex === 3) {
                    bgColor = "bg-green-200";
                    borderColor = "border-green-500";
                  }
                  
                  return (
                    <div 
                      key={`after-${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 flex items-center justify-center ${bgColor} border ${borderColor} rounded text-sm font-mono`}
                    >
                      {formatByte(byte)}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // MixColumns demonstration - simplified for visualization purposes
  const MixColumnsDemo = () => {
    // A simplified representation of MixColumns for demonstration
    // In a real implementation, this would involve Galois Field multiplication
    const afterMixColumns = demoState.map(row => [...row]); // Copy the state
    
    // Apply a simplified mixing (just for visual purposes)
    for (let col = 0; col < 4; col++) {
      const a = demoState[0][col];
      const b = demoState[1][col];
      const c = demoState[2][col];
      const d = demoState[3][col];
      
      // Simplified mixing
      afterMixColumns[0][col] = (a + b) & 0xFF;
      afterMixColumns[1][col] = (b + c) & 0xFF;
      afterMixColumns[2][col] = (c + d) & 0xFF;
      afterMixColumns[3][col] = (d + a) & 0xFF;
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">MixColumns Transformation</h3>
        <p className="mb-4 text-gray-700">
          The MixColumns step operates on each column, combining the four bytes in the column 
          using a linear transformation. It provides diffusion by ensuring that each input byte 
          affects all four output bytes.
        </p>
        
        <div className="flex flex-col md:flex-row md:space-x-8 items-center">
          {/* Before matrix */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">Before MixColumns</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {demoState.map((row, rowIndex) => (
                row.map((byte, colIndex) => (
                  <div 
                    key={`before-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded text-sm font-mono"
                  >
                    {formatByte(byte)}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="my-4 md:my-0 transform rotate-90 md:rotate-0">
            <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* After matrix */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">After MixColumns</h4>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded">
              {afterMixColumns.map((row, rowIndex) => (
                row.map((byte, colIndex) => (
                  <div 
                    key={`after-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 flex items-center justify-center bg-purple-50 border border-purple-300 rounded text-sm font-mono"
                  >
                    {formatByte(byte)}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="aes-visualization">
      <h2 className="text-xl font-bold mb-4">AES Transformations Visualized</h2>
      
      {showSubBytesDemo && <SubBytesDemo />}
      {showShiftRowsDemo && <ShiftRowsDemo />}
      {showMixColumnsDemo && <MixColumnsDemo />}
      
      <div className="text-sm text-gray-600 mt-6">
        <p>
          Note: These visualizations are simplified for educational purposes. The actual AES algorithm
          uses specific mathematical operations including Galois Field arithmetic for the MixColumns operation.
        </p>
      </div>
    </div>
  );
};

export default AESVisualization;