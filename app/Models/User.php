<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements FilamentUser, HasName
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $primaryKey = 'id_user';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nis_nip',
        'nama_lengkap',
        'username',
        'email',
        'password',
        'role',
        'status',
        'total_poin',
        'xp',
        'level',
        'rpg_class',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Determine if the user can access the Filament admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get the user's name to display in the Filament admin panel.
     */
    public function getFilamentName(): string
    {
        return $this->nama_lengkap ?? $this->username ?? 'Admin';
    }

    /**
     * User's reports (pengaduan).
     */
    public function pengaduan(): HasMany
    {
        return $this->hasMany(Pengaduan::class, 'id_user', 'id_user');
    }

    /**
     * User's activity logs.
     */
    public function logAktivitas(): HasMany
    {
        return $this->hasMany(LogAktivitasUser::class, 'id_user', 'id_user');
    }

    /**
     * User's claimed vouchers.
     */
    public function voucherKlaim(): HasMany
    {
        return $this->hasMany(VoucherKlaim::class, 'id_user', 'id_user');
    }

    /**
     * User's completed quests.
     */
    public function quests()
    {
        return $this->belongsToMany(Quest::class, 'quest_user', 'user_id', 'quest_id')
                    ->withPivot('completed_at')
                    ->withTimestamps();
    }
}
