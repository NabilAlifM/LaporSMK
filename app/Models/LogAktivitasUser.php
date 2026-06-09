<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogAktivitasUser extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas_user';
    protected $primaryKey = 'id_log_aktivitas';

    protected $fillable = [
        'id_user',
        'tipe_aktivitas',
        'keterangan',
        'tgl_aktivitas',
    ];

    protected $casts = [
        'tgl_aktivitas' => 'datetime',
    ];

    /**
     * Get the user who performed the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }
}
