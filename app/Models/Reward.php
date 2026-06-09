<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reward extends Model
{
    use HasFactory;

    protected $table = 'rewards';

    protected $fillable = [
        'nama_reward',
        'tipe_reward',
        'biaya_poin',
        'stok',
    ];

    /**
     * Get the voucher claims for this reward.
     */
    public function voucherKlaim(): HasMany
    {
        return $this->hasMany(VoucherKlaim::class, 'id_reward', 'id');
    }
}
