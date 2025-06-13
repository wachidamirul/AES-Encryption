/**
 * Utility Functions for AES Implementation
 * 
 * This file provides helper functions for text/binary conversion, random number
 * generation, and other utilities needed for AES encryption and decryption.
 */

/**
 * Converts a string to a byte array
 * 
 * @param str The input string
 * @returns Byte array representation
 */
export function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

/**
 * Converts a byte array to a string
 * 
 * @param bytes The byte array
 * @returns String representation
 */
export function bytesToString(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}

/**
 * Converts a hex string to a byte array
 * 
 * @param hex The hex string (without '0x' prefix)
 * @returns Byte array representation
 */
export function hexToBytes(hex: string): number[] {
  // Remove spaces and ensure even length
  hex = hex.replace(/\s/g, '');
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  return bytes;
}

/**
 * Converts a byte array to a hex string
 * 
 * @param bytes The byte array
 * @returns Hex string representation
 */
export function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an array of random bytes
 * 
 * @param length The number of bytes to generate
 * @returns An array of random bytes
 */
export function generateRandomBytes(length: number): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < length; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  return bytes;
}

/**
 * XORs two byte arrays
 * 
 * @param a First byte array
 * @param b Second byte array
 * @returns Result of XOR operation
 */
export function xorBytes(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Byte arrays must have the same length: ${a.length} vs ${b.length}`);
  }
  
  const result: number[] = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i] ^ b[i]);
  }
  
  return result;
}

/**
 * Splits a byte array into blocks of the specified size
 * 
 * @param bytes The byte array to split
 * @param blockSize The size of each block
 * @returns An array of blocks
 */
export function splitIntoBlocks(bytes: number[], blockSize: number): number[][] {
  const blocks: number[][] = [];
  for (let i = 0; i < bytes.length; i += blockSize) {
    blocks.push(bytes.slice(i, i + blockSize));
  }
  return blocks;
}

/**
 * Joins an array of blocks into a single byte array
 * 
 * @param blocks The array of blocks
 * @returns The combined byte array
 */
export function joinBlocks(blocks: number[][]): number[] {
  return blocks.flat();
}

/**
 * Formats a byte array for display
 * 
 * @param bytes The byte array to format
 * @param bytesPerGroup Optional number of bytes per group
 * @returns Formatted string
 */
export function formatBytesForDisplay(bytes: number[], bytesPerGroup: number = 4): string {
  const hex = bytesToHex(bytes);
  let result = '';
  
  for (let i = 0; i < hex.length; i += bytesPerGroup * 2) {
    result += hex.substring(i, i + bytesPerGroup * 2) + ' ';
  }
  
  return result.trim();
}

/**
 * Checks if an input string is a valid hex string
 * 
 * @param input The input string to check
 * @returns True if the input is a valid hex string
 */
export function isValidHex(input: string): boolean {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  return hexRegex.test(input.replace(/\s/g, ''));
}

/**
 * Validates a key based on its length
 * 
 * @param key The key to validate
 * @returns True if the key has a valid length
 */
export function isValidKeyLength(key: number[]): boolean {
  return key.length === 16 || key.length === 24 || key.length === 32;
}