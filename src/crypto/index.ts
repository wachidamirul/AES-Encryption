/**
 * AES Encryption Module
 * 
 * This is the main export file that provides a simplified API for using AES encryption
 * with CBC mode.
 */

import { encryptCBC, decryptCBC, encryptCBCWithSteps, decryptCBCWithSteps, padPKCS7, unpadPKCS7 } from './cbcMode';
import { aesEncryptBlock, aesDecryptBlock } from './aesCore';
import { keyExpansion, displayKeyExpansionSteps } from './keyExpansion';
import { 
  stringToBytes, 
  bytesToString, 
  hexToBytes, 
  bytesToHex, 
  generateRandomBytes, 
  isValidHex,
  isValidKeyLength
} from './utils';
import { BLOCK_SIZE_BYTES, KEY_SIZES } from './aesConstants';

// Main encryption function
export function encrypt(
  plaintext: string, 
  key: string, 
  recordSteps: boolean = false
): { 
  iv: string, 
  ciphertext: string,
  steps?: any
} {
  // Convert inputs to byte arrays
  const plaintextBytes = stringToBytes(plaintext);
  const keyBytes = hexToBytes(key);
  
  // Validate key length
  if (!isValidKeyLength(keyBytes)) {
    throw new Error(`Invalid key length: ${keyBytes.length} bytes. Must be 16, 24, or 32 bytes.`);
  }
  
  // Generate a random IV
  const iv = generateRandomBytes(BLOCK_SIZE_BYTES);
  
  if (recordSteps) {
    // Encrypt with step recording
    const result = encryptCBCWithSteps(plaintextBytes, keyBytes, iv);
    return {
      iv: bytesToHex(result.iv),
      ciphertext: bytesToHex(result.ciphertext),
      steps: result
    };
  } else {
    // Standard encryption
    const result = encryptCBC(plaintextBytes, keyBytes, iv);
    return {
      iv: bytesToHex(result.iv),
      ciphertext: bytesToHex(result.ciphertext)
    };
  }
}

// Main decryption function
export function decrypt(
  ciphertext: string, 
  key: string, 
  iv: string,
  recordSteps: boolean = false
): { 
  plaintext: string,
  steps?: any
} {
  // Convert inputs to byte arrays
  const ciphertextBytes = hexToBytes(ciphertext);
  const keyBytes = hexToBytes(key);
  const ivBytes = hexToBytes(iv);
  
  // Validate key length
  if (!isValidKeyLength(keyBytes)) {
    throw new Error(`Invalid key length: ${keyBytes.length} bytes. Must be 16, 24, or 32 bytes.`);
  }
  
  if (recordSteps) {
    // Decrypt with step recording
    const result = decryptCBCWithSteps(ciphertextBytes, keyBytes, ivBytes);
    return {
      plaintext: bytesToString(result.plaintext),
      steps: result
    };
  } else {
    // Standard decryption
    const plaintextBytes = decryptCBC(ciphertextBytes, keyBytes, ivBytes);
    return {
      plaintext: bytesToString(plaintextBytes)
    };
  }
}

// Educational API for demonstrating AES internals
export const aesEducational = {
  // Key expansion
  expandKey: (key: string) => displayKeyExpansionSteps(key),
  
  // Block operations
  encryptBlock: (block: string, key: string) => {
    const blockBytes = hexToBytes(block);
    const keyBytes = hexToBytes(key);
    return bytesToHex(aesEncryptBlock(blockBytes, keyBytes));
  },
  
  decryptBlock: (block: string, key: string) => {
    const blockBytes = hexToBytes(block);
    const keyBytes = hexToBytes(key);
    return bytesToHex(aesDecryptBlock(blockBytes, keyBytes));
  },
  
  // CBC mode with steps
  encryptCBCWithSteps: (plaintext: string, key: string) => {
    const plaintextBytes = stringToBytes(plaintext);
    const keyBytes = hexToBytes(key);
    const iv = generateRandomBytes(BLOCK_SIZE_BYTES);
    const result = encryptCBCWithSteps(plaintextBytes, keyBytes, iv);
    
    return {
      iv: bytesToHex(result.iv),
      plaintext,
      plaintext_hex: bytesToHex(result.plaintext),
      padded_plaintext_hex: bytesToHex(result.paddedPlaintext),
      blocks: result.blocks.map(block => ({
        index: block.index,
        plaintext_block_hex: bytesToHex(block.plainBlock),
        xor_result_hex: bytesToHex(block.xorWithPrevious),
        encrypted_block_hex: bytesToHex(block.encrypted)
      })),
      ciphertext_hex: bytesToHex(result.ciphertext)
    };
  },
  
  decryptCBCWithSteps: (ciphertext: string, key: string, iv: string) => {
    const ciphertextBytes = hexToBytes(ciphertext);
    const keyBytes = hexToBytes(key);
    const ivBytes = hexToBytes(iv);
    const result = decryptCBCWithSteps(ciphertextBytes, keyBytes, ivBytes);
    
    return {
      iv,
      ciphertext_hex: ciphertext,
      blocks: result.blocks.map(block => ({
        index: block.index,
        cipher_block_hex: bytesToHex(block.cipherBlock),
        decrypted_block_hex: bytesToHex(block.decrypted),
        xor_result_hex: bytesToHex(block.xorWithPrevious)
      })),
      padded_plaintext_hex: bytesToHex(result.paddedPlaintext),
      plaintext_hex: bytesToHex(result.plaintext),
      plaintext: bytesToString(result.plaintext)
    };
  },
  
  // Utilities
  stringToHex: (str: string) => bytesToHex(stringToBytes(str)),
  hexToString: (hex: string) => bytesToString(hexToBytes(hex)),
  generateIV: () => bytesToHex(generateRandomBytes(BLOCK_SIZE_BYTES)),
  generateKey: (bits: number = 128) => {
    let keySize: number;
    if (bits === 128) keySize = 16;
    else if (bits === 192) keySize = 24;
    else if (bits === 256) keySize = 32;
    else throw new Error(`Invalid key size: ${bits} bits. Must be 128, 192, or 256 bits.`);
    
    return bytesToHex(generateRandomBytes(keySize));
  },
  isValidHex,
  isValidKeyLength: (key: string) => {
    const keyBytes = hexToBytes(key);
    return isValidKeyLength(keyBytes);
  },
  getKeySize: (key: string) => {
    const keyBytes = hexToBytes(key);
    if (keyBytes.length === 16) return 128;
    if (keyBytes.length === 24) return 192;
    if (keyBytes.length === 32) return 256;
    return null;
  },
  bytesToHex,
  hexToBytes,
  constants: {
    KEY_SIZES,
    BLOCK_SIZE_BYTES
  }
};

// Export all components
export {
  // CBC mode
  encryptCBC, 
  decryptCBC,
  encryptCBCWithSteps,
  decryptCBCWithSteps,
  
  // Core AES functions
  aesEncryptBlock,
  aesDecryptBlock,
  
  // Key expansion
  keyExpansion,
  displayKeyExpansionSteps,
  
  // Utilities
  stringToBytes,
  bytesToString,
  hexToBytes,
  bytesToHex,
  generateRandomBytes,
  isValidHex,
  isValidKeyLength,
  
  // Constants
  KEY_SIZES,
  BLOCK_SIZE_BYTES
};