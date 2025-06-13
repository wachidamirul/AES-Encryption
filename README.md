# AES Encryption Educational Application

Aplikasi web interaktif untuk memvisualisasikan dan mempelajari proses enkripsi dan dekripsi AES (Advanced Encryption
Standard) dalam mode CBC (Cipher Block Chaining). Cocok untuk pembelajaran kriptografi, demonstrasi di kelas, atau
eksplorasi mandiri.

## Fitur

- **Visualisasi Langkah-langkah AES-CBC**: Lihat proses enkripsi dan dekripsi blok demi blok, termasuk padding, XOR
  dengan IV, dan transformasi AES.
- **Input Kustom**: Masukkan pesan, kunci, dan IV sendiri, atau gunakan generator otomatis.
- **Panel Edukasi**: Penjelasan interaktif tentang SubBytes, ShiftRows, MixColumns, dan Key Expansion.
- **Animasi CBC**: Ilustrasi animasi alur data pada mode CBC.
- **Tanpa Library Kriptografi Eksternal**: Implementasi AES dan CBC dibuat dari awal untuk tujuan edukasi.

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

## Struktur Direktori

- `crypto/`: Implementasi AES, mode CBC, utilitas, dan konstanta.
- `components/`: Komponen React untuk visualisasi, input, dan panel edukasi.
- `App.tsx`: Komponen utama aplikasi.

## Teknologi

- **NextJs**: Untuk antarmuka pengguna interaktif.
- **TypeScript**: Untuk pengetikan statis dan pengembangan yang lebih aman.
- **Tailwind CSS**: Untuk styling responsif dan modern.

## Catatan

- **Hanya untuk edukasi**: Jangan gunakan aplikasi ini untuk kebutuhan keamanan nyata.
- **Kontribusi**: Pull request dan masukan sangat diterima!
