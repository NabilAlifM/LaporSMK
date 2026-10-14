<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherKlaim extends Model
{
    use HasFactory;

    protected $table = 'voucher_klaim';

    protected $fillable = [
        'id_user',
        'id_reward',
        'qr_code_token',
        'status_voucher',
        'tgl_tukar',
        'tgl_expired',
    ];

    protected $casts = [
        'tgl_tukar' => 'datetime',
        'tgl_expired' => 'datetime',
    ];

    /**
     * Get the user who claimed this voucher.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    /**
     * Get the reward associated with this voucher.
     */
    public function reward(): BelongsTo
    {
        return $this->belongsTo(Reward::class, 'id_reward', 'id');
    }
}
