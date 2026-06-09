<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Trigger for pengaduan status changes (audit log + point addition on 'Proses')
        DB::unprepared("
            CREATE TRIGGER `trg_update_status_pengaduan` AFTER UPDATE ON `pengaduan` FOR EACH ROW BEGIN
                IF OLD.status <> NEW.status THEN
                    INSERT INTO log_status_pengaduan (id_pengaduan, id_admin, status_lama, status_baru, tgl_perubahan, created_at, updated_at)
                    VALUES (OLD.id_pengaduan, @current_admin_id, OLD.status, NEW.status, NOW(), NOW(), NOW());
                    
                    -- Points distribution
                    IF NEW.status = 'Proses' THEN
                        UPDATE users SET total_poin = total_poin + NEW.poin_diberikan WHERE id_user = NEW.id_user;
                    ELSEIF OLD.status = 'Proses' THEN
                        UPDATE users SET total_poin = total_poin - OLD.poin_diberikan WHERE id_user = OLD.id_user;
                    END IF;
                END IF;
            END
        ");

        // 2. Trigger for user update pengaduan description
        DB::unprepared("
            CREATE TRIGGER `trg_user_update_laporan` AFTER UPDATE ON `pengaduan` FOR EACH ROW BEGIN
                IF OLD.judul_laporan <> NEW.judul_laporan OR OLD.isi_laporan <> NEW.isi_laporan THEN
                    INSERT INTO log_aktivitas_user (id_user, tipe_aktivitas, keterangan, tgl_aktivitas, created_at, updated_at)
                    VALUES (
                        OLD.id_user, 
                        'Revisi Laporan', 
                        CONCAT('Siswa merevisi deskripsi laporan ID #', OLD.id_pengaduan, '. Judul lama: \"', OLD.judul_laporan, '\"'), 
                        NOW(),
                        NOW(),
                        NOW()
                    );
                END IF;
            END
        ");

        // 3. Trigger for user profile update
        DB::unprepared("
            CREATE TRIGGER `trg_user_update_profil` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
                IF OLD.nama_lengkap <> NEW.nama_lengkap OR OLD.username <> NEW.username THEN
                    INSERT INTO log_aktivitas_user (id_user, tipe_aktivitas, keterangan, tgl_aktivitas, created_at, updated_at)
                    VALUES (
                        OLD.id_user, 
                        'Update Profil', 
                        CONCAT('Profil diperbarui. Username lama: \"', OLD.username, '\", Username baru: \"', NEW.username, '\"'), 
                        NOW(),
                        NOW(),
                        NOW()
                    );
                END IF;
            END
        ");

        // 4. Trigger for voucher claim point deduction and stock decrement
        DB::unprepared("
            CREATE TRIGGER `trg_voucher_claim_deduct_points` AFTER INSERT ON `voucher_klaim` FOR EACH ROW BEGIN
                DECLARE v_biaya_poin INT;
                SELECT biaya_poin INTO v_biaya_poin FROM rewards WHERE id = NEW.id_reward;
                UPDATE users SET total_poin = total_poin - v_biaya_poin WHERE id_user = NEW.id_user;
                UPDATE rewards SET stok = stok - 1 WHERE id = NEW.id_reward;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP TRIGGER IF EXISTS `trg_update_status_pengaduan`");
        DB::unprepared("DROP TRIGGER IF EXISTS `trg_user_update_laporan`");
        DB::unprepared("DROP TRIGGER IF EXISTS `trg_user_update_profil`");
        DB::unprepared("DROP TRIGGER IF EXISTS `trg_voucher_claim_deduct_points`");
    }
};
