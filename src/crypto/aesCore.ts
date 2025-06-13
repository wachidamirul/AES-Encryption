/**
 * AES Core Implementation
 * 
 * This file contains the core functions for the AES encryption and decryption processes.
 * It implements the following operations:
 * - SubBytes: Substitutes each byte with another according to the S-box
 * - ShiftRows: Cyclically shifts the rows of the state
 * - MixColumns: Mixes the columns of the state array using a linear transformation
 * - AddRoundKey: Combines the state with the round key using XOR
 */

import { 
  SBOX, INV_SBOX, MULT_2, MULT_3, MULT_9, MULT_11, MULT_13, MULT_14,
  KEY_SIZES, NUM_ROUNDS, BLOCK_SIZE_BYTES
} from './aesConstants';
import { keyExpansion } from './keyExpansion';

/**
 * Applies the SubBytes transformation to the state array
 * Each byte is replaced with another according to the S-box
 * 
 * @param state The state array to transform (4x4 matrix)
 * @returns The transformed state array
 */
export function subBytes(state: number[][]): number[][] {
  const newState = state.map(row => [...row]);
  
  // Replace each byte with its corresponding value from the S-box
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      newState[row][col] = SBOX[state[row][col]];
    }
  }
  
  return newState;
}

/**
 * Applies the inverse SubBytes transformation for decryption
 * 
 * @param state The state array to transform
 * @returns The transformed state array
 */
export function invSubBytes(state: number[][]): number[][] {
  const newState = state.map(row => [...row]);
  
  // Replace each byte with its corresponding value from the inverse S-box
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      newState[row][col] = INV_SBOX[state[row][col]];
    }
  }
  
  return newState;
}

/**
 * Applies the ShiftRows transformation to the state array
 * Row 0 is not shifted, row 1 is shifted by 1, row 2 by 2, and row 3 by 3
 * 
 * @param state The state array to transform
 * @returns The transformed state array
 */
export function shiftRows(state: number[][]): number[][] {
  const newState = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Row 0: No shift
  newState[0][0] = state[0][0];
  newState[0][1] = state[0][1];
  newState[0][2] = state[0][2];
  newState[0][3] = state[0][3];
  
  // Row 1: Shift left by 1
  newState[1][0] = state[1][1];
  newState[1][1] = state[1][2];
  newState[1][2] = state[1][3];
  newState[1][3] = state[1][0];
  
  // Row 2: Shift left by 2
  newState[2][0] = state[2][2];
  newState[2][1] = state[2][3];
  newState[2][2] = state[2][0];
  newState[2][3] = state[2][1];
  
  // Row 3: Shift left by 3
  newState[3][0] = state[3][3];
  newState[3][1] = state[3][0];
  newState[3][2] = state[3][1];
  newState[3][3] = state[3][2];
  
  return newState;
}

/**
 * Applies the inverse ShiftRows transformation for decryption
 * 
 * @param state The state array to transform
 * @returns The transformed state array
 */
export function invShiftRows(state: number[][]): number[][] {
  const newState = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Row 0: No shift
  newState[0][0] = state[0][0];
  newState[0][1] = state[0][1];
  newState[0][2] = state[0][2];
  newState[0][3] = state[0][3];
  
  // Row 1: Shift right by 1
  newState[1][0] = state[1][3];
  newState[1][1] = state[1][0];
  newState[1][2] = state[1][1];
  newState[1][3] = state[1][2];
  
  // Row 2: Shift right by 2
  newState[2][0] = state[2][2];
  newState[2][1] = state[2][3];
  newState[2][2] = state[2][0];
  newState[2][3] = state[2][1];
  
  // Row 3: Shift right by 3
  newState[3][0] = state[3][1];
  newState[3][1] = state[3][2];
  newState[3][2] = state[3][3];
  newState[3][3] = state[3][0];
  
  return newState;
}

/**
 * Applies the MixColumns transformation to the state array
 * Each column is treated as a polynomial and multiplied with a fixed polynomial
 * 
 * @param state The state array to transform
 * @returns The transformed state array
 */
export function mixColumns(state: number[][]): number[][] {
  const newState = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Process each column
  for (let col = 0; col < 4; col++) {
    // For each byte in the column
    newState[0][col] = MULT_2[state[0][col]] ^ MULT_3[state[1][col]] ^ state[2][col] ^ state[3][col];
    newState[1][col] = state[0][col] ^ MULT_2[state[1][col]] ^ MULT_3[state[2][col]] ^ state[3][col];
    newState[2][col] = state[0][col] ^ state[1][col] ^ MULT_2[state[2][col]] ^ MULT_3[state[3][col]];
    newState[3][col] = MULT_3[state[0][col]] ^ state[1][col] ^ state[2][col] ^ MULT_2[state[3][col]];
  }
  
  return newState;
}

/**
 * Applies the inverse MixColumns transformation for decryption
 * 
 * @param state The state array to transform
 * @returns The transformed state array
 */
export function invMixColumns(state: number[][]): number[][] {
  const newState = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Process each column
  for (let col = 0; col < 4; col++) {
    // For each byte in the column using the inverse matrix multiplication
    newState[0][col] = MULT_14[state[0][col]] ^ MULT_11[state[1][col]] ^ MULT_13[state[2][col]] ^ MULT_9[state[3][col]];
    newState[1][col] = MULT_9[state[0][col]] ^ MULT_14[state[1][col]] ^ MULT_11[state[2][col]] ^ MULT_13[state[3][col]];
    newState[2][col] = MULT_13[state[0][col]] ^ MULT_9[state[1][col]] ^ MULT_14[state[2][col]] ^ MULT_11[state[3][col]];
    newState[3][col] = MULT_11[state[0][col]] ^ MULT_13[state[1][col]] ^ MULT_9[state[2][col]] ^ MULT_14[state[3][col]];
  }
  
  return newState;
}

/**
 * Applies the AddRoundKey transformation to the state array
 * Each byte of the state is XORed with the corresponding byte of the round key
 * 
 * @param state The state array to transform
 * @param roundKey The round key to use
 * @returns The transformed state array
 */
export function addRoundKey(state: number[][], roundKey: number[]): number[][] {
  const newState = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // The round key is in a flat array format, we need to convert it to a 4x4 matrix
  const keyMatrix = Array(4).fill(0).map(() => Array(4).fill(0));
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      keyMatrix[row][col] = roundKey[col * 4 + row];
    }
  }
  
  // XOR each byte of the state with the corresponding byte of the round key
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      newState[row][col] = state[row][col] ^ keyMatrix[row][col];
    }
  }
  
  return newState;
}

/**
 * Converts a byte array into a state matrix
 * The state matrix is a 4x4 grid where bytes are filled column by column
 * 
 * @param bytes Input bytes (16 bytes for AES)
 * @returns 4x4 state matrix
 */
export function bytesToState(bytes: number[]): number[][] {
  if (bytes.length !== BLOCK_SIZE_BYTES) {
    throw new Error(`Invalid block size: ${bytes.length} bytes. Must be ${BLOCK_SIZE_BYTES} bytes.`);
  }
  
  const state = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Fill the state matrix column by column
  for (let i = 0; i < BLOCK_SIZE_BYTES; i++) {
    const row = i % 4;
    const col = Math.floor(i / 4);
    state[row][col] = bytes[i];
  }
  
  return state;
}

/**
 * Converts a state matrix back into a byte array
 * 
 * @param state 4x4 state matrix
 * @returns Byte array (16 bytes for AES)
 */
export function stateToBytes(state: number[][]): number[] {
  const bytes = Array(BLOCK_SIZE_BYTES).fill(0);
  
  // Extract bytes from state matrix column by column
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      bytes[col * 4 + row] = state[row][col];
    }
  }
  
  return bytes;
}

/**
 * Performs a single round of the AES encryption process
 * 
 * @param state The current state matrix
 * @param roundKey The round key for this round
 * @param isFinalRound Whether this is the final round (MixColumns is skipped in final round)
 * @returns The new state after applying the round
 */
export function aesEncryptionRound(state: number[][], roundKey: number[], isFinalRound: boolean = false): number[][] {
  let newState = subBytes(state);
  newState = shiftRows(newState);
  
  if (!isFinalRound) {
    newState = mixColumns(newState);
  }
  
  newState = addRoundKey(newState, roundKey);
  return newState;
}

/**
 * Performs a single round of the AES decryption process
 * 
 * @param state The current state matrix
 * @param roundKey The round key for this round
 * @param isFirstRound Whether this is the first round (InvMixColumns is skipped in first round)
 * @returns The new state after applying the round
 */
export function aesDecryptionRound(state: number[][], roundKey: number[], isFirstRound: boolean = false): number[][] {
  let newState = invShiftRows(state);
  newState = invSubBytes(newState);
  newState = addRoundKey(newState, roundKey);
  
  if (!isFirstRound) {
    newState = invMixColumns(newState);
  }
  
  return newState;
}

/**
 * Complete AES encryption of a single block
 * 
 * @param block The 16-byte block to encrypt
 * @param key The encryption key
 * @returns The encrypted block
 */
export function aesEncryptBlock(block: number[], key: number[]): number[] {
  // Generate round keys
  const roundKeys = keyExpansion(key);
  const numRounds = roundKeys.length - 1;
  
  // Initialize state with the input block
  let state = bytesToState(block);
  
  // Initial round: just add round key
  state = addRoundKey(state, roundKeys[0]);
  
  // Main rounds
  for (let round = 1; round < numRounds; round++) {
    state = aesEncryptionRound(state, roundKeys[round]);
  }
  
  // Final round (no MixColumns)
  state = aesEncryptionRound(state, roundKeys[numRounds], true);
  
  // Convert the final state back to a byte array
  return stateToBytes(state);
}

/**
 * Complete AES decryption of a single block
 * 
 * @param block The 16-byte encrypted block
 * @param key The decryption key
 * @returns The decrypted block
 */
export function aesDecryptBlock(block: number[], key: number[]): number[] {
  // Generate round keys
  const roundKeys = keyExpansion(key);
  const numRounds = roundKeys.length - 1;
  
  // Initialize state with the input block
  let state = bytesToState(block);
  
  // Initial round: add round key
  state = addRoundKey(state, roundKeys[numRounds]);
  
  // Main rounds
  for (let round = numRounds - 1; round > 0; round--) {
    state = aesDecryptionRound(state, roundKeys[round]);
  }
  
  // Final round (no InvMixColumns)
  state = aesDecryptionRound(state, roundKeys[0], true);
  
  // Convert the final state back to a byte array
  return stateToBytes(state);
}

/**
 * Debugging and educational function to display a state matrix
 * 
 * @param state The state matrix to display
 * @returns The state matrix as a formatted array of hex values
 */
export function formatState(state: number[][]): string[][] {
  return state.map(row => 
    row.map(byte => byte.toString(16).padStart(2, '0'))
  );
}