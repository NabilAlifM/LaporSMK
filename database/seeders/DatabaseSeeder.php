<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        DB::table('users')->insert([
            [
                'id_user' => 1,
                'nis_nip' => '100101',
                'nama_lengkap' => 'Adam wicaksono',
                'username' => 'adam wicaksono',
                'email' => 'adam@komin.com',
                'password' => Hash::make('Siswa231'),
                'role' => 'siswa',
                'total_poin' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_user' => 2,
                'nis_nip' => '100102',
                'nama_lengkap' => 'Alif alfathan',
                'username' => 'Snowman',
                'email' => 'snowman@komin.com',
                'password' => Hash::make('Siswa213'),
                'role' => 'siswa',
                'total_poin' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_user' => 3,
                'nis_nip' => '990011',
                'nama_lengkap' => 'Admin petugas',
                'username' => 'Adminlapor',
                'email' => 'admin@komin.com',
                'password' => Hash::make('Admin321'),
                'role' => 'admin',
                'total_poin' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 2. Seed Pengaduan
        DB::table('pengaduan')->insert([
            [
                'id_pengaduan' => 1,
                'tgl_kejadian' => '2026-06-01',
                'id_user' => 1,
                'judul_laporan' => 'Fasilitas Proyektor Rusak',
                'isi_laporan' => 'Proyektor di kelas XI RPL 2 mati total.',
                'status' => 'Proses',
                'poin_diberikan' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pengaduan' => 2,
                'tgl_kejadian' => '2026-06-02',
                'id_user' => 2,
                'judul_laporan' => '2 Kursi Lab Komputer 1 Patah',
                'isi_laporan' => 'Ada beberapa kursi patah di lab komputer 1.',
                'status' => 'Pending',
                'poin_diberikan' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pengaduan' => 3,
                'tgl_kejadian' => '2026-06-03',
                'id_user' => 1,
                'judul_laporan' => 'Kamar Mandi Kotor',
                'isi_laporan' => 'Kamar mandi lantai 2 dekat tangga baunya menyengat.',
                'status' => 'Pending',
                'poin_diberikan' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 3. Seed Log Status Pengaduan
        DB::table('log_status_pengaduan')->insert([
            [
                'id_log' => 1,
                'id_pengaduan' => 1,
                'id_admin' => 3,
                'status_lama' => 'Pending',
                'status_baru' => 'Proses',
                'tgl_perubahan' => '2026-06-06 11:19:41',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 4. Seed Log Aktivitas User
        DB::table('log_aktivitas_user')->insert([
            [
                'id_log_aktivitas' => 2,
                'id_user' => 1,
                'tipe_aktivitas' => 'Update Profil',
                'keterangan' => 'Profil diperbarui. Username lama: "adam_wicaksono", Username baru: "adam wicaksono"',
                'tgl_aktivitas' => '2026-06-06 11:08:21',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_log_aktivitas' => 3,
                'id_user' => 2,
                'tipe_aktivitas' => 'Revisi Laporan',
                'keterangan' => 'Siswa merevisi deskripsi laporan ID #2. Judul lama: "Kursi Lab Patah"',
                'tgl_aktivitas' => '2026-06-06 11:11:13',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 5. Seed Rewards
        DB::table('rewards')->insert([
            [
                'id' => 1,
                'nama_reward' => 'E-Wallet Rp 10.000',
                'tipe_reward' => 'E-Money',
                'biaya_poin' => 50,
                'stok' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nama_reward' => 'Merchandise Gantungan Kunci SMK',
                'tipe_reward' => 'Fisik',
                'biaya_poin' => 30,
                'stok' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 6. Seed Articles
        DB::table('articles')->insert([
            [
                'id' => 1,
                'title' => 'Pentingnya Menjaga Kebersihan Kelas demi Kenyamanan Belajar',
                'slug' => 'pentingnya-menjaga-kebersihan-kelas',
                'excerpt' => 'Kebersihan ruang kelas berdampak besar pada fokus dan semangat siswa selama KBM.',
                'content' => 'Ruang kelas yang bersih dan nyaman adalah salah satu faktor penting dalam proses kegiatan belajar mengajar (KBM). Siswa dapat berkonsentrasi dengan lebih baik dan terhindar dari berbagai penyakit. Mari kita bersama-sama menjaga kebersihan lingkungan SMK Bina Informatika mulai dari meja belajar kita masing-masing.',
                'featured_image' => 'images/blog/kebersihan-kelas.jpg',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'Tips Melaporkan Kerusakan Fasilitas Sekolah Lewat Platform Komin',
                'slug' => 'tips-melaporkan-kerusakan-fasilitas-sekolah',
                'excerpt' => 'Gunakan fitur Lapor di dashboard Komin secara tepat agar segera ditindaklanjuti admin.',
                'content' => 'Platform Komin mempermudah siswa melaporkan kerusakan sarana prasarana sekolah. Agar laporan Anda cepat diproses oleh tim sarpras, pastikan Anda menulis judul laporan secara ringkas dan menjelaskan deskripsi kerusakan secara detail, serta mencantumkan tanggal kejadian yang akurat.',
                'featured_image' => 'images/blog/lapor-fasilitas.jpg',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
