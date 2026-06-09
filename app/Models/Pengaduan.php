<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengaduan extends Model
{
    use HasFactory;

    protected $table = 'pengaduan';
    protected $primaryKey = 'id_pengaduan';

    protected $fillable = [
        'tgl_kejadian',
        'id_user',
        'judul_laporan',
        'isi_laporan',
        'status',
        'poin_diberikan',
    ];

    protected static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if (auth()->check()) {
                \Illuminate\Support\Facades\DB::statement('SET @current_admin_id = ?', [auth()->id()]);
            }
        });
    }

    /**
     * Get the user who made the report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    /**
     * Get the status logs for this report.
     */
    public function logStatus(): HasMany
    {
        return $this->hasMany(LogStatusPengaduan::class, 'id_pengaduan', 'id_pengaduan');
    }
}
