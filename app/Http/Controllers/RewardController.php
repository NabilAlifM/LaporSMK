<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\VoucherKlaim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RewardController extends Controller
{
    /**
     * Claim a reward and generate a voucher.
     */
    public function claim(Request $request)
    {
        $request->validate([
            'id_reward' => 'required|exists:rewards,id',
        ]);

        $reward = Reward::findOrFail($request->id_reward);
        $user = Auth::user();

        // 1. Check stock
        if ($reward->stok <= 0) {
            return redirect()->route('dashboard')->with('error', 'Maaf, stok reward ini sudah habis! 😢');
        }

        // 2. Check points
        if ($user->total_poin < $reward->biaya_poin) {
            return redirect()->route('dashboard')->with('error', 'Maaf, poin Anda tidak mencukupi untuk menukar reward ini! 🏆');
        }

        // 3. Create claim voucher (Trigger will deduct points and decrement stock!)
        VoucherKlaim::create([
            'id_user' => $user->id_user,
            'id_reward' => $reward->id,
            'qr_code_token' => 'KOMIN-' . strtoupper(Str::random(10)),
            'status_voucher' => 'Aktif',
            'tgl_tukar' => now(),
            'tgl_expired' => now()->addDays(7),
        ]);

        return redirect()->route('dashboard')->with('success', 'Voucher berhasil diklaim! Silakan tunjukkan kode voucher di koperasi/kantor. 🎉');
    }
}
