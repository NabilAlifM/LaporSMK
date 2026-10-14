<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PengaduanController extends Controller
{
    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'judul' => 'required|string|max:150',
            'deskripsi' => 'required|string',
        ]);

        Pengaduan::create([
            'tgl_kejadian' => $request->tanggal,
            'id_user' => Auth::id(),
            'judul_laporan' => $request->judul,
            'isi_laporan' => $request->deskripsi,
            'status' => 'Pending',
            'poin_diberikan' => 0, // Admin sets this when processing
        ]);

        $user = Auth::user();
        if ($user) {
            $user->xp += 50;
            // Level up every 1000 XP
            $newLevel = floor($user->xp / 1000) + 1;
            if ($newLevel > $user->level) {
                $user->level = $newLevel;
            }
            $user->save();
        }

        return redirect()->route('student.lapor')->with('success', 'Laporan berhasil dikirim! (+50 XP) 🚀');
    }
}
