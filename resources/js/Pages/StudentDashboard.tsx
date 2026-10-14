import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageProps } from '@/types';
import { TbHome, TbHistory, TbGift, TbPlus, TbReportAnalytics, TbTool, TbSpeakerphone, TbBrain } from 'react-icons/tb';
import { IoTime, IoWarningOutline, IoCheckmarkCircleOutline, IoWallet } from 'react-icons/io5';

interface Report {
    id_pengaduan: number;
    tgl_kejadian: string;
    id_user: number;
    judul_laporan: string;
    isi_laporan: string;
    status: 'Pending' | 'Proses' | 'Ditolak';
    poin_diberikan: number;
    created_at: string;
    user?: {
        nama_lengkap: string;
    };
}

interface Reward {
    id: number;
    nama_reward: string;
    tipe_reward: string;
    biaya_poin: number;
    stok: number;
}

interface Claim {
    id: number;
    id_user: number;
    id_reward: number;
    qr_code_token: string;
    status_voucher: 'Aktif' | 'Digunakan' | 'Expired';
    tgl_tukar: string;
    reward: Reward;
}

type StudentDashboardProps = PageProps<{
    reports: Report[];
    allReports: Report[];
    rewards: Reward[];
    claims: Claim[];
    flash: {
        success?: string;
        error?: string;
    };
    initialTab?: 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis';
}>;

const QUIZ_QUESTIONS = [
    { question: "Apa kepanjangan dari SMK?", options: ["Sekolah Menengah Kejuruan", "Sekolah Maju Karya", "Sekolah Mandiri Kuat", "Siswa Menengah Kejuruan"], answer: 0 },
    { question: "Ibukota negara Indonesia adalah?", options: ["Surabaya", "Bandung", "Jakarta (Nusantara)", "Medan"], answer: 2 },
    { question: "Berapa hasil dari 15 + 25?", options: ["30", "35", "40", "45"], answer: 2 },
    { question: "Siapakah penemu bola lampu pijar yang sukses dikomersialkan?", options: ["Albert Einstein", "Thomas Edison", "Nikola Tesla", "Isaac Newton"], answer: 1 },
    { question: "Apa warna bendera negara Indonesia?", options: ["Putih Merah", "Merah Putih", "Biru Putih", "Merah Hitam"], answer: 1 },
];

const SkeletonCard = () => (
    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-md"></div>
    </div>
);

export default function StudentDashboard() {
    const { 
        auth, 
        reports = [], 
        allReports = [], 
        rewards = [], 
        claims = [], 
        flash = {},
        initialTab = 'beranda' 
    } = usePage<StudentDashboardProps>().props;
    
    const [activeTab, setActiveTab] = useState<'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis'>(initialTab);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = auth?.user;

    // Quiz State
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const points = user ? user.total_poin : 0;
    let rank = 'Bronze Reporter';
    let nextRank = 'Silver Contributor';
    let pointsNeeded = 150 - points;
    let progressPercent = (points / 150) * 100;
    let IconLevel = '🥉';

    if (points >= 150 && points < 300) {
        rank = 'Silver Contributor';
        nextRank = 'Gold Guardian';
        pointsNeeded = 300 - points;
        progressPercent = ((points - 150) / 150) * 100;
        IconLevel = '🥈';
    } else if (points >= 300) {
        rank = 'Gold Guardian';
        nextRank = 'Max Level';
        pointsNeeded = 0;
        progressPercent = 100;
        IconLevel = '👑';
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_kejadian: new Date().toISOString().split('T')[0],
        judul_laporan: '',
        isi_laporan: '',
    });

    const handleLaporSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        post(route('pengaduan.store'), {
            onSuccess: () => {
                reset();
                setActiveTab('riwayat');
            },
        });
    };

    const handleRedeem = (rewardId: number) => {
        if (!user) return;
        if (confirm('Yakin mau tukar poin kamu untuk hadiah ini?')) {
            router.post(route('reward.claim'), { id_reward: rewardId });
        }
    };

    const handleQuizAnswer = (selectedIndex: number) => {
        if (selectedIndex === QUIZ_QUESTIONS[currentQ].answer) {
            setScore(score + 20); // 20 pts per correct answer = max 100
        }
        
        if (currentQ < QUIZ_QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setScore(0);
        setQuizCompleted(false);
    };

    const hasPending = reports.some(r => r.status === 'Pending');

    return (
        <AuthenticatedLayout activeTab={initialTab}>
            <Head title="Komin - Lapor Sarpras Sekolah" />

            <div className="max-w-md md:max-w-7xl mx-auto md:px-6 lg:px-8 bg-gray-50/50 md:bg-transparent min-h-screen pb-24 md:pb-12 relative shadow-sm md:shadow-none">
                <div className="px-5 py-6 md:py-8 md:px-0">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl shadow-sm text-sm flex items-center gap-2">
                            <IoCheckmarkCircleOutline size={20} />
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm text-sm flex items-center gap-2">
                            <IoWarningOutline size={20} />
                            {flash.error}
                        </div>
                    )}

                    {/* Content Area */}
                    <AnimatePresence mode="wait">

                        {activeTab === 'riwayat' && (
                            <motion.div
                                key="riwayat"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4 md:space-y-6"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Riwayat Laporan Kamu</h3>

                                {user ? (
                                    isLoading ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <SkeletonCard /><SkeletonCard /><SkeletonCard />
                                        </div>
                                    ) : reports.length === 0 ? (
                                        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-400">
                                                <TbHistory size={48} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada laporan</h3>
                                            <p className="text-sm text-gray-500 max-w-sm mx-auto">Mulai lapor kerusakan fasilitas sekolah di sekitarmu dan kumpulkan poinnya!</p>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                            {reports.map((report) => (
                                                <div
                                                    key={report.id_pengaduan}
                                                    onClick={() => setSelectedReport(report)}
                                                    className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer hover:border-[#00880A] transition hover:shadow-md"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#4BB8FA] flex-shrink-0 flex items-center justify-center">
                                                            <TbTool size={24} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Laporan Sarpras</div>
                                                            <div className="text-[15px] font-bold text-gray-800 truncate">{report.judul_laporan}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <IoTime size={14} /> {report.tgl_kejadian}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1 pt-4 border-t border-gray-50">
                                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                                                            report.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                                                            report.status === 'Proses' ? 'bg-sky-50 text-[#4BB8FA]' :
                                                            'bg-red-50 text-red-600'
                                                        }`}>
                                                            {report.status}
                                                        </span>
                                                        <span className="text-xs font-bold text-[#00880A] bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                                            {report.poin_diberikan > 0 ? `+${report.poin_diberikan} pts` : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <div className="max-w-xl mx-auto text-center bg-white p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                            <IoWarningOutline size={48} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Yuk, login dulu!</h3>
                                        <p className="text-sm text-gray-500 mt-3 mb-8">
                                            Masuk untuk melihat semua riwayat laporan yang sudah kamu buat dan tracking progresnya.
                                        </p>
                                        <Link href={route('login')} className="inline-block px-10 py-3.5 bg-[#00880A] text-white font-bold rounded-full text-sm shadow-md shadow-green-600/20">
                                            Masuk Akun
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'tukar' && (
                            <motion.div
                                key="tukar"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between max-w-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-green-50 text-[#00880A] rounded-full flex items-center justify-center border border-green-100">
                                            <IoWallet size={28} />
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Saldo Poin Kamu</div>
                                            <div className="text-3xl font-extrabold text-gray-800">{user ? user.total_poin : 0} <span className="text-sm font-bold text-gray-500">PTS</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tukar Voucher Hadiah</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                        {rewards.map((reward) => {
                                            const canClaim = user && user.total_poin >= reward.biaya_poin;

                                            return (
                                                <div key={reward.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden transition hover:shadow-md">
                                                    {reward.stok <= 0 && (
                                                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center">
                                                            <div className="bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Stok Habis</div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="w-12 h-12 bg-blue-50 text-[#4BB8FA] rounded-full flex items-center justify-center mb-4">
                                                            <TbGift size={24} />
                                                        </div>
                                                        <h4 className="text-sm md:text-base font-bold text-gray-800 leading-snug mb-1.5">{reward.nama_reward}</h4>
                                                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">Sisa {reward.stok}</span>
                                                    </div>
                                                    <div className="mt-6 pt-4 border-t border-gray-50">
                                                        <div className="text-sm font-extrabold text-[#00880A] mb-3">{reward.biaya_poin} pts</div>
                                                        {user ? (
                                                            <button
                                                                onClick={() => handleRedeem(reward.id)}
                                                                disabled={!canClaim || reward.stok <= 0}
                                                                className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition ${
                                                                    canClaim && reward.stok > 0
                                                                        ? 'bg-green-50 text-[#00880A] hover:bg-[#00880A] hover:text-white border border-green-200 hover:border-[#00880A]'
                                                                        : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                Tukar
                                                            </button>
                                                        ) : (
                                                            <Link href={route('login')} className="block w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-center rounded-xl text-xs font-bold transition">Login</Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {claims.length > 0 && (
                                    <div className="pt-4">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Voucher Kamu</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {claims.map((claim) => (
                                                <div key={claim.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-800">{claim.reward?.nama_reward || 'Reward'}</div>
                                                        <div className="text-xs text-gray-500 mt-1 mb-3">Tgl: {new Date(claim.tgl_tukar).toLocaleDateString()}</div>
                                                        <div className="text-xs font-mono font-bold bg-green-50 text-[#00880A] px-3 py-1.5 rounded-lg border border-green-200 inline-block shadow-sm">
                                                            {claim.qr_code_token}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-extrabold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md uppercase tracking-wider">
                                                        {claim.status_voucher}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'kuis' && (
                            <motion.div
                                key="kuis"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-xl mx-auto"
                            >
                                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
                                    <div className="w-20 h-20 bg-blue-50 text-[#4BB8FA] rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                                        <TbBrain size={40} />
                                    </div>
                                    
                                    {!quizCompleted ? (
                                        <>
                                            <div className="mb-6 flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl">
                                                <span className="text-xs font-bold text-gray-500">Pertanyaan {currentQ + 1} dari {QUIZ_QUESTIONS.length}</span>
                                                <span className="text-xs font-bold text-[#00880A]">Skor Sementara: {score}</span>
                                            </div>
                                            
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-snug">
                                                {QUIZ_QUESTIONS[currentQ].question}
                                            </h3>
                                            
                                            <div className="grid gap-3">
                                                {QUIZ_QUESTIONS[currentQ].options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleQuizAnswer(idx)}
                                                        className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#4BB8FA] hover:bg-blue-50 text-sm md:text-base font-semibold text-gray-700 transition duration-200"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="text-5xl mb-4">{score === 100 ? '🎉' : score >= 60 ? '👍' : '😅'}</div>
                                            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Kuis Selesai!</h3>
                                            <p className="text-gray-500 mb-6">Kamu berhasil menyelesaikan kuis interaktif ini.</p>
                                            
                                            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl mb-8">
                                                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Skor</div>
                                                <div className="text-5xl font-extrabold text-[#00880A]">{score}</div>
                                            </div>

                                            <button
                                                onClick={resetQuiz}
                                                className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-bold transition duration-200"
                                            >
                                                Mulai Ulang Kuis
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Sticky Bottom Navigation (Hidden on md) */}


            {/* Modal Detail Laporan */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-md md:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pb-safe"
                        >
                            <div className="flex justify-center pt-3 pb-2 sm:hidden">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Detail Laporan</h3>
                                    <button onClick={() => setSelectedReport(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[11px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Judul Laporan</div>
                                        <div className="text-base font-bold text-gray-800 leading-snug">
                                            {selectedReport.judul_laporan}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Deskripsi</div>
                                        <div className="text-[14px] text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line leading-relaxed">
                                            {selectedReport.isi_laporan}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                        <div>
                                            <div className="text-[11px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Tanggal Kejadian</div>
                                            <div className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
                                                <IoTime size={16} className="text-gray-400" />
                                                {selectedReport.tgl_kejadian}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Status</div>
                                            <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-md mt-0.5 ${
                                                selectedReport.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                                                selectedReport.status === 'Proses' ? 'bg-sky-50 text-[#4BB8FA]' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {selectedReport.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
