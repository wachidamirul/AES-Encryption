/**
 * AES CBC Mode Implementation
 * 
 * This file implements the Cipher Block Chaining (CBC) mode of operation for AES.
 * In CBC mode, each block of plaintext is XORed with the previous ciphertext block
 * before being encrypted. An initialization vector (IV) is used for the first block.
 */

import { aesEncryptBlock, aesDecryptBlock } from './aesCore';
import { BLOCK_SIZE_BYTES } from './aesConstants';
import { generateRandomBytes, xorBytes } from './utils';

/**
 * Encrypts data using AES in CBC mode
 * 
 * @param plaintext The data to encrypt
 * @param key The encryption key
 * @param iv The initialization vector (optional, randomly generated if not provided)
 * @returns An object containing the IV and encrypted data
 */
export function encryptCBC(plaintext: number[], key: number[], iv?: number[]): { iv: number[], ciphertext: number[] } {
  // Generate IV if not provided
  const initVector = iv || generateRandomBytes(BLOCK_SIZE_BYTES);
  
  // Ensure the IV is the correct length
  if (initVector.length !== BLOCK_SIZE_BYTES) {
    throw new Error(`Invalid IV length: ${initVector.length} bytes. Must be ${BLOCK_SIZE_BYTES} bytes.`);
  }
  
  // Pad the plaintext to ensure it's a multiple of the block size
  const paddedPlaintext = padPKCS7(plaintext, BLOCK_SIZE_BYTES);
  
  // Initialize the result array with the IV
  const ciphertext: number[] = [];
  
  // Process each block
  let previousBlock = [...initVector];
  for (let i = 0; i < paddedPlaintext.length; i += BLOCK_SIZE_BYTES) {
    // Extract the current block
    const block = paddedPlaintext.slice(i, i + BLOCK_SIZE_BYTES);
    
    // XOR with the previous ciphertext block (or IV for the first block)
    const xoredBlock = xorBytes(block, previousBlock);
    
    // Encrypt the block
    const encryptedBlock = aesEncryptBlock(xoredBlock, key);
    
    // Add to the result
    ciphertext.push(...encryptedBlock);
    
    // Update the previous block for the next iteration
    previousBlock = encryptedBlock;
  }
  
  return { iv: initVector, ciphertext };
}

/**
 * Decrypts data using AES in CBC mode
 * 
 * @param ciphertext The encrypted data
 * @param key The decryption key
 * @param iv The initialization vector used during encryption
 * @returns The decrypted data
 */
export function decryptCBC(ciphertext: number[], key: number[], iv: number[]): number[] {
  // Ensure the IV is the correct length
  if (iv.length !== BLOCK_SIZE_BYTES) {
    throw new Error(`Invalid IV length: ${iv.length} bytes. Must be ${BLOCK_SIZE_BYTES} bytes.`);
  }
  
  // Ensure the ciphertext length is a multiple of the block size
  if (ciphertext.length % BLOCK_SIZE_BYTES !== 0) {
    throw new Error(`Invalid ciphertext length: ${ciphertext.length} bytes. Must be a multiple of ${BLOCK_SIZE_BYTES} bytes.`);
  }
  
  const plaintext: number[] = [];
  
  // Process each block
  let previousBlock = [...iv];
  for (let i = 0; i < ciphertext.length; i += BLOCK_SIZE_BYTES) {
    // Extract the current block
    const block = ciphertext.slice(i, i + BLOCK_SIZE_BYTES);
    
    // Decrypt the block
    const decryptedBlock = aesDecryptBlock(block, key);
    
    // XOR with the previous ciphertext block (or IV for the first block)
    const xoredBlock = xorBytes(decryptedBlock, previousBlock);
    
    // Add to the result
    plaintext.push(...xoredBlock);
    
    // Update the previous block for the next iteration
    previousBlock = block;
  }
  
  try {
    // Remove padding with additional validation
    return unpadPKCS7(plaintext);
  } catch (error) {
    // Add more context to the error
    throw new Error(`Decryption failed: Invalid padding. This may be due to incorrect key, IV, or corrupted ciphertext.`);
  }
}

/**
 * Applies PKCS#7 padding to ensure the data is a multiple of the block size
 * 
 * @param data The data to pad
 * @param blockSize The block size in bytes
 * @returns The padded data
 */
export function padPKCS7(data: number[], blockSize: number): number[] {
  // Calculate the number of padding bytes needed
  const paddingLength = blockSize - (data.length % blockSize);
  
  // Create a new array with the original data and padding
  const padded = [...data];
  
  // Add padding bytes (each byte has the value of the padding length)
  for (let i = 0; i < paddingLength; i++) {
    padded.push(paddingLength);
  }
  
  return padded;
}

/**
 * Removes PKCS#7 padding from the data
 * 
 * @param data The padded data
 * @returns The data with padding removed
 */
export function unpadPKCS7(data: number[]): number[] {
  if (data.length === 0) {
    throw new Error('Cannot unpad empty data');
  }
  
  // Get the padding length from the last byte
  const paddingLength = data[data.length - 1];
  
  // Validate padding length is within valid range
  if (paddingLength <= 0 || paddingLength > BLOCK_SIZE_BYTES || paddingLength > data.length) {
    throw new Error(`Invalid padding length: ${paddingLength}`);
  }
  
  // Validate all padding bytes have the correct value
  for (let i = data.length - paddingLength; i < data.length; i++) {
    if (data[i] !== paddingLength) {
      throw new Error(`Invalid padding: expected ${paddingLength} but found ${data[i]} at position ${i}`);
    }
  }
  
  // Remove the padding
  return data.slice(0, data.length - paddingLength);
}

/**
 * Records the intermediate steps of CBC mode encryption for educational purposes
 * 
 * @param plaintext The data to encrypt
 * @param key The encryption key
 * @param iv The initialization vector
 * @returns An object containing the steps of the encryption process
 */
export function encryptCBCWithSteps(
  plaintext: number[], 
  key: number[], 
  iv: number[]
): {
  iv: number[],
  plaintext: number[],
  paddedPlaintext: number[],
  blocks: {
    index: number,
    plainBlock: number[],
    xorWithPrevious: number[],
    encrypted: number[]
  }[],
  ciphertext: number[]
} {
  // Pad the plaintext
  const paddedPlaintext = padPKCS7(plaintext, BLOCK_SIZE_BYTES);
  
  // Initialize the result
  const result = {
    iv,
    plaintext,
    paddedPlaintext,
    blocks: [] as {
      index: number,
      plainBlock: number[],
      xorWithPrevious: number[],
      encrypted: number[]
    }[],
    ciphertext: [] as number[]
  };
  
  // Process each block
  let previousBlock = [...iv];
  for (let i = 0; i < paddedPlaintext.length; i += BLOCK_SIZE_BYTES) {
    // Extract the current block
    const plainBlock = paddedPlaintext.slice(i, i + BLOCK_SIZE_BYTES);
    
    // XOR with the previous ciphertext block (or IV for the first block)
    const xoredBlock = xorBytes(plainBlock, previousBlock);
    
    // Encrypt the block
    const encryptedBlock = aesEncryptBlock(xoredBlock, key);
    
    // Record the steps
    result.blocks.push({
      index: i / BLOCK_SIZE_BYTES,
      plainBlock,
      xorWithPrevious: xoredBlock,
      encrypted: encryptedBlock
    });
    
    // Add to the ciphertext
    result.ciphertext.push(...encryptedBlock);
    
    // Update the previous block for the next iteration
    previousBlock = encryptedBlock;
  }
  
  return result;
}

/**
 * Records the intermediate steps of CBC mode decryption for educational purposes
 * 
 * @param ciphertext The encrypted data
 * @param key The decryption key
 * @param iv The initialization vector
 * @returns An object containing the steps of the decryption process
 */
export function decryptCBCWithSteps(
  ciphertext: number[], 
  key: number[], 
  iv: number[]
): {
  iv: number[],
  ciphertext: number[],
  blocks: {
    index: number,
    cipherBlock: number[],
    decrypted: number[],
    xorWithPrevious: number[]
  }[],
  paddedPlaintext: number[],
  plaintext: number[]
} {
  // Initialize the result
  const result = {
    iv,
    ciphertext,
    blocks: [] as {
      index: number,
      cipherBlock: number[],
      decrypted: number[],
      xorWithPrevious: number[]
    }[],
    paddedPlaintext: [] as number[],
    plaintext: [] as number[]
  };
  
  try {
    // Process each block
    let previousBlock = [...iv];
    for (let i = 0; i < ciphertext.length; i += BLOCK_SIZE_BYTES) {
      // Extract the current block
      const cipherBlock = ciphertext.slice(i, i + BLOCK_SIZE_BYTES);
      
      // Decrypt the block
      const decryptedBlock = aesDecryptBlock(cipherBlock, key);
      
      // XOR with the previous ciphertext block (or IV for the first block)
      const xoredBlock = xorBytes(decryptedBlock, previousBlock);
      
      // Record the steps
      result.blocks.push({
        index: i / BLOCK_SIZE_BYTES,
        cipherBlock,
        decrypted: decryptedBlock,
        xorWithPrevious: xoredBlock
      });
      
      // Add to the padded plaintext
      result.paddedPlaintext.push(...xoredBlock);
      
      // Update the previous block for the next iteration
      previousBlock = cipherBlock;
    }
    
    // Remove padding with additional validation
    result.plaintext = unpadPKCS7(result.paddedPlaintext);
    
    return result;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}. This may be due to incorrect key, IV, or corrupted ciphertext.`);
  }
}