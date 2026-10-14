import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import { div } from 'framer-motion/client';

interface Report {
    id_pengaduan: number;
    judul_laporan: string;
    status: 'Pending' | 'Proses' | 'Ditolak' | 'Selesai';
    created_at: string;
    is_public?: boolean;
    poin_diberikan: number;
    lokasi?: string;
    user?: {
        nama_lengkap: string;
    };
}

interface DashboardProps extends PageProps {
    reports: Report[];
    totalPoints: number;
    reportCount: number;
    completedCount: number;
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: 'timer', bg: 'bg-secondary', text: 'text-on-secondary' },
    proses: { label: 'Dalam Proses', icon: 'sync', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    selesai: { label: 'Selesai', icon: 'check_circle', bg: 'bg-primary-container', text: 'text-on-primary-container' },
    ditolak: { label: 'Ditolak', icon: 'cancel', bg: 'bg-error-container', text: 'text-on-error-container' },
};

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let startTs: number | null = null;
        let rafId: number;

        const animate = (ts: number) => {
            if (!startTs) startTs = ts;
            const elapsed = ts - startTs;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(ease * value));
            if (progress < 1) {
                rafId = requestAnimationFrame(animate);
            }
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [value, duration]);

    return <>{display}</>;
}

export default function Dashboard({ auth, reports, totalPoints, reportCount, completedCount }: DashboardProps) {
    const user = auth?.user as any;
    const pts = totalPoints ?? user?.total_poin ?? 0;
    const level = user?.level || 1;
    const xp = user?.xp || 0;
    const maxExp = level * 1000;
    const progressPercent = Math.min((xp / maxExp) * 100, 100);

    const [selectedQuest, setSelectedQuest] = useState<Report | null>(null);

    // Auto-refresh live feed every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // @ts-ignore
            if (window.Inertia) window.Inertia.reload({ only: ['reports'], preserveState: true, preserveScroll: true });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const recentReports = reports?.slice(0, 4) ?? [];

    const maskName = (name?: string) => {
        if (!name) return 'Siswa Anonim';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts[0] + ' ' + parts[1][0] + '***';
        }
        return name.slice(0, 3) + '***';
    };

    return (
        <>
            <Head title="Beranda" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter mt-6">
                {/* Left Column: Hero & Quests */}
                <div className="xl:col-span-2 flex flex-col gap-gutter">

                    {/* 1. Hero Section (Character Status) */}
                    <section className="bg-surface-container-lowest p-6 lg:p-8 neo-border neo-shadow-lg relative overflow-hidden flex flex-col gap-6">
                        {/* Decorative Background Element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full border-4 border-primary blur-md pointer-events-none"></div>

                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                            <div className="w-24 h-24 neo-border neo-shadow bg-primary text-on-primary flex items-center justify-center text-5xl">
                                🦸
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <h2 className="font-display-lg text-headline-lg-mobile lg:text-display-lg uppercase tracking-tight leading-none text-on-background">
                                    {user ? user.nama_lengkap : 'Tamu'}
                                </h2>
                                <div className="flex gap-3 items-center">
                                    <span className="bg-secondary text-on-secondary font-label-mono text-label-mono px-3 py-1 neo-border shadow-[2px_2px_0px_0px_#171d16]">
                                        {user?.role === 'siswa' ? 'Siswa' : 'Admin'}
                                    </span>
                                    <span className="font-label-mono text-label-mono text-on-surface bg-surface-container px-3 py-1 neo-border shadow-[2px_2px_0px_0px_#171d16] flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                                        Rank: {level >= 10 ? 'A' : level >= 5 ? 'B' : 'C'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* EXP Progress */}
                        <div className="flex flex-col gap-2 relative z-10 mt-2">
                            <div className="flex justify-between items-end font-label-mono text-label-mono text-on-surface uppercase">
                                <span>Level {level}</span>
                                <span className="font-bold">{xp} / {maxExp} EXP</span>
                            </div>
                            <div className="w-full h-8 bg-surface-container-high neo-border relative overflow-hidden">
                                {/* Striped pattern background for empty state */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #171d16 10px, #171d16 20px)' }}></div>
                                {/* Animated Fill */}
                                <div
                                    className="h-full bg-primary neo-border border-t-0 border-b-0 border-l-0 relative z-10 flex items-center justify-end pr-2 overflow-hidden transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px)' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 relative z-10">
                            {/* Stat 1 */}
                            <div className="bg-surface p-4 neo-border neo-shadow-sm flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#171d16] transition-transform duration-200 cursor-default">
                                <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-mono text-[12px] text-on-surface-variant uppercase tracking-wider">Total Poin</span>
                                    <span className="font-headline-md text-headline-md text-on-background"><AnimatedNumber value={pts} /></span>
                                </div>
                            </div>
                            {/* Stat 2 */}
                            <div className="bg-surface p-4 neo-border neo-shadow-sm flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#171d16] transition-transform duration-200 cursor-default">
                                <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-mono text-[12px] text-on-surface-variant uppercase tracking-wider">Laporan Selesai</span>
                                    <span className="font-headline-md text-headline-md text-on-background"><AnimatedNumber value={completedCount ?? 0} /></span>
                                </div>
                            </div>
                            {/* Stat 3 */}
                            <div className="bg-surface p-4 neo-border neo-shadow-sm flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#171d16] transition-transform duration-200 cursor-default">
                                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-mono text-[12px] text-on-surface-variant uppercase tracking-wider">Total Laporan</span>
                                    <span className="font-headline-md text-headline-md text-on-background"><AnimatedNumber value={reportCount ?? reports?.length ?? 0} /></span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Active Quests (Laporan) */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline-lg text-headline-lg uppercase text-on-background flex items-center gap-3">
                                <span className="material-symbols-outlined bg-on-background text-surface p-1 neo-border" style={{ fontVariationSettings: "'FILL' 1" }}>feed</span>
                                Live Feed Laporan
                            </h3>
                            <Link href={route('student.riwayat')} className="font-button-text text-button-text text-primary hover:underline uppercase text-sm">Semua Laporan</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentReports.length > 0 ? recentReports.map((report) => {
                                const stKey = (report.status || 'pending').toLowerCase() as keyof typeof STATUS_CONFIG;
                                const st = STATUS_CONFIG[stKey] || STATUS_CONFIG.pending;
                                const dateStr = new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                                return (
                                    <div
                                        key={report.id_pengaduan}
                                        onClick={() => setSelectedQuest(report)}
                                        className="bg-surface-container-lowest p-5 neo-border neo-shadow flex flex-col gap-4 group neo-hover transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-2 ${stKey === 'selesai' ? 'bg-primary' : 'bg-secondary'} border-b-2 border-on-background`}></div>
                                        <div className="flex justify-between items-start mt-2">
                                            <div className={`${st.bg} ${st.text} font-label-mono text-[10px] px-2 py-1 neo-border shadow-[2px_2px_0px_0px_#171d16] uppercase tracking-wider flex items-center gap-1`}>
                                                {stKey === 'proses' && <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>}
                                                {stKey === 'selesai' && <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{st.icon}</span>}
                                                {st.label}
                                            </div>
                                            <span className="font-label-mono text-xs text-on-surface-variant flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span> {dateStr}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className={`font-headline-md text-headline-md-mobile text-on-background mb-1 group-hover:${stKey === 'selesai' ? 'text-primary' : 'text-secondary'} transition-colors line-clamp-1`}>
                                                {report.judul_laporan}
                                            </h4>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                                    {report.lokasi || 'Fasilitas Sekolah'}
                                                </p>
                                                <p className="font-label-mono text-label-mono text-on-surface-variant/80 flex items-center gap-2 mt-1">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                                                    Pelapor: {maskName(report.user?.nama_lengkap)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-4 border-t-2 border-on-surface/10 flex justify-between items-center">
                                            {stKey === 'selesai' ? (
                                                <>
                                                    <span className="font-label-mono text-sm text-on-surface flex items-center gap-1 opacity-50 line-through">
                                                        Reward: +{report.poin_diberikan > 0 ? report.poin_diberikan : 150} EXP
                                                    </span>
                                                    <span className="font-label-mono text-xs text-primary font-bold bg-primary/10 px-2 py-1 neo-border border-primary">CLAIMED</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-label-mono text-sm text-on-surface flex items-center gap-1">
                                                        Reward: <span className="text-primary font-bold">+{report.poin_diberikan > 0 ? report.poin_diberikan : 150} EXP</span>
                                                    </span>
                                                    <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="col-span-1 md:col-span-2 bg-surface p-8 neo-border flex items-center justify-center flex-col gap-2 text-on-surface-variant text-center">
                                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>inbox</span>
                                    <p className="font-body-lg">Belum ada Quest Laporan yang berjalan.</p>
                                    <Link href={route('student.lapor')} className="text-primary font-button-text hover:underline mt-2">Mulai Lapor Sekarang!</Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Activity Sidebar (Visible to all) */}
                <div className="xl:col-span-1">
                    <section className="bg-surface-container-lowest p-5 lg:p-6 neo-border neo-shadow h-full flex flex-col gap-6">
                        <h3 className="font-headline-lg text-headline-lg-mobile uppercase text-on-background border-b-4 border-on-background pb-3 flex items-center gap-3">
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                            Log Aktivitas
                        </h3>

                        {/* Activity List */}
                        <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                            {!user ? (
                                <div className="flex gap-4 items-start relative group">
                                    <div className="absolute left-4 top-10 bottom-[-16px] w-[2px] bg-on-surface-variant/30 group-last:hidden"></div>
                                    <div className="w-8 h-8 rounded-none bg-primary text-on-primary flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] shrink-0 relative z-10">
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                                    </div>
                                    <div className="flex flex-col gap-2 pb-4 w-full">
                                        <p className="font-body-md text-on-background leading-tight">Ikuti Keseruannya!</p>
                                        <span className="font-label-mono text-[11px] text-primary uppercase font-bold bg-primary/10 self-start px-1 border border-primary">
                                            + HADIAH EXP
                                        </span>
                                        <Link href={route('login')} className="mt-2 bg-primary text-on-primary font-button-text text-[12px] p-2 neo-border neo-hover neo-active transition-all uppercase tracking-wider flex justify-center items-center gap-1 w-fit">
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                                            Masuk / Login
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Example Static Logs for RPG Vibe */}
                                    <div className="flex gap-4 items-start relative group">
                            <div className="absolute left-4 top-10 bottom-[-16px] w-[2px] bg-on-surface-variant/30 group-last:hidden"></div>
                            <div className="w-8 h-8 rounded-none bg-primary text-on-primary flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] shrink-0 relative z-10">
                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                            </div>
                            <div className="flex flex-col gap-1 pb-4">
                                <p className="font-body-md text-body-md text-on-background leading-tight">
                                    Selamat datang di <span className="font-bold">SMK Quest</span>
                                </p>
                                <span className="font-label-mono text-[11px] text-primary uppercase font-bold bg-primary/10 self-start px-1 border border-primary">+50 EXP</span>
                                <span className="font-label-mono text-xs text-on-surface-variant mt-1">Sistem</span>
                            </div>
                        </div>
                                </>
                            )}

                        {reports?.slice(0, 3).map((r, i) => (
                            <div key={i} className="flex gap-4 items-start relative group">
                                <div className="absolute left-4 top-10 bottom-[-16px] w-[2px] bg-on-surface-variant/30 group-last:hidden"></div>
                                <div className={`w-8 h-8 rounded-none flex items-center justify-center neo-border shadow-[2px_2px_0px_0px_#171d16] shrink-0 relative z-10 ${r.status === 'Selesai' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-background'}`}>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{r.status === 'Selesai' ? 'verified' : 'flag'}</span>
                                </div>
                                <div className="flex flex-col gap-1 pb-4">
                                    <p className="font-body-md text-body-md text-on-background leading-tight">
                                        {r.status === 'Selesai' ? 'Laporan diselesaikan:' : 'Quest Dimulai:'} <span className="font-bold">"{r.judul_laporan}"</span>
                                    </p>
                                    {r.status === 'Selesai' && <span className="font-label-mono text-[11px] text-primary uppercase font-bold bg-primary/10 self-start px-1 border border-primary">+{r.poin_diberikan > 0 ? r.poin_diberikan : 150} EXP</span>}
                                    <span className="font-label-mono text-xs text-on-surface-variant mt-1">{new Date(r.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                        ))}
                </div>

                {user && (
                    <Link href={route('student.riwayat')} className="w-full mt-auto bg-surface text-on-surface font-button-text text-button-text p-3 neo-border neo-shadow-sm neo-hover transition-all uppercase tracking-wider text-sm flex justify-center items-center gap-2 text-center">
                        Muat Lebih Banyak
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>expand_more</span>
                    </Link>
                )}
            </section>
        </div >
            </div >

        {/* Live Tracking Modal */ }
    {
        selectedQuest && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedQuest(null)}>
                <div
                    className="bg-surface-container-lowest border-4 border-on-background shadow-[12px_12px_0_0_#111827] max-w-2xl w-full p-8 relative rounded-none flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center border-b-4 border-on-background pb-4">
                        <h2 className="font-headline-lg text-primary uppercase">LIVE TRACKING</h2>
                        <button onClick={() => setSelectedQuest(null)} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-headline-md text-on-background">{selectedQuest.judul_laporan}</h3>
                        <p className="font-label-mono text-label-mono text-on-surface-variant/80 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                            Pelapor: {maskName(selectedQuest.user?.nama_lengkap)}
                        </p>

                        <div className="flex flex-col gap-0 mt-4 border-2 border-on-background bg-surface p-6 shadow-[4px_4px_0_0_#111827]">
                            <h4 className="font-headline-md text-on-background uppercase mb-6 border-b-2 border-on-background pb-2">Status Penanganan</h4>
                            {[
                                { title: 'Laporan Diterima', desc: 'Sistem telah mencatat laporan.', active: true, isError: false },
                                { title: 'Menunggu Validasi', desc: 'Tim Sarpras sedang meninjau laporan.', active: selectedQuest.status === 'Pending' || selectedQuest.status === 'Proses' || selectedQuest.status === 'Selesai' || selectedQuest.status === 'Ditolak', isError: false },
                                { title: selectedQuest.status === 'Ditolak' ? 'Laporan Ditolak' : 'Sedang Diproses', desc: selectedQuest.status === 'Ditolak' ? 'Laporan ditolak.' : 'Teknisi sedang melakukan perbaikan.', active: selectedQuest.status === 'Proses' || selectedQuest.status === 'Selesai' || selectedQuest.status === 'Ditolak', isError: selectedQuest.status === 'Ditolak' },
                                { title: 'Selesai', desc: 'Perbaikan telah selesai dilakukan.', active: selectedQuest.status === 'Selesai', isError: false }
                            ].map((step, idx, arr) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx < arr.length - 1 && (
                                        <div className={`absolute left-3 top-8 bottom-[-16px] w-[2px] ${arr[idx + 1].active ? (arr[idx + 1].isError ? 'bg-error' : 'bg-primary') : 'bg-on-surface-variant/30'}`}></div>
                                    )}
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center neo-border mt-1 shrink-0 relative z-10 ${step.active ? (step.isError ? 'bg-error text-on-error' : 'bg-primary text-on-primary') : 'bg-surface-variant'}`}>
                                        {step.active && <span className="w-2 h-2 rounded-full bg-current"></span>}
                                    </div>
                                    <div className={`flex flex-col pb-8 ${!step.active && 'opacity-50'}`}>
                                        <span className={`font-label-mono font-bold uppercase text-sm ${step.active ? (step.isError ? 'text-error' : 'text-primary') : 'text-on-surface-variant'}`}>{step.title}</span>
                                        <span className="font-body-md text-on-surface-variant">{step.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
        </>
    );
}

Dashboard.layout = (page: any) => <AuthenticatedLayout activeTab="beranda">{page}</AuthenticatedLayout>;