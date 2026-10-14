import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TbHome, TbHistory, TbGift, TbPlus, TbBrain } from 'react-icons/tb';

export default function Authenticated({
    header,
    children,
    activeTab,
}: PropsWithChildren<{ header?: ReactNode; activeTab?: string }>) {
    const { auth, reports = [], flash } = usePage().props as any;
    const user = auth?.user;

    const points = user ? user.total_poin : 0;
    let IconLevel = '🥉';
    if (points >= 150 && points < 300) { IconLevel = '🥈'; } else if (points >= 300) { IconLevel = '👑'; }

    const hasPending = Array.isArray(reports) && reports.some((r: any) => r.status === 'Pending');

    const getTabColor = (tabId: string) => {
        switch (tabId) {
            case 'beranda': return 'bg-primary';
            case 'lapor': return 'bg-secondary';
            case 'riwayat': return 'bg-tertiary';
            case 'tukar': return 'bg-[#F59E0B]';
            case 'kuis': return 'bg-[#DB2777]';
            case 'profile': return 'bg-on-background';
            default: return 'bg-secondary-container';
        }
    };

    const getTabClass = (tabId: string) => {
        const isActive = tabId === activeTab;
        const baseClass = "relative flex items-center gap-3 p-3 font-button-text text-button-text transition-colors duration-300 z-10 border-2 border-transparent";
        
        if (!isActive) {
            return `${baseClass} text-on-surface-variant hover:text-on-background hover:bg-surface-container-high hover:border-on-background hover:translate-x-2`;
        }

        switch (tabId) {
            case 'tukar': return `${baseClass} text-[#111827] translate-x-3`;
            case 'profile': return `${baseClass} text-surface translate-x-3`;
            default: return `${baseClass} text-white translate-x-3`;
        }
    };

    const renderActiveIndicator = (tabId: string) => {
        if (activeTab === tabId) {
            return (
                <motion.div
                    layoutId="active-tab-indicator"
                    className={`absolute inset-0 neo-border shadow-[4px_4px_0_0_#171d16] -z-10 ${getTabColor(tabId)}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            );
        }
        return null;
    };

    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
            {/* TopNavBar (Mobile/Tablet Only) */}
            <header className="lg:hidden w-full flex justify-between items-center h-20 px-margin-mobile bg-surface neo-border border-l-0 border-r-0 border-t-0 neo-shadow z-50 sticky top-0">
                <div className="font-headline-md text-headline-md font-extrabold text-on-surface tracking-tight">SMK Quest</div>
                <div className="font-label-mono text-label-mono text-on-surface-variant bg-surface-container px-3 py-1 neo-border neo-shadow-sm">
                    LVL {user?.level || 1} • {user?.xp || 0}/{user?.level ? user.level * 100 : 100} EXP
                </div>
            </header>

            {/* SideNavBar (Desktop Only) */}
            <aside className="hidden lg:flex flex-col gap-unit p-6 w-64 h-screen sticky top-0 bg-surface neo-border border-t-0 border-b-0 border-l-0 shadow-[4px_0px_0px_0px_#171d16] z-40 shrink-0">
                {/* Brand */}
                <div className="mb-8 mt-2">
                    <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface uppercase tracking-tight">SMK<br/>Quest</h1>
                </div>
                {/* Header Profile */}
                <div className="flex flex-col items-center mb-8 bg-surface-container-highest p-4 neo-border neo-shadow-sm relative">
                    <div className="absolute -top-4 -right-4 bg-primary text-on-primary font-label-mono text-xs px-2 py-1 neo-border neo-shadow-sm rotate-6">LVL {user?.level || 1}</div>
                    <div className="w-16 h-16 neo-border neo-shadow-sm mb-3 bg-surface flex items-center justify-center text-3xl">{IconLevel}</div>
                    <h2 className="font-headline-md text-headline-md text-center leading-tight">{user ? user.nama_lengkap.split(' ')[0] : 'Guest'}</h2>
                    <p className="font-label-mono text-label-mono text-on-surface-variant mt-1">{user?.rpg_class || 'Novice Reporter'}</p>
                </div>
                {/* Navigation Tabs */}
                <nav className="flex flex-col gap-3 flex-1 relative">
                    <Link href={route('dashboard')} className={getTabClass('beranda')}>
                        {renderActiveIndicator('beranda')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
                        Beranda
                    </Link>
                    <Link href={route('student.lapor')} className={getTabClass('lapor')}>
                        {renderActiveIndicator('lapor')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>report</span>
                        Lapor
                    </Link>
                    <Link href={route('student.riwayat')} className={`${getTabClass('riwayat')} relative`}>
                        {renderActiveIndicator('riwayat')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
                        Riwayat
                        {hasPending && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse border border-on-background"></span>}
                    </Link>
                    <Link href={route('student.tukar')} className={getTabClass('tukar')}>
                        {renderActiveIndicator('tukar')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>currency_exchange</span>
                        Tukar
                    </Link>
                    <Link href={route('student.kuis')} className={getTabClass('kuis')}>
                        {renderActiveIndicator('kuis')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>quiz</span>
                        Kuis
                    </Link>
                </nav>

                {/* Bottom Sidebar Links */}
                <div className="mt-4 flex flex-col gap-2 mb-4 relative">
                    {user?.role === 'admin' && (
                        <a href="/admin" className="relative flex items-center gap-3 p-3 font-button-text text-button-text text-on-surface-variant hover:text-on-background hover:bg-surface-container-high hover:border-on-background hover:translate-x-2 transition-colors duration-300 border-2 border-transparent">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>admin_panel_settings</span>
                            Admin Panel
                        </a>
                    )}
                    <Link href={route('profile.edit')} className={getTabClass('profile')}>
                        {renderActiveIndicator('profile')}
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                        Profil
                    </Link>
                    {user ? (
                        <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 p-3 font-button-text text-button-text text-error hover:bg-error-container hover:text-on-error-container border-2 border-transparent hover:border-error transition-all duration-300 w-full text-left">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>logout</span>
                            Logout
                        </Link>
                    ) : (
                        <Link href={route('login')} className="flex items-center gap-3 p-3 font-button-text text-button-text text-primary hover:bg-primary-container hover:text-on-primary-container border-2 border-transparent hover:border-primary transition-all duration-300 w-full text-left">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>login</span>
                            Masuk / Login
                        </Link>
                    )}
                </div>
                <Link href={route('student.lapor')} className="w-full bg-primary text-on-primary font-button-text text-button-text p-4 neo-border neo-shadow neo-hover neo-active transition-all mt-auto flex items-center justify-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    Mulai Quest
                </Link>
            </aside>

            {/* BottomNavBar (Mobile/Tablet Only) */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface neo-border border-b-0 border-l-0 border-r-0 shadow-[0px_-4px_0px_0px_#171d16] z-50 flex justify-around p-3 pb-safe">
                <Link href={route('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'beranda' ? 'text-primary font-button-text text-xs bg-primary-container/20 neo-border neo-shadow-sm translate-y-[-2px]' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
                </Link>
                <Link href={route('student.lapor')} className={`flex flex-col items-center p-2 ${activeTab === 'lapor' ? 'text-primary font-button-text text-xs bg-primary-container/20 neo-border neo-shadow-sm translate-y-[-2px]' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>report</span>
                </Link>
                <Link href={route('student.riwayat')} className={`flex flex-col items-center p-2 relative ${activeTab === 'riwayat' ? 'text-primary font-button-text text-xs bg-primary-container/20 neo-border neo-shadow-sm translate-y-[-2px]' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
                    {hasPending && <span className="absolute top-1 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>}
                </Link>
                {user?.role === 'admin' && (
                    <a href="/admin" className="flex flex-col items-center p-2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>admin_panel_settings</span>
                    </a>
                )}
                <Link href={route('profile.edit')} className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-primary font-button-text text-xs bg-primary-container/20 neo-border neo-shadow-sm translate-y-[-2px]' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                </Link>
                {user ? (
                    <Link href={route('logout')} method="post" as="button" className="flex flex-col items-center p-2 text-error hover:text-error/80">
                        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>logout</span>
                    </Link>
                ) : (
                    <Link href={route('login')} className="flex flex-col items-center p-2 text-primary hover:text-primary/80">
                        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>login</span>
                    </Link>
                )}
            </nav>

            {/* Main Canvas Area */}
            <main className="flex-1 p-margin-mobile lg:p-margin-desktop w-full max-w-container-max mx-auto pb-24 lg:pb-margin-desktop flex flex-col gap-gutter relative">
                
                {/* Flash Messages */}
                {(flash?.success || flash?.error) && (
                    <div className="fixed top-24 right-4 lg:right-8 z-[100] flex flex-col gap-2 max-w-sm w-full animate-[slideIn_0.3s_ease-out]">
                        {flash.success && (
                            <div className="bg-primary-container text-on-primary-container p-4 neo-border shadow-[4px_4px_0_0_#111827] flex items-start gap-3">
                                <span className="material-symbols-outlined shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                <div className="font-body-md text-sm">{flash.success}</div>
                            </div>
                        )}
                        {flash.error && (
                            <div className="bg-error-container text-on-error-container p-4 neo-border shadow-[4px_4px_0_0_#111827] flex items-start gap-3">
                                <span className="material-symbols-outlined shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                                <div className="font-body-md text-sm">{flash.error}</div>
                            </div>
                        )}
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
