# AES Encryption Educational Application

Aplikasi web edukasi interaktif untuk memvisualisasikan dan mempelajari proses enkripsi dan dekripsi AES (Advanced
Encryption Standard) dalam mode CBC (Cipher Block Chaining). Cocok untuk pembelajaran kriptografi, demonstrasi di kelas,
atau eksplorasi mandiri.

---

## Fitur Utama

- **Visualisasi Langkah-langkah AES-CBC**: Menampilkan proses enkripsi dan dekripsi blok demi blok, termasuk padding,
  XOR dengan IV, dan transformasi AES.
- **Input Kustom**: Pengguna dapat memasukkan pesan, kunci, dan IV sendiri, atau menggunakan generator otomatis.
- **Panel Edukasi**: Penjelasan interaktif tentang SubBytes, ShiftRows, MixColumns, dan Key Expansion.
- **Animasi CBC**: Ilustrasi animasi alur data pada mode CBC (blok plaintext, XOR, AES, blok ciphertext, panah, dsb).
- **Tanpa Library Kriptografi Eksternal**: Implementasi AES dan CBC dibuat dari awal untuk tujuan edukasi, sehingga
  mudah dipelajari.

---

## Struktur Direktori

- `src/`
  - `App.tsx`: Komponen utama React, mengatur state, UI, dan logika utama aplikasi.
  - `components/`: Komponen React modular untuk visualisasi, input, dan panel edukasi.
    - `AESVisualization.tsx`: Visualisasi transformasi AES (SubBytes, ShiftRows, MixColumns).
    - `CBCVisualization.tsx`: Animasi proses CBC (XOR, blok, panah, dsb).
    - `EncryptionSteps.tsx` & `DecryptionSteps.tsx`: Menampilkan langkah-langkah detail proses enkripsi/dekripsi per
      blok.
    - `InfoPanel.tsx`: Panel informasi yang bisa di-expand/collapse.
    - `KeyInput.tsx` & `TextInput.tsx`: Komponen input untuk kunci, IV, pesan, dsb.
  - `crypto/`: Implementasi algoritma AES, mode CBC, utilitas, dan konstanta.
    - `aesCore.ts`: Implementasi inti AES (enkripsi/dekripsi blok).
    - `cbcMode.ts`: Implementasi mode CBC (enkripsi/dekripsi dengan IV dan chaining).
    - `keyExpansion.ts`: Proses ekspansi kunci (key schedule).
    - `utils.ts`: Fungsi utilitas (konversi string/hex/byte, validasi, dsb).
    - `aesConstants.ts`: Konstanta S-box, ukuran blok, dsb.
    - `index.ts`: API utama untuk enkripsi/dekripsi dan fungsi edukasi.
- `index.html`, `index.css`: Entry point dan styling global (menggunakan Tailwind CSS).
- Konfigurasi: `vite.config.ts`, `tailwind.config.js`, dsb.

---

## Penjelasan Alur Kerja

### Enkripsi

- Pengguna memasukkan pesan, kunci (hex), dan aplikasi akan menghasilkan IV secara otomatis.
- Saat tombol "Encrypt" ditekan, fungsi
  [encrypt](https://github.com/wachidamirul/AES-Encryption/blob/master/src/crypto/index.ts) akan:
  - Melakukan padding pesan.
  - Membagi pesan menjadi blok 16 byte.
  - Melakukan XOR blok pertama dengan IV, blok berikutnya dengan ciphertext sebelumnya.
  - Setiap blok diproses dengan AES (lihar
    [aesEncryptBlock](https://github.com/wachidamirul/AES-Encryption/blob/master/src/crypto/aesCore.ts)).
  - Hasil setiap langkah dicatat dan divisualisasikan.

### Dekripsi

- Pengguna memasukkan ciphertext (hex), IV (hex), dan kunci.
- Saat tombol "Decrypt" ditekan, fungsi
  [decrypt](https://github.com/wachidamirul/AES-Encryption/blob/master/src/crypto/index.ts) akan:
  - Membagi ciphertext menjadi blok.
  - Setiap blok didekripsi dengan AES, lalu di-XOR dengan IV/blok ciphertext sebelumnya.
  - Padding dihapus untuk mendapatkan plaintext asli.
  - Langkah-langkah dekripsi divisualisasikan.

### Panel Edukasi

- **CBCVisualization**: Menampilkan animasi proses CBC (blok, XOR, panah, dsb).
- **AESVisualization**: Menjelaskan dan memvisualisasikan SubBytes, ShiftRows, MixColumns dengan contoh matriks.
- **Key Expansion**: Menjelaskan proses ekspansi kunci dan jumlah round key sesuai panjang kunci.

---

## Instalasi

1. **Clone repository:**
   ```sh
   git clone https://github.com/wachidamirul/AES-Encryption
   cd AES-Encryption
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Jalankan aplikasi:**
   ```sh
   npm run dev
   ```
4. **Buka di browser:** Buka `http://localhost:5173` di browser Anda.

---

## Teknologi

- **ReactJS**: Untuk antarmuka pengguna interaktif.
- **TypeScript**: Untuk pengetikan statis dan pengembangan yang lebih aman.
- **Tailwind CSS**: Untuk styling responsif dan modern.
- **Vite**: Sebagai bundler/development server.

---

## Catatan

- **Hanya untuk edukasi**: Jangan gunakan aplikasi ini untuk kebutuhan keamanan nyata.
- **Kontribusi**: Pull request dan masukan sangat diterima!
