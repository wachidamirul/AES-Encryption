import React, { useState } from "react";
import { bytesToHex } from "../crypto/utils";

interface EncryptionStepsProps {
  steps: any; // The encryption steps data
  animate?: boolean;
}

const EncryptionSteps: React.FC<EncryptionStepsProps> = ({ steps, animate = true }) => {
  const [expandedBlocks, setExpandedBlocks] = useState<number[]>([0]); // Start with first block expanded

  // Toggle block expansion
  const toggleBlock = (blockIndex: number) => {
    if (expandedBlocks.includes(blockIndex)) {
      setExpandedBlocks(expandedBlocks.filter(i => i !== blockIndex));
    } else {
      setExpandedBlocks([...expandedBlocks, blockIndex]);
    }
  };

  if (!steps || !steps.blocks || steps.blocks.length === 0) {
    return <div className="text-gray-500 italic">No encryption data available</div>;
  }

  // Format byte array for display with highlighting
  const formatBytes = (bytes: number[], bytesPerGroup: number = 4) => {
    if (!bytes) return "";

    const hex = bytesToHex(bytes);
    let result = [];

    for (let i = 0; i < hex.length; i += bytesPerGroup * 2) {
      result.push(
        <span key={i} className="byte-group">
          {hex.substring(i, i + bytesPerGroup * 2)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="encryption-steps bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Encryption Process</h3>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="md:w-1/2 mb-2 md:mb-0">
            <div className="font-medium text-sm text-gray-700">Original text:</div>
            <div className="bg-white p-2 border rounded font-mono text-sm break-all">{steps.plaintext}</div>
          </div>
          <div className="md:w-1/2">
            <div className="font-medium text-sm text-gray-700">Initialization Vector (IV):</div>
            <div className="bg-white p-2 border rounded font-mono text-sm break-all">{steps.iv}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-medium text-sm text-gray-700">Plaintext (hex):</div>
        <div className="bg-white p-2 border rounded font-mono text-sm break-all">{formatBytes(steps.plaintext)}</div>
      </div>

      <div className="mb-4">
        <div className="font-medium text-sm text-gray-700">
          Padded plaintext ({steps.paddedPlaintext.length} bytes):
        </div>
        <div className="bg-white p-2 border rounded font-mono text-sm break-all">
          {formatBytes(steps.paddedPlaintext)}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Block-by-block encryption:</h4>

        <div className="space-y-2">
          {steps.blocks.map((block: any, index: number) => {
            const isExpanded = expandedBlocks.includes(block.index);

            return (
              <div
                key={block.index}
                className={`block-details bg-white border rounded overflow-hidden transition-all duration-300
                           ${animate ? "transform hover:shadow-md" : ""}`}>
                <div
                  className="block-header p-3 cursor-pointer flex items-center justify-between bg-gray-100"
                  onClick={() => toggleBlock(block.index)}>
                  <div className="font-medium">
                    Block {block.index + 1} of {steps.blocks.length}
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">1. Plaintext block:</div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                        {formatBytes(block.plainBlock)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        2. XOR with {block.index === 0 ? "IV" : "previous cipher block"}:
                      </div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                        {formatBytes(block.xorWithPrevious)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">3. After AES block encryption:</div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                        {formatBytes(block.encrypted)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="font-medium text-sm text-gray-700">Final ciphertext (hex):</div>
        <div className="bg-white p-2 border rounded font-mono text-sm break-all">{formatBytes(steps.ciphertext)}</div>
      </div>
    </div>
  );
};

export default EncryptionSteps;
