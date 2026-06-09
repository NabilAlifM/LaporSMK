<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogStatusPengaduan extends Model
{
    use HasFactory;

    protected $table = 'log_status_pengaduan';
    protected $primaryKey = 'id_log';

    protected $fillable = [
        'id_pengaduan',
        'id_admin',
        'status_lama',
        'status_baru',
        'tgl_perubahan',
    ];

    protected $casts = [
        'tgl_perubahan' => 'datetime',
    ];

    /**
     * Get the report associated with this log.
     */
    public function pengaduan(): BelongsTo
    {
        return $this->belongsTo(Pengaduan::class, 'id_pengaduan', 'id_pengaduan');
    }

    /**
     * Get the admin who changed the status.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_user');
    }
}
