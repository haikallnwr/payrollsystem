# Aplikasi Sistem Penggajian Karyawan (Payroll Management System)

Aplikasi berbasis web untuk mengelola data karyawan, pengajuan lembur, klaim reimbursement, hingga pembuatan slip gaji secara otomatis. Proyek ini dibuat untuk memenuhi skema sertifikasi LSP Analis Program.

---

## Fitur Utama dan Aturan Bisnis

### 1. Pembagian Hak Akses Pengguna
- **Administrator / Admin**: Memiliki akses penuh untuk mengelola pengguna, divisi, jabatan, data karyawan, pengajuan lembur, reimbursement, dan pembuatan gaji.
- **HR**: Memiliki akses untuk memeriksa dan menyetujui pengajuan lembur, reimbursement, serta status gaji karyawan staff.
- **Karyawan**: Memiliki akses untuk melihat profil pribadi, mengajukan klaim reimbursement, melihat catatan lembur, dan mengunduh slip gaji.

### 2. Aturan Keamanan Khusus HR
Untuk menjaga independensi dan mencegah konflik kepentingan, pengguna dengan peran HR **tidak dapat menyetujui atau memproses pengajuan lembur, reimbursement, dan slip gaji milik dirinya sendiri**. Sistem akan secara otomatis menolak tindakan tersebut.

### 3. Aturan Lembur dan Reimbursement
- **Jam Lembur**: Input durasi lembur wajib berupa **angka bulat** (seperti 1, 2, atau 3 jam).
- **Kalkulasi Tarif Lembur Dinamis**: Upah lembur dihitung secara otomatis berdasarkan gaji pokok karyawan menggunakan standar ketenagakerjaan:
  $$\text{Tarif Lembur per Jam} = \frac{\text{Gaji Pokok}}{173}$$
  $$\text{Total Upah Lembur} = \text{Jam Lembur} \times \text{Tarif Lembur per Jam}$$
- **Reimbursement**: Karyawan mengajukan klaim biaya yang kemudian perlu disetujui oleh HR atau Admin sebelum digabungkan ke dalam perhitungan gaji.

### 4. Rumus Perhitungan Gaji
Perhitungan gaji bersih dilakukan secara otomatis dengan rumus berikut:
- **Gaji Kotor** = Gaji Pokok + Total Lembur + Total Reimbursement
- **Potongan Pajak** = (Gaji Kotor x Persentase Pajak) / 100
- **Gaji Bersih** = Gaji Kotor - Potongan Pajak

### 5. Pengujian Otomatis
Tersedia 28 skenario pengujian otomatis di bagian backend menggunakan Vitest dan Supertest untuk memastikan seluruh alur aplikasi berjalan dengan benar.

---

## Teknologi yang Digunakan

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod.
- **Backend**: Express.js, Prisma ORM, MySQL.
- **Pengujian**: Vitest dan Supertest.
- **Otentikasi**: JWT (JSON Web Token) dengan cookie HTTP-only dan enkripsi sandi Bcrypt.

---

## Struktur Folder Proyek

```
lsp-payrollsystem/
├── api/                        # Kode Backend Express.js
│   ├── controllers/            # Pengolah permintaan HTTP
│   ├── lib/                    # Koneksi database Prisma dan pustaka umum
│   ├── middleware/             # Otentikasi JWT dan penanganan kesalahan
│   ├── models/                 # Definisi tipe data TypeScript
│   ├── prisma/                 # Skema database dan skrip data awal (seed)
│   ├── routes/                 # Jalur rute API backend
│   ├── services/               # Logika bisnis utama
│   └── tests/                  # File pengujian otomatis (28 skenario)
│
└── src/                        # Kode Frontend React
    ├── app/                    # Konfigurasi routing dan provider
    ├── components/             # Komponen UI dan tata letak umum
    └── features/               # Modul fitur (auth, division, employee, overtime, payroll, dll)
```

---

## Cara Menjalankan Aplikasi

### Persyaratan Sistem
- Node.js versi 18 atau yang lebih baru.
- Database MySQL atau MariaDB yang sudah berjalan.

---

### Langkah 1: Clone Repository dan Install Dependensi

Buka terminal dan jalankan perintah berikut:

```bash
# Clone repository
git clone https://github.com/haikallnwr/payrollsystem.git
cd payrollsystem

# Install dependensi frontend dan backend
npm install
cd api && npm install && cd ..
```

---

### Langkah 2: Konfigurasi Environment Variable

Buat file `.env` di dalam folder `api/` dengan isi minimal berikut:

```env
PORT=5000
SECRET_KEY=secret_key_jwt_kamu

DATABASE_URL="mysql://root:password_mysql_kamu@localhost:3306/lsp_payrollsystem"

APP_EMAIL=admin@company.com
APP_PASSWORD=Password123!
```

---

### Langkah 3: Membuat Tabel Database dan Data Awal

Jalankan perintah berikut di dalam folder `api/` untuk membuat struktur tabel di MySQL dan meng-seed data awal Admin:

```bash
cd api

# Buat tabel di MySQL
npx prisma db push

# Isi data awal akun Admin (admin@company.com)
npm run seed

cd ..
```

---

### Langkah 4: Menjalankan Aplikasi

Cukup jalankan satu perintah berikut di root folder proyek untuk menjalankan frontend dan backend secara bersamaan:

```bash
npm run dev
```

Aplikasi akan otomatis berjalan di:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

---

## Cara Menjalankan Pengujian Otomatis

Untuk menjalankan suite pengujian backend (28 skenario tes):

```bash
cd api
npm test
```

---

## Daftar Endpoint API Utama

| Modul | Metode | Endpoint | Hak Akses | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/users/login` | Publik | Masuk ke sistem dan menerima cookie JWT |
| **Auth** | `GET` | `/api/users/me` | Login | Melihat data pengguna yang sedang aktif |
| **Divisi** | `GET` | `/api/divisions` | Login | Menampilkan daftar seluruh divisi |
| **Divisi** | `POST` | `/api/divisions/create` | Admin | Menambah divisi baru |
| **Divisi** | `PUT` | `/api/divisions/update/:id` | Admin | Memperbarui data divisi |
| **Divisi** | `DELETE` | `/api/divisions/delete/:id` | Admin | Menghapus divisi (soft delete) |
| **Karyawan** | `GET` | `/api/employees` | Login | Menampilkan daftar seluruh karyawan |
| **Karyawan** | `POST` | `/api/employees/create` | Admin | Menambah profil karyawan baru |
| **Lembur** | `POST` | `/api/overtimes/create` | Admin / HR | Mencatat lembur karyawan |
| **Reimbursement** | `POST` | `/api/reimbursements/create` | Karyawan | Mengajukan klaim reimbursement |
| **Reimbursement** | `PUT` | `/api/reimbursements/approve/:id` | Admin / HR | Menyetujui klaim reimbursement |
| **Payroll** | `POST` | `/api/payrolls/generate` | Admin | Membuat slip gaji untuk satu karyawan |
| **Payroll** | `POST` | `/api/payrolls/generate-batch` | Admin | Membuat slip gaji sekaligus untuk seluruh karyawan |
| **Payroll** | `PUT` | `/api/payrolls/status/:id` | Admin / HR | Memperbarui status pembayaran gaji |
