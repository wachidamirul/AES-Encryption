import React, { useState, useEffect } from "react";
import TextInput from "./components/TextInput";
import KeyInput from "./components/KeyInput";
import EncryptionSteps from "./components/EncryptionSteps";
import DecryptionSteps from "./components/DecryptionSteps";
import InfoPanel from "./components/InfoPanel";
import AESVisualization from "./components/AESVisualization";
import CBCVisualization from "./components/CBCVisualization";
import { encrypt, decrypt, aesEducational } from "./crypto";
import { Lock, Unlock, Info, RefreshCw, KeyRound, ArrowRightLeft } from "lucide-react";

function App() {
  // State for input values
  const [message, setMessage] = useState<string>("Hello, this is a test message for AES encryption!");
  const [key, setKey] = useState<string>(aesEducational.generateKey(128));
  const [iv, setIv] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

  // State for encryption/decryption steps
  const [encryptionSteps, setEncryptionSteps] = useState<any>(null);
  const [decryptionSteps, setDecryptionSteps] = useState<any>(null);

  // Validation states
  const [isKeyValid, setIsKeyValid] = useState<boolean>(true);
  const [isIvValid, setIsIvValid] = useState<boolean>(true);
  const [isCiphertextValid, setIsCiphertextValid] = useState<boolean>(true);

  // UI state
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [showEducationalContent, setShowEducationalContent] = useState<boolean>(true);

  // Perform encryption
  const handleEncrypt = () => {
    if (!isKeyValid) return;

    try {
      // Encrypt with steps recording
      const result = encrypt(message, key, true);
      setCiphertext(result.ciphertext);
      setIv(result.iv);
      setEncryptionSteps(result.steps);

      // Clear any previous decryption results
      setDecryptedText("");
      setDecryptionSteps(null);
    } catch (error) {
      console.error("Encryption error:", error);
      alert(`Encryption failed: ${(error as Error).message}`);
    }
  };

  // Perform decryption
  const handleDecrypt = () => {
    if (!isKeyValid || !isIvValid || !isCiphertextValid) return;

    try {
      // Decrypt with steps recording
      const result = decrypt(ciphertext, key, iv, true);
      setDecryptedText(result.plaintext);
      setDecryptionSteps(result.steps);
    } catch (error) {
      console.error("Decryption error:", error);
      alert(`Decryption failed: ${(error as Error).message}`);
    }
  };

  // Validate IV input when it changes
  useEffect(() => {
    if (!iv) {
      setIsIvValid(true);
      return;
    }

    setIsIvValid(aesEducational.isValidHex(iv) && iv.replace(/\s+/g, "").length === 32);
  }, [iv]);

  // Validate ciphertext when it changes
  useEffect(() => {
    if (!ciphertext) {
      setIsCiphertextValid(true);
      return;
    }

    setIsCiphertextValid(aesEducational.isValidHex(ciphertext));
  }, [ciphertext]);

  // Generate a new random IV
  const handleGenerateIv = () => {
    setIv(aesEducational.generateIV());
  };

  // Switch between encrypted and decrypted results
  const handleSwitchMode = () => {
    if (activeTab === "encrypt") {
      setActiveTab("decrypt");
      // If we have ciphertext but no decryption, attempt to decrypt
      if (ciphertext && !decryptedText && isKeyValid && isIvValid) {
        handleDecrypt();
      }
    } else {
      setActiveTab("encrypt");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AES Encryption Explorer</h1>
                <p className="text-gray-600 text-sm">Educational tool for understanding AES-CBC encryption</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowEducationalContent(!showEducationalContent)}
                className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">
                <Info className="w-4 h-4 mr-1" />
                {showEducationalContent ? "Hide" : "Show"} Educational Content
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Tab navigation */}
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    activeTab === "encrypt"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("encrypt")}>
                  <Lock className="w-4 h-4 mr-2" />
                  Encrypt
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    activeTab === "decrypt"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("decrypt")}>
                  <Unlock className="w-4 h-4 mr-2" />
                  Decrypt
                </button>

                {(ciphertext || decryptedText) && (
                  <button
                    className="ml-auto px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm flex items-center"
                    onClick={handleSwitchMode}>
                    <ArrowRightLeft className="w-3 h-3 mr-1" />
                    Switch
                  </button>
                )}
              </div>

              {/* Encryption tab */}
              {activeTab === "encrypt" && (
                <div>
                  <TextInput
                    label="Message to Encrypt"
                    value={message}
                    onChange={setMessage}
                    placeholder="Enter text to encrypt"
                    isMultiline={true}
                  />

                  <KeyInput keyValue={key} onChange={setKey} onKeyValidChange={setIsKeyValid} />

                  <div className="mt-6">
                    <button
                      onClick={handleEncrypt}
                      disabled={!isKeyValid || !message}
                      className={`w-full py-3 rounded-md flex items-center justify-center font-medium transition
                                ${
                                  isKeyValid && message
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}>
                      <Lock className="w-5 h-5 mr-2" />
                      Encrypt Message
                    </button>
                  </div>

                  {ciphertext && (
                    <div className="mt-6">
                      <TextInput
                        label="Initialization Vector (IV)"
                        value={iv}
                        onChange={setIv}
                        isHex={true}
                        readOnly={true}
                      />

                      <TextInput
                        label="Encrypted Text (Ciphertext)"
                        value={ciphertext}
                        onChange={setCiphertext}
                        isHex={true}
                        isMultiline={true}
                        readOnly={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Decryption tab */}
              {activeTab === "decrypt" && (
                <div>
                  <TextInput
                    label="Ciphertext to Decrypt"
                    value={ciphertext}
                    onChange={setCiphertext}
                    placeholder="Enter ciphertext in hex format"
                    isMultiline={true}
                    isHex={true}
                  />

                  <div className="flex space-x-4 items-end">
                    <div className="flex-1">
                      <TextInput
                        label="Initialization Vector (IV)"
                        value={iv}
                        onChange={setIv}
                        placeholder="Enter IV in hex format"
                        isHex={true}
                      />
                    </div>
                    <button
                      onClick={handleGenerateIv}
                      className="mb-4 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm flex items-center">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Generate
                    </button>
                  </div>

                  <KeyInput keyValue={key} onChange={setKey} onKeyValidChange={setIsKeyValid} />

                  <div className="mt-6">
                    <button
                      onClick={handleDecrypt}
                      disabled={!isKeyValid || !isIvValid || !isCiphertextValid || !ciphertext || !iv}
                      className={`w-full py-3 rounded-md flex items-center justify-center font-medium transition
                                ${
                                  isKeyValid && isIvValid && isCiphertextValid && ciphertext && iv
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}>
                      <Unlock className="w-5 h-5 mr-2" />
                      Decrypt Message
                    </button>
                  </div>

                  {decryptedText && (
                    <div className="mt-6">
                      <TextInput
                        label="Decrypted Text"
                        value={decryptedText}
                        onChange={() => {}}
                        isMultiline={true}
                        readOnly={true}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Encryption/Decryption steps */}
            {activeTab === "encrypt" && encryptionSteps && <EncryptionSteps steps={encryptionSteps} />}

            {activeTab === "decrypt" && decryptionSteps && <DecryptionSteps steps={decryptionSteps} />}

            {/* Educational content */}
            {showEducationalContent && (
              <div className="space-y-4">
                <InfoPanel title="Cipher Block Chaining (CBC) Mode" icon="lock" defaultExpanded={true}>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      CBC mode chains each block of encrypted data with the previous block, causing each ciphertext
                      block to depend on all previous plaintext blocks. This dependency adds security by ensuring
                      identical plaintext blocks don't result in identical ciphertext blocks.
                    </p>

                    <CBCVisualization />

                    <div className="text-sm">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Each block is XORed with the previous ciphertext block before encryption</li>
                        <li>Requires an Initialization Vector (IV) for the first block</li>
                        <li>Encryption is sequential and cannot be parallelized</li>
                        <li>Decryption can be parallelized as blocks are independently decrypted</li>
                        <li>
                          Error propagation: an error in one ciphertext block affects decryption of that block and the
                          next
                        </li>
                      </ul>
                    </div>
                  </div>
                </InfoPanel>

                <InfoPanel title="AES Algorithm Details" icon="shield" defaultExpanded={true}>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      The Advanced Encryption Standard (AES) is a symmetric block cipher algorithm that processes
                      fixed-size blocks of 128 bits (16 bytes) using keys of 128, 192, or 256 bits. The algorithm
                      consists of multiple rounds, each performing four main operations on the state.
                    </p>

                    <AESVisualization />
                  </div>
                </InfoPanel>

                <InfoPanel title="Key Expansion & Round Keys" icon="unlock">
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      AES key expansion derives round keys from the original cipher key. Each AES round uses a different
                      round key to enhance security.
                    </p>

                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                      <h4 className="font-semibold mb-2">Key Expansion Process:</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Original key is divided into 4-byte words</li>
                        <li>
                          For each new word:
                          <ul className="list-disc pl-5 mt-1 space-y-0.5">
                            <li>
                              If its position is a multiple of key length, apply transformations:
                              <ul className="list-circle pl-5 mt-1 space-y-0.5">
                                <li>Rotate word (circular left shift by one byte)</li>
                                <li>Substitute bytes using S-box</li>
                                <li>XOR with round constant</li>
                              </ul>
                            </li>
                            <li>For AES-256, additional transformation at certain positions</li>
                            <li>XOR with word from key length positions earlier</li>
                          </ul>
                        </li>
                        <li>Round keys are extracted from the expanded key schedule</li>
                      </ol>
                    </div>

                    <div className="text-sm mt-2">
                      <h4 className="font-semibold">Number of Rounds by Key Size:</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>AES-128: 10 rounds</li>
                        <li>AES-192: 12 rounds</li>
                        <li>AES-256: 14 rounds</li>
                      </ul>
                    </div>
                  </div>
                </InfoPanel>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">AES Encryption Educational Tool</p>
              <p className="text-xs text-gray-400 mt-1">
                This application demonstrates AES encryption in CBC mode without using external cryptographic libraries.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              <p>For educational purposes only. Not for production use.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
