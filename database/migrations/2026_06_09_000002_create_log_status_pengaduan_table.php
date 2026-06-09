<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('log_status_pengaduan', function (Blueprint $table) {
            $table->id('id_log');
            $table->unsignedBigInteger('id_pengaduan');
            $table->unsignedBigInteger('id_admin')->nullable();
            $table->string('status_lama', 50)->nullable();
            $table->string('status_baru', 50)->nullable();
            $table->dateTime('tgl_perubahan');
            $table->timestamps();

            $table->foreign('id_pengaduan')
                ->references('id_pengaduan')
                ->on('pengaduan')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_admin')
                ->references('id_user')
                ->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_status_pengaduan');
    }
};
