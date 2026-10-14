import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface Report {
    id_pengaduan: number;
    judul_laporan: string;
    isi_laporan: string;
    status: 'Pending' | 'Proses' | 'Ditolak' | 'Selesai';
    created_at: string;
    poin_diberikan: number;
    lokasi?: string;
    kategori?: string;
    tanggapan?: string;
}

interface RiwayatProps extends PageProps {
    reports: Report[];
}

export default function Riwayat({ auth, reports }: RiwayatProps) {
    const user = auth?.user as any;
    const level = user?.level || 1;
    const xp = user?.xp || 0;
    const maxExp = level * 1000;

    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [kategoriFilter, setKategoriFilter] = useState('Semua Kategori');
    const [selectedQuest, setSelectedQuest] = useState<Report | null>(null);

    const filteredReports = reports?.filter(r => {
        if (statusFilter !== 'Semua Status' && r.status !== statusFilter && !(statusFilter === 'Diproses' && r.status === 'Proses')) return false;
        if (kategoriFilter !== 'Semua Kategori' && r.kategori && r.kategori !== kategoriFilter) return false;
        return true;
    }) || [];

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Selesai': return 'bg-primary-fixed text-on-surface';
            case 'Ditolak': return 'bg-error text-on-error';
            case 'Proses': return 'bg-secondary text-on-secondary';
            default: return 'bg-surface-variant text-on-surface-variant';
        }
    };

    const getStatusIcon = (kategori: string | undefined) => {
        switch(kategori?.toLowerCase()) {
            case 'elektronik': return 'devices';
            case 'kebersihan': return 'cleaning_services';
            case 'keamanan': return 'security';
            default: return 'build';
        }
    };

    const renderTimeline = (status: string, tanggapan?: string) => {
        const isPending = status === 'Pending';
        const isProses = status === 'Proses';
        const isSelesai = status === 'Selesai';
        const isDitolak = status === 'Ditolak';

        const steps = [
            { title: 'Laporan Diterima', desc: 'Sistem telah mencatat laporan Anda.', active: true, isError: false },
            { title: 'Menunggu Validasi', desc: 'Tim Sarpras sedang meninjau laporan.', active: isPending || isProses || isSelesai || isDitolak, isError: false },
            { title: isDitolak ? 'Laporan Ditolak' : 'Sedang Diproses', desc: isDitolak ? (tanggapan || 'Laporan tidak valid.') : 'Teknisi sedang melakukan perbaikan.', active: isProses || isSelesai || isDitolak, isError: isDitolak },
            { title: 'Selesai', desc: 'Perbaikan telah selesai dilakukan.', active: isSelesai, isError: false }
        ];

        return (
            <div className="flex flex-col gap-0 mt-4 border-2 border-on-background bg-surface p-6 shadow-[4px_4px_0_0_#111827]">
                <h4 className="font-headline-md text-on-background uppercase mb-6 border-b-2 border-on-background pb-2">Status Penanganan</h4>
                {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                        {idx < steps.length - 1 && (
                            <div className={`absolute left-3 top-8 bottom-[-16px] w-[2px] ${steps[idx+1].active ? (steps[idx+1].isError ? 'bg-error' : 'bg-primary') : 'bg-on-surface-variant/30'}`}></div>
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
        );
    };

    return (
        <>
            <Head title="Riwayat Laporan" />

            <div className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-8 min-h-screen">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-on-background pb-4">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Log Petualangan</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Daftar quest yang telah kamu jalankan dan status penyelesaiannya.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-surface-container border-2 border-on-background p-2 shadow-[2px_2px_0px_0px_#111827]">
                        <div className="flex flex-col items-end">
                            <span className="font-label-mono text-label-mono text-on-surface-variant">LVL {level}</span>
                            <span className="font-button-text text-button-text text-on-surface">{xp}/{maxExp} EXP</span>
                        </div>
                        <div className="w-10 h-10 bg-primary border-2 border-on-background flex items-center justify-center text-on-primary">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <section className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest border-2 border-on-background p-4 shadow-[4px_4px_0px_0px_#111827]">
                    <div className="flex items-center gap-2 border-r-2 border-on-background pr-4 hidden md:flex">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>filter_list</span>
                        <span className="font-button-text text-button-text">Filter:</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Status</label>
                            <select 
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="border-2 border-on-background bg-surface px-4 py-2 font-body-lg text-body-lg focus:ring-0 focus:border-primary shadow-[2px_2px_0px_0px_#111827] appearance-none cursor-pointer"
                            >
                                <option>Semua Status</option>
                                <option>Selesai</option>
                                <option>Ditolak</option>
                                <option>Proses</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Kategori</label>
                            <select 
                                value={kategoriFilter}
                                onChange={e => setKategoriFilter(e.target.value)}
                                className="border-2 border-on-background bg-surface px-4 py-2 font-body-lg text-body-lg focus:ring-0 focus:border-primary shadow-[2px_2px_0px_0px_#111827] appearance-none cursor-pointer"
                            >
                                <option>Semua Kategori</option>
                                <option>Fasilitas Rusak</option>
                                <option>Kebersihan</option>
                                <option>Keamanan</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full md:w-auto py-2 px-6 bg-on-background text-white border-2 border-on-background shadow-[4px_4px_0px_0px_#7C3AED] font-button-text text-button-text hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#7C3AED] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100">
                            Terapkan
                        </button>
                    </div>
                </section>

                {/* Quest Log Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {filteredReports.map(report => (
                        <article 
                            key={report.id_pengaduan}
                            onClick={() => setSelectedQuest(report)}
                            className="bg-surface-container-lowest border-2 border-on-background shadow-[4px_4px_0px_0px_#111827] flex flex-col hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#111827] transition-all duration-100 group cursor-pointer"
                        >
                            <div className={`h-4 ${getStatusStyle(report.status).split(' ')[0]} border-b-2 border-on-background w-full`}></div>
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <span className={`inline-block px-2 py-1 ${getStatusStyle(report.status)} border-2 border-on-background font-label-mono text-label-mono uppercase`}>
                                        {report.status}
                                    </span>
                                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{report.judul_laporan}</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{report.isi_laporan}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t-2 border-on-background flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined ${report.status === 'Selesai' ? 'text-primary' : report.status === 'Ditolak' ? 'text-error' : 'text-secondary'}`} style={{fontVariationSettings: "'FILL' 1"}}>{getStatusIcon(report.kategori)}</span>
                                            <span className="font-label-mono text-label-mono">{report.kategori || 'Fasilitas'}</span>
                                        </div>
                                        {report.status === 'Selesai' ? (
                                            <div className="font-button-text text-button-text text-primary flex items-center gap-1">
                                                +{report.poin_diberikan > 0 ? report.poin_diberikan : 50} EXP
                                            </div>
                                        ) : (
                                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                                                {report.status === 'Pending' ? 'Menunggu Verifikasi' : report.status === 'Ditolak' ? 'Quest Gagal' : 'Diproses Teknisi'}
                                            </div>
                                        )}
                                    </div>
                                    {report.tanggapan && (
                                        <div className="bg-surface-container-low border-2 border-outline-variant p-2 font-label-mono text-label-mono text-on-surface-variant text-xs mt-1">
                                            <span className="font-bold">{report.status === 'Ditolak' ? 'Alasan:' : 'Tanggapan:'}</span> {report.tanggapan}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                    {filteredReports.length === 0 && (
                        <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg">
                            Tidak ada laporan yang sesuai dengan filter.
                        </div>
                    )}
                </section>
            </div>

            {/* Quest Detail Modal */}
            {selectedQuest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedQuest(null)}>
                    <div 
                        className="bg-surface-container-lowest border-4 border-on-background shadow-[12px_12px_0_0_#111827] max-w-2xl w-full p-8 relative rounded-none flex flex-col gap-6"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b-4 border-on-background pb-4">
                            <h2 className="font-headline-lg text-primary uppercase">DETAIL QUEST</h2>
                            <span className={`inline-block px-3 py-1 ${getStatusStyle(selectedQuest.status)} border-2 border-on-background font-label-mono text-label-mono uppercase font-bold`}>
                                {selectedQuest.status}
                            </span>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col gap-6">
                            <h3 className="font-headline-md text-on-background">{selectedQuest.judul_laporan}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container p-4 border-2 border-on-background shadow-[4px_4px_0_0_#111827]">
                                <div className="flex flex-col gap-1">
                                    <span className="font-label-mono text-on-surface-variant uppercase text-xs">Tanggal</span>
                                    <span className="font-body-md font-bold text-on-background">
                                        {new Date(selectedQuest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-label-mono text-on-surface-variant uppercase text-xs">Lokasi</span>
                                    <span className="font-body-md font-bold text-on-background">{selectedQuest.lokasi || '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-label-mono text-on-surface-variant uppercase text-xs">Kategori</span>
                                    <span className="font-body-md font-bold text-on-background">{selectedQuest.kategori || 'Fasilitas'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-body-lg text-on-surface">{selectedQuest.isi_laporan}</p>
                            </div>
                            
                            {renderTimeline(selectedQuest.status, selectedQuest.tanggapan)}
                            {/* Dummy Bukti Foto logic as payload didn't include actual images */}
                            <div className="border-2 border-on-background p-4 shadow-[4px_4px_0_0_#111827]">
                                <h4 className="font-label-mono text-on-background uppercase mb-2 font-bold border-b-2 border-on-background pb-2">BUKTI FOTO</h4>
                                <div className="w-full h-48 bg-surface-variant border-2 border-on-background flex items-center justify-center border-dashed">
                                    <span className="material-symbols-outlined text-on-surface-variant text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>image</span>
                                </div>
                            </div>
                            


                            {selectedQuest.status === 'Selesai' && (
                                <div className="flex justify-center">
                                    <div className="inline-flex items-center justify-center px-6 py-3 bg-tertiary-fixed border-2 border-tertiary shadow-[4px_4px_0_0_#7C3AED]">
                                        <span className="font-headline-md text-tertiary font-extrabold">+{selectedQuest.poin_diberikan > 0 ? selectedQuest.poin_diberikan : 50} EXP</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t-4 border-on-background">
                            <button 
                                onClick={() => setSelectedQuest(null)}
                                className="w-full py-4 px-6 bg-tertiary text-on-tertiary border-2 border-on-background shadow-[4px_4px_0_0_#111827] font-button-text text-button-text hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] active:translate-y-0 active:shadow-none transition-all uppercase tracking-wider"
                            >
                                KEMBALI KE LOG
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Riwayat.layout = (page: any) => <AuthenticatedLayout activeTab="riwayat">{page}</AuthenticatedLayout>;
