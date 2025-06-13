/**
 * AES Key Expansion
 * 
 * This file implements the key expansion algorithm used in AES.
 * The key expansion generates a series of round keys from the initial cipher key.
 * Each round of AES uses a different round key derived from the original key.
 */

import { SBOX, RCON, KEY_SIZES, NUM_ROUNDS } from './aesConstants';
import { hexToBytes, bytesToHex } from './utils';

/**
 * Performs AES key expansion to generate round keys
 * 
 * @param key The encryption/decryption key as a byte array
 * @returns An array of round keys, each represented as a byte array
 */
export function keyExpansion(key: number[]): number[][] {
  // Determine key size and set parameters
  const keyLengthBytes = key.length;
  let keySize: number;
  
  if (keyLengthBytes === 16) {
    keySize = KEY_SIZES.AES_128;
  } else if (keyLengthBytes === 24) {
    keySize = KEY_SIZES.AES_192;
  } else if (keyLengthBytes === 32) {
    keySize = KEY_SIZES.AES_256;
  } else {
    throw new Error(`Invalid key length: ${keyLengthBytes} bytes. Must be 16, 24, or 32 bytes.`);
  }
  
  const numRounds = NUM_ROUNDS[keySize];
  const roundKeys: number[][] = [];
  
  // The number of 32-bit words in the key
  const Nk = keyLengthBytes / 4;
  
  // The total number of 32-bit words in the expanded key
  const Nb = 4; // AES always uses 4 words per block
  const Nr = numRounds;
  const expandedKeyWords = Nb * (Nr + 1);
  
  // Initialize word array that will hold the expanded key
  const w: number[][] = Array(expandedKeyWords).fill(0).map(() => Array(4).fill(0));
  
  // Copy the original key into the first Nk words
  for (let i = 0; i < Nk; i++) {
    w[i][0] = key[4 * i];
    w[i][1] = key[4 * i + 1];
    w[i][2] = key[4 * i + 2];
    w[i][3] = key[4 * i + 3];
  }
  
  // Expand the key
  for (let i = Nk; i < expandedKeyWords; i++) {
    // Temporary variable to hold the word
    const temp = [...w[i - 1]];
    
    if (i % Nk === 0) {
      // Apply RotWord and SubWord for words at i % Nk === 0
      
      // RotWord: Rotate the word [a0, a1, a2, a3] to [a1, a2, a3, a0]
      const rotWord = [temp[1], temp[2], temp[3], temp[0]];
      
      // SubWord: Apply S-box substitution to each byte in the word
      const subWord = rotWord.map(byte => SBOX[byte]);
      
      // XOR with round constant
      subWord[0] ^= RCON[i / Nk];
      
      w[i] = subWord.map((byte, j) => byte ^ w[i - Nk][j]);
    } else if (Nk > 6 && i % Nk === 4) {
      // For AES-256 (Nk = 8), additional SubWord transformation at i % Nk === 4
      const subWord = temp.map(byte => SBOX[byte]);
      w[i] = subWord.map((byte, j) => byte ^ w[i - Nk][j]);
    } else {
      // Standard case: w[i] = w[i-1] ⊕ w[i-Nk]
      w[i] = temp.map((byte, j) => byte ^ w[i - Nk][j]);
    }
  }
  
  // Format the round keys (4 words per round key)
  for (let i = 0; i <= numRounds; i++) {
    const roundKey: number[] = [];
    for (let j = 0; j < 4; j++) {
      roundKey.push(...w[i * 4 + j]);
    }
    roundKeys.push(roundKey);
  }
  
  return roundKeys;
}

// Debugging and educational function to display the key expansion process
export function displayKeyExpansionSteps(key: string): { 
  originalKey: string, 
  roundKeys: string[],
  details: { 
    round: number, 
    keyHex: string, 
    keyMatrix: number[][]
  }[] 
} {
  const keyBytes = hexToBytes(key);
  const roundKeys = keyExpansion(keyBytes);
  
  const result = {
    originalKey: key,
    roundKeys: roundKeys.map(rk => bytesToHex(rk)),
    details: roundKeys.map((rk, i) => {
      // Convert to 4x4 matrix representation for educational purposes
      const matrix: number[][] = Array(4).fill(0).map(() => Array(4).fill(0));
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          matrix[row][col] = rk[col * 4 + row];
        }
      }
      
      return {
        round: i,
        keyHex: bytesToHex(rk),
        keyMatrix: matrix
      };
    })
  };
  
  return result;
}