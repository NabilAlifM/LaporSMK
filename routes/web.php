<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\ArticleController;
use App\Models\Reward;
use App\Models\Pengaduan;
use App\Models\VoucherKlaim;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $user = auth()->user();
    
    $allReports = Pengaduan::with('user')->orderBy('id_pengaduan', 'desc')->get();
    
    return Inertia::render('Dashboard', [
        'reports' => $allReports,
        'totalPoints' => $user ? $user->total_poin : 0,
        'reportCount' => $user ? Pengaduan::where('id_user', $user->id_user)->count() : 0,
        'completedCount' => $user ? Pengaduan::where('id_user', $user->id_user)->where('status', 'Selesai')->count() : 0,
    ]);
})->name('dashboard');

Route::get('/dashboard', function () {
    return redirect()->route('dashboard');
});

Route::get('/blog/{slug}', [ArticleController::class, 'show'])->name('article.show');

Route::middleware(['auth', 'verified', 'approved'])->group(function () {
    Route::get('/lapor', function () {
        return Inertia::render('Lapor');
    })->name('student.lapor');

    Route::post('/lapor', [PengaduanController::class, 'store'])->name('student.lapor.store');
    Route::post('/tukar-poin', [RewardController::class, 'claim'])->name('reward.claim');

    Route::get('/riwayat', function () {
        $user = auth()->user();
        $pengaduan = $user 
            ? Pengaduan::where('id_user', $user->id_user)->orderBy('id_pengaduan', 'desc')->get() 
            : [];
            
        return Inertia::render('Riwayat', [
            'reports' => $pengaduan
        ]);
    })->name('student.riwayat');

    Route::get('/tukar', function () {
        $user = auth()->user();
        $rewards = Reward::all();
        $voucherKlaim = $user 
            ? VoucherKlaim::with('reward')->where('id_user', $user->id_user)->orderBy('id', 'desc')->get() 
            : [];

        return Inertia::render('Tukar', [
            'rewards' => $rewards,
            'claims' => $voucherKlaim
        ]);
    })->name('student.tukar');

    Route::get('/kuis', function () {
        $user = auth()->user();
        
        $hasParticipated = false;
        if ($user) {
            $hasParticipated = \App\Models\QuizAttempt::where('id_user', $user->id_user)
                ->where('created_at', '>=', now()->startOfWeek())
                ->exists();
        }

        $questions = \App\Models\QuizQuestion::where('is_active', true)->get();

        return Inertia::render('Kuis', [
            'questions' => $questions,
            'hasParticipatedThisWeek' => $hasParticipated
        ]);
    })->name('student.kuis');

    Route::post('/kuis/submit', function (Illuminate\Http\Request $request) {
        $request->validate(['score' => 'required|numeric']);
        $user = auth()->user();

        // Check if already participated
        $hasParticipated = \App\Models\QuizAttempt::where('id_user', $user->id_user)
            ->where('created_at', '>=', now()->startOfWeek())
            ->exists();
            
        if ($hasParticipated) {
            return back()->with('error', 'Kamu sudah mengikuti kuis minggu ini!');
        }

        \App\Models\QuizAttempt::create([
            'id_user' => $user->id_user,
            'score' => $request->score,
        ]);

        $user->xp += $request->score;
        $user->total_poin += $request->score;
        
        // Level up logic
        $maxExp = $user->level * 1000;
        while ($user->xp >= $maxExp) {
            $user->level++;
            $maxExp = $user->level * 1000;
        }
        $user->save();
        return back()->with('success', 'Kuis selesai! Kamu mendapatkan ' . $request->score . ' EXP/Poin. 🧠');
    })->name('student.kuis.submit');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
