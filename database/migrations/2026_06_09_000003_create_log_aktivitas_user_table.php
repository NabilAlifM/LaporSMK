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
        Schema::create('log_aktivitas_user', function (Blueprint $table) {
            $table->id('id_log_aktivitas');
            $table->unsignedBigInteger('id_user');
            $table->string('tipe_aktivitas', 100)->nullable();
            $table->text('keterangan')->nullable();
            $table->dateTime('tgl_aktivitas');
            $table->timestamps();

            $table->foreign('id_user')
                ->references('id_user')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas_user');
    }
};
