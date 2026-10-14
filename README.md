# Komin-UASWEB (LaporSMK Web Version)

**LaporSMK** adalah aplikasi manajemen pelaporan dan pengaduan kerusakan fasilitas sekolah berbasis web. Proyek ini merupakan pengembangan lebih lanjut dari versi desktop (Java Swing) menjadi aplikasi web modern dengan mengintegrasikan fitur gamifikasi (poin, voucher, dan kuis) untuk meningkatkan partisipasi siswa.

Aplikasi ini dibangun menggunakan **Laravel 11**, **React**, **Inertia.js**, dan **Filament PHP** untuk panel administrasinya.

---

## 🚀 Fitur Utama

### 🧑‍🎓 Panel Pengguna (Siswa/User)
* **Pelaporan Fasilitas:** Siswa dapat melaporkan kerusakan fasilitas sekolah dengan detail kejadian dan foto.
* **Sistem Gamifikasi (Reward & Poin):** Pengguna mendapatkan poin dari laporan yang valid atau dari mengerjakan kuis.
* **Klaim Voucher:** Poin yang terkumpul dapat ditukarkan dengan voucher reward.
* **Kuis:** Fitur interaktif untuk menjawab pertanyaan dan mendapatkan poin tambahan.
* **Log Aktivitas & Status:** Pelacakan status pengaduan secara *real-time* (Pending, Proses, Selesai).

### 👨‍💻 Panel Admin (Filament PHP)
* **Dasbor Manajemen:** Antarmuka admin yang elegan untuk mengelola laporan pengaduan.
* **Manajemen Pengguna:** Mengelola data siswa dan hak akses.
* **Manajemen Artikel & Kuis:** Admin dapat menambah artikel informasi dan pertanyaan kuis.
* **Manajemen Voucher & Reward:** Mengelola jenis voucher yang bisa diklaim oleh siswa.
* **Log & Tracking:** Memantau log aktivitas pengguna dan perubahan status pengaduan.

---

## 🛠️ Arsitektur Teknologi & Spesifikasi

* **Backend Framework:** [Laravel 11](https://laravel.com/)
* **Frontend Framework:** [React](https://react.dev/) dengan [Inertia.js](https://inertiajs.com/)
* **Admin Panel:** [Filament v3](https://filamentphp.com/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Database:**  MySQL

---

## 🗃️ Struktur Model Utama

Aplikasi ini memiliki beberapa model database utama:
* `Pengaduan`: Menyimpan data laporan dari pengguna.
* `Reward` & `VoucherKlaim`: Sistem gamifikasi untuk poin dan penukaran voucher.
* `Quest`, `QuizQuestion`, `QuizAttempt`: Fitur kuis untuk pengguna.
* `User`: Data pengguna sistem (Admin & Siswa).
* `LogAktivitasUser` & `LogStatusPengaduan`: Pencatatan riwayat aktivitas.

---

## 📦 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
* **PHP** >= 8.2
* **Composer**
* **Node.js** & **NPM**
* Database (MySQL)

### 2. Langkah Instalasi

1. **Clone repositori ini** (atau ekstrak source code).
2. **Install dependensi PHP:**
   ```bash
   composer install
   ```
3. **Install dependensi Node.js:**
   ```bash
   npm install
   ```
4. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env`.
   ```bash
   cp .env.example .env
   ```
   *Generate application key:*
   ```bash
   php artisan key:generate
   ```
5. **Konfigurasi Database:**
   Secara default, Laravel 11 menggunakan `mysql`. Anda dapat mengubah konfigurasi di file `.env` jika ingin menggunakan `mysql`.
6. **Jalankan Migrasi Database:**
   ```bash
   php artisan migrate
   ```
   *(Opsional) Jika ada seeder, jalankan: `php artisan migrate --seed`*
7. **Link Storage (untuk upload gambar/file):**
   ```bash
   php artisan storage:link
   ```

### 3. Menjalankan Aplikasi
Buka dua terminal dan jalankan perintah berikut secara bersamaan:

**Terminal 1 (Menjalankan server PHP):**
```bash
php artisan serve
```

**Terminal 2 (Menjalankan Vite build tool untuk React/Tailwind):**
```bash
npm run dev
```

Aplikasi sekarang dapat diakses melalui browser di: `http://localhost:8000`. Panel admin dapat diakses melalui rute admin (misalnya `http://localhost:8000/admin`).

---

## 🧑‍💻 Kontributor
* **Nabil Alif Malikulmulki** - Pengembang Utama