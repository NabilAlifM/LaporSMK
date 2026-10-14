import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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
    tgl_expired?: string;
    reward: Reward;
}

interface TukarProps extends PageProps {
    rewards: Reward[];
    claims: Claim[];
}

export default function Tukar({ auth, rewards, claims }: TukarProps) {
    const user = auth?.user as any;
    const pts = user?.total_poin ?? 0;

    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const handleRedeem = (rewardId: number) => {
        if (!user) return;
        if (confirm('Yakin mau tukar poin kamu untuk hadiah ini?')) {
            router.post(route('reward.claim'), { id_reward: rewardId });
        }
    };

    return (
        <>
            <Head title="Tukar Poin" />

            <div className="flex flex-col gap-8 mt-6">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-on-background pb-4">
                    <div>
                        <div className="font-label-mono text-label-mono text-[#F59E0B] mb-2 uppercase flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#F59E0B] inline-block"></span> Reward Shop
                        </div>
                        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Tukar EXP/Poin</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Gunakan poin yang kamu dapatkan untuk menukar voucher hadiah menarik.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-surface-container-lowest border-4 border-on-background p-4 shadow-[4px_4px_0px_0px_#111827] transform rotate-1">
                        <div className="w-12 h-12 bg-[#F59E0B] border-2 border-on-background flex items-center justify-center text-on-background shadow-[2px_2px_0px_0px_#111827]">
                            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Saldo Kamu</span>
                            <span className="font-display-lg text-display-lg text-on-background leading-none">{pts} <span className="text-xl">PTS</span></span>
                        </div>
                    </div>
                </header>

                <div className="space-y-12 pb-12">
                    {/* Rewards Grid */}
                    <section>
                        <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>local_mall</span>
                            Katalog Voucher
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {rewards.map((reward) => {
                                const canClaim = user && pts >= reward.biaya_poin;
                                const outOfStock = reward.stok <= 0;

                                return (
                                    <article key={reward.id} className="bg-surface-container-lowest border-4 border-on-background shadow-[6px_6px_0_0_#111827] flex flex-col relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#111827]">
                                        {outOfStock && (
                                            <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                <div className="bg-error text-on-error border-4 border-on-background px-4 py-2 font-headline-md text-headline-md -rotate-6 shadow-[4px_4px_0_0_#111827]">
                                                    SOLD OUT
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-[#F59E0B] border-b-4 border-on-background p-6 flex justify-center items-center">
                                            <div className="w-20 h-20 bg-surface border-4 border-on-background shadow-[4px_4px_0_0_#111827] rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-on-background" style={{fontVariationSettings: "'FILL' 1"}}>redeem</span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <span className="font-label-mono text-label-mono bg-surface-variant border-2 border-on-background px-2 py-0.5 text-on-surface uppercase text-xs">
                                                    Sisa: {reward.stok}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline-md text-headline-md text-on-background leading-tight mb-2">{reward.nama_reward}</h4>
                                                <p className="font-body-md text-on-surface-variant text-sm line-clamp-2">Tukarkan poin untuk {reward.tipe_reward}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t-4 border-dashed border-outline-variant flex justify-between items-center">
                                                <div className="font-display-lg text-2xl text-on-background">
                                                    {reward.biaya_poin} <span className="text-sm font-label-mono uppercase text-[#F59E0B] tracking-wider">PTS</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRedeem(reward.id)}
                                            disabled={!canClaim || outOfStock}
                                            className={`w-full py-4 border-t-4 border-on-background font-button-text text-button-text uppercase tracking-widest transition-colors ${
                                                canClaim && !outOfStock
                                                    ? 'bg-on-background text-surface hover:bg-primary hover:text-on-primary cursor-pointer'
                                                    : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                                            }`}
                                        >
                                            TUKAR SEKARANG
                                        </button>
                                    </article>
                                );
                            })}
                            {rewards.length === 0 && (
                                <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg border-4 border-dashed border-outline-variant">
                                    Katalog reward sedang kosong.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Claims History */}
                    {claims.length > 0 && (
                        <section>
                            <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>confirmation_number</span>
                                Voucher Saya
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {claims.map(claim => {
                                    const isExpired = claim.tgl_expired && new Date(claim.tgl_expired) < new Date();
                                    const displayStatus = claim.status_voucher === 'Aktif' && isExpired ? 'Expired' : claim.status_voucher;
                                    
                                    return (
                                    <div 
                                        key={claim.id} 
                                        onClick={() => displayStatus === 'Aktif' && setSelectedClaim(claim)}
                                        className={`bg-surface-container-lowest border-4 border-on-background flex shadow-[4px_4px_0_0_#111827] overflow-hidden ${displayStatus === 'Aktif' ? 'cursor-pointer hover:shadow-[6px_6px_0_0_#111827] hover:-translate-y-1 transition-all' : 'opacity-70'}`}
                                    >
                                        <div className={`text-on-secondary p-4 flex flex-col justify-center items-center gap-2 border-r-4 border-dashed border-on-background min-w-[80px] ${displayStatus === 'Aktif' ? 'bg-secondary' : 'bg-surface-variant'}`}>
                                            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>sell</span>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-button-text text-button-text text-on-background truncate pr-2" title={claim.reward?.nama_reward || 'Reward'}>
                                                    {claim.reward?.nama_reward || 'Reward'}
                                                </h4>
                                                <span className={`text-[10px] font-label-mono px-2 border-2 border-on-background uppercase ${displayStatus === 'Aktif' ? 'bg-primary-fixed text-on-surface' : 'bg-surface-variant text-on-surface-variant'}`}>
                                                    {displayStatus}
                                                </span>
                                            </div>
                                            <div className="font-label-mono text-xs text-on-surface-variant mb-1">
                                                Klaim: {new Date(claim.tgl_tukar).toLocaleDateString('id-ID')}
                                            </div>
                                            {claim.tgl_expired && (
                                                <div className={`font-label-mono text-xs mb-3 ${isExpired ? 'text-error' : 'text-[#F59E0B]'}`}>
                                                    Expired: {new Date(claim.tgl_expired).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                            <div className="bg-surface border-2 border-on-background p-2 text-center">
                                                <span className="font-label-mono text-label-mono text-secondary tracking-[0.2em] font-bold">
                                                    {claim.qr_code_token}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* QR Code Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedClaim(null)}>
                    <div 
                        className="bg-surface-container-lowest border-4 border-on-background shadow-[12px_12px_0_0_#111827] max-w-sm w-full p-8 relative rounded-none flex flex-col items-center text-center gap-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedClaim(null)} className="absolute top-4 right-4 material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</button>
                        
                        <div className="font-headline-lg text-primary uppercase">
                            SCAN VOUCHER
                        </div>

                        <div className="bg-white p-4 border-4 border-on-background">
                            <QRCodeSVG value={selectedClaim.qr_code_token} size={200} />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <div className="font-display-md text-on-background">
                                {selectedClaim.reward.nama_reward}
                            </div>
                            <div className="font-label-mono text-lg bg-surface border-2 border-on-background py-2">
                                {selectedClaim.qr_code_token}
                            </div>
                            {selectedClaim.tgl_expired && (
                                <div className="font-label-mono text-xs text-error mt-2">
                                    Tukarkan sebelum: {new Date(selectedClaim.tgl_expired).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            )}
                        </div>

                        <p className="font-body-sm text-on-surface-variant">Tunjukkan QR Code ini kepada petugas koperasi/kantor untuk mengambil hadiahmu.</p>
                    </div>
                </div>
            )}
        </>
    );
}

Tukar.layout = (page: any) => <AuthenticatedLayout activeTab="tukar">{page}</AuthenticatedLayout>;
