import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';

interface LaporProps extends PageProps {
    flash?: { success?: string; error?: string };
}

export default function Lapor({ auth, flash }: LaporProps) {
    const [kategori, setKategori]   = useState('');
    const [tanggal, setTanggal]     = useState(new Date().toISOString().split('T')[0]);
    const [judul, setJudul]         = useState('');
    const [lokasi, setLokasi]       = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [files, setFiles]         = useState<File[]>([]);
    const [dragOver, setDragOver]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(!!flash?.success);
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!kategori) e.kategori = 'Pilih kategori terlebih dahulu';
        if (!judul.trim()) e.judul = 'Judul tidak boleh kosong';
        if (!lokasi.trim()) e.lokasi = 'Lokasi tidak boleh kosong';
        if (!deskripsi.trim()) e.deskripsi = 'Deskripsi tidak boleh kosong';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('kategori', kategori);
        formData.append('tanggal', tanggal);
        formData.append('judul', judul);
        formData.append('lokasi', lokasi);
        formData.append('deskripsi', deskripsi);
        files.forEach(f => formData.append('lampiran[]', f));

        router.post(route('student.lapor.store'), formData, {
            onSuccess: () => { setSubmitted(true); setSubmitting(false); },
            onError: (e) => { setErrors(e); setSubmitting(false); },
            forceFormData: true,
        });
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const newFiles = Array.from(incoming).filter(f => f.size < 5 * 1024 * 1024);
        setFiles(prev => [...prev, ...newFiles].slice(0, 3));
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault(); setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    if (submitted) {
        return (
            <>
                <Head title="Lapor" />
                <div className="w-full px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto flex flex-col items-center">
                    <div className="bg-surface-container-lowest p-8 neo-border shadow-[4px_4px_0px_0px_#111827] max-w-lg w-full text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-primary border-2 border-on-background shadow-[4px_4px_0px_0px_#111827] flex items-center justify-center -rotate-6">
                            <span className="material-symbols-outlined text-4xl text-on-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                        </div>
                        <div>
                            <h2 className="font-display-lg text-display-lg-mobile text-on-background mb-2">Laporan Terkirim!</h2>
                            <p className="font-body-lg text-on-surface-variant">Kamu mendapatkan +50 EXP! Tim sarpras akan segera mengecek laporanmu.</p>
                        </div>
                        <div className="flex gap-4 w-full mt-4 flex-col sm:flex-row">
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setJudul(''); setDeskripsi(''); setLokasi(''); setFiles([]);
                                }}
                                className="flex-1 bg-surface text-on-surface font-button-text border-2 border-on-background shadow-[2px_2px_0px_0px_#111827] px-6 py-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                Lapor Lagi
                            </button>
                            <a
                                href={route('student.riwayat')}
                                className="flex-1 bg-secondary text-on-secondary font-button-text border-2 border-on-background shadow-[2px_2px_0px_0px_#111827] px-6 py-3 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#111827] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                Lihat Riwayat
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Lapor" />

            <div className="w-full px-margin-mobile md:px-margin-desktop py-8 md:py-12 max-w-container-max mx-auto">
                {/* Page Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="font-label-mono text-label-mono text-secondary mb-2 uppercase flex items-center gap-2">
                            <span className="w-8 h-1 bg-secondary inline-block"></span> New Quest
                        </div>
                        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">Lapor Kerusakan</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
                            Temukan fasilitas yang rusak atau perlu perbaikan? Laporkan segera untuk mendapatkan EXP dan membantu menjaga sekolah kita.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-high p-3 border-2 border-on-background shadow-[2px_2px_0px_0px_#111827]">
                        <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
                        <span className="font-label-mono text-label-mono">Reward: +50 EXP / Laporan Valid</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-gutter items-start">
                    {/* Left Column: The Form */}
                    <div className="lg:col-span-8 space-y-6">
                        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border-2 border-on-background shadow-[4px_4px_0px_0px_#111827] relative overflow-hidden">
                            {/* Form Header Banner */}
                            <div className="bg-secondary border-b-2 border-on-background px-6 py-4 flex items-center gap-3">
                                <span className="material-symbols-outlined text-on-secondary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>edit_document</span>
                                <h2 className="font-headline-md text-headline-md text-on-secondary m-0">Detail Laporan</h2>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {/* Input: Judul */}
                                <div className="space-y-2">
                                    <label className="font-label-mono text-label-mono text-on-surface flex items-center gap-2" htmlFor="judul">
                                        Judul Temuan <span className="text-error">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="judul" 
                                        value={judul}
                                        onChange={e => { setJudul(e.target.value); setErrors(p => ({ ...p, judul: '' })); }}
                                        placeholder="Contoh: AC Kelas XII RPL 1 Bocor" 
                                        className={`w-full bg-surface-bright border-2 ${errors.judul ? 'border-error' : 'border-on-background'} px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 shadow-[2px_2px_0px_0px_#111827] focus:outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0px_0px_#0051d5] focus:border-secondary transition-all rounded-none`} 
                                    />
                                    {errors.judul && <p className="text-error text-xs font-bold">{errors.judul}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Input: Lokasi */}
                                    <div className="space-y-2">
                                        <label className="font-label-mono text-label-mono text-on-surface flex items-center gap-2" htmlFor="lokasi">
                                            Lokasi / Fasilitas <span className="text-error">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">location_on</span>
                                            <input 
                                                type="text" 
                                                id="lokasi" 
                                                value={lokasi}
                                                onChange={e => { setLokasi(e.target.value); setErrors(p => ({ ...p, lokasi: '' })); }}
                                                placeholder="Nama Ruangan..." 
                                                className={`w-full bg-surface-bright border-2 ${errors.lokasi ? 'border-error' : 'border-on-background'} pl-10 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 shadow-[2px_2px_0px_0px_#111827] focus:outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0px_0px_#0051d5] focus:border-secondary transition-all rounded-none`} 
                                            />
                                        </div>
                                        {errors.lokasi && <p className="text-error text-xs font-bold">{errors.lokasi}</p>}
                                    </div>
                                    
                                    {/* Input: Kategori */}
                                    <div className="space-y-2">
                                        <label className="font-label-mono text-label-mono text-on-surface flex items-center gap-2" htmlFor="kategori">
                                            Kategori <span className="text-error">*</span>
                                        </label>
                                        <div className="relative">
                                            <select 
                                                id="kategori" 
                                                value={kategori}
                                                onChange={e => { setKategori(e.target.value); setErrors(p => ({ ...p, kategori: '' })); }}
                                                className={`w-full bg-surface-bright border-2 ${errors.kategori ? 'border-error' : 'border-on-background'} px-4 py-3 font-body-md text-body-md text-on-surface shadow-[2px_2px_0px_0px_#111827] focus:outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0px_0px_#0051d5] focus:border-secondary transition-all rounded-none appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled>Pilih Kategori...</option>
                                                <option value="elektronik">Elektronik & Kelistrikan</option>
                                                <option value="furnitur">Furnitur (Meja/Kursi)</option>
                                                <option value="bangunan">Struktur Bangunan</option>
                                                <option value="kebersihan">Kebersihan Lingkungan</option>
                                                <option value="lainnya">Lainnya</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface pointer-events-none">arrow_drop_down</span>
                                        </div>
                                        {errors.kategori && <p className="text-error text-xs font-bold">{errors.kategori}</p>}
                                    </div>
                                </div>

                                {/* Input: Deskripsi */}
                                <div className="space-y-2">
                                    <label className="font-label-mono text-label-mono text-on-surface flex items-center gap-2" htmlFor="deskripsi">
                                        Deskripsi Masalah <span className="text-error">*</span>
                                    </label>
                                    <textarea 
                                        id="deskripsi" 
                                        rows={4} 
                                        value={deskripsi}
                                        onChange={e => { setDeskripsi(e.target.value); setErrors(p => ({ ...p, deskripsi: '' })); }}
                                        placeholder="Jelaskan kondisi kerusakan secara detail..." 
                                        className={`w-full bg-surface-bright border-2 ${errors.deskripsi ? 'border-error' : 'border-on-background'} px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 shadow-[2px_2px_0px_0px_#111827] focus:outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0px_0px_#0051d5] focus:border-secondary transition-all rounded-none resize-y`}
                                    ></textarea>
                                    {errors.deskripsi && <p className="text-error text-xs font-bold">{errors.deskripsi}</p>}
                                </div>

                                {/* Input: File Upload */}
                                <div className="space-y-2">
                                    <label className="font-label-mono text-label-mono text-on-surface flex items-center justify-between">
                                        <span>Upload Bukti Foto</span>
                                        <span className="text-xs text-on-surface-variant font-body-md">Maks. 5MB (JPG/PNG)</span>
                                    </label>
                                    <div 
                                        onClick={() => fileRef.current?.click()}
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={onDrop}
                                        className={`relative w-full h-40 border-2 border-dashed ${dragOver ? 'border-secondary bg-secondary-container' : 'border-on-background bg-surface-container'} hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group`}
                                    >
                                        <input 
                                            type="file" 
                                            id="file_upload" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            accept="image/*" 
                                            multiple
                                            ref={fileRef}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
                                        />
                                        <div className="w-12 h-12 bg-secondary border-2 border-on-background shadow-[2px_2px_0px_0px_#111827] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                            <span className="material-symbols-outlined text-on-secondary">cloud_upload</span>
                                        </div>
                                        <span className="font-button-text text-button-text text-on-surface mt-2 group-hover:text-secondary transition-colors">
                                            {dragOver ? 'Lepaskan untuk Upload' : 'Klik atau Seret Foto ke Sini'}
                                        </span>
                                    </div>
                                    
                                    {files.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {files.map((f, i) => (
                                                <div key={i} className="relative w-20 h-20 border-2 border-on-background shadow-[2px_2px_0px_0px_#111827] overflow-hidden">
                                                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, j) => j !== i)); }} className="absolute top-1 right-1 bg-error text-on-error w-5 h-5 flex items-center justify-center border-2 border-on-background shadow-[1px_1px_0px_0px_#111827]">
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Footer & CTA */}
                            <div className="bg-surface-container border-t-2 border-on-background p-6 md:p-8 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="bg-secondary text-on-secondary font-button-text text-button-text border-2 border-on-background shadow-[4px_4px_0px_0px_#111827] px-8 py-4 flex items-center gap-2 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#111827] hover:bg-secondary-container hover:text-on-secondary-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 disabled:opacity-70"
                                >
                                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{submitting ? 'sync' : 'send'}</span>
                                    {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Hero Guidelines Card */}
                        <div className="bg-primary-fixed-dim border-2 border-on-background shadow-[4px_4px_0px_0px_#111827] p-6 relative">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-surface border-2 border-on-background shadow-[2px_2px_0px_0px_#111827] flex items-center justify-center rotate-12">
                                <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>lightbulb</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-background mb-4">Tips untuk Pahlawan</h3>
                            <ul className="space-y-4 font-body-md text-on-background">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined mt-0.5 text-on-background">check_box</span>
                                    <span><strong>Foto yang Jelas.</strong> Pastikan area kerusakan terlihat jelas di foto agar teknisi tahu apa yang dihadapi.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined mt-0.5 text-on-background">check_box</span>
                                    <span><strong>Deskripsi Padat.</strong> Hindari curhat, langsung pada inti masalah (misal: "Kaki kursi patah" bukan "Kursinya tidak enak dipakai").</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined mt-0.5 text-on-background">warning</span>
                                    <span><strong>Laporan Palsu = Banned.</strong> Menyalahgunakan sistem pelaporan akan mengakibatkan pengurangan EXP dan penalti akun.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="border-2 border-on-background bg-surface-container-lowest shadow-[4px_4px_0px_0px_#111827]">
                            <div className="border-b-2 border-on-background p-4 bg-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-on-surface">history</span>
                                <h4 className="font-button-text text-button-text text-on-surface">Laporan Terkini di Sekolah</h4>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 border-2 border-on-background rounded-full bg-secondary shrink-0"></div>
                                    <div>
                                        <p className="font-label-mono text-label-mono text-on-surface">Proyektor Lab Komputer Mati</p>
                                        <p className="text-sm font-body-md text-on-surface-variant">Oleh <span className="font-bold">Anonim</span> • 10 menit lalu</p>
                                    </div>
                                </div>
                                <hr className="border-t-2 border-dashed border-outline-variant" />
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 border-2 border-on-background rounded-full bg-primary shrink-0"></div>
                                    <div>
                                        <p className="font-label-mono text-label-mono text-on-surface line-through decoration-2">Keran Toilet Lantai 2 Bocor</p>
                                        <p className="text-sm font-body-md text-primary font-bold">Telah Diselesaikan (+50 EXP)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Lapor.layout = (page: any) => <AuthenticatedLayout activeTab="lapor">{page}</AuthenticatedLayout>;
