import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { PropsWithChildren, ReactNode } from 'react';

type Variant = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis' | 'default';

interface ModalProps {
    children: ReactNode;
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: () => void;
    variant?: Variant;
    title?: string;
    icon?: string;
}

const VARIANT_ACCENT: Record<Variant, { strip: string; iconBg: string }> = {
    beranda: { strip: 'linear-gradient(90deg, #16A34A, #22C55E)', iconBg: 'rgba(22,163,74,0.12)' },
    lapor: { strip: 'linear-gradient(90deg, #1D4ED8, #3B82F6)', iconBg: 'rgba(29,78,216,0.12)' },
    riwayat: { strip: 'linear-gradient(90deg, #6D28D9, #8B5CF6)', iconBg: 'rgba(109,40,217,0.12)' },
    tukar: { strip: 'linear-gradient(90deg, #C2410C, #F97316)', iconBg: 'rgba(194,65,12,0.12)' },
    kuis: { strip: 'linear-gradient(90deg, #BE185D, #EC4899)', iconBg: 'rgba(190,24,93,0.12)' },
    default: { strip: 'linear-gradient(90deg, #16A34A, #22C55E)', iconBg: 'rgba(22,163,74,0.12)' },
};

const MAX_WIDTH: Record<string, string> = {
    sm: '400px', md: '480px', lg: '560px', xl: '640px', '2xl': '720px',
};

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose,
    variant = 'default',
    title,
    icon,
}: ModalProps) {
    const close = () => { if (closeable) onClose(); };
    const v = VARIANT_ACCENT[variant];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-y-auto px-0 sm:px-4 py-0 sm:py-6"
                onClose={close}
            >
                {/* Backdrop */}
                <TransitionChild
                    enter="ease-out duration-250"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(15,23,42,0.6)',
                        backdropFilter: 'blur(4px)',
                    }} />
                </TransitionChild>

                {/* Panel */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: MAX_WIDTH[maxWidth],
                            background: '#FFFFFF',
                            borderRadius: '20px 20px 0 0',
                            overflow: 'hidden',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        className="sm:!rounded-2xl"
                    >
                        {/* Top color strip */}
                        <div style={{
                            height: '4px',
                            background: v.strip,
                            width: '100%',
                        }} />

                        {/* Drag handle (mobile) */}
                        <div className="sm:hidden" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '10px 0 0',
                        }}>
                            <div style={{
                                width: '36px',
                                height: '4px',
                                background: '#E5E7EB',
                                borderRadius: '9999px',
                            }} />
                        </div>

                        {/* Header (if title provided) */}
                        {(title || icon) && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px 20px 0',
                            }}>
                                {icon && (
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: v.iconBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                )}
                                {title && (
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: '17px',
                                        fontWeight: 800,
                                        color: '#111827',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    }}>
                                        {title}
                                    </h2>
                                )}
                                {closeable && (
                                    <button
                                        onClick={close}
                                        style={{
                                            marginLeft: 'auto',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#F3F4F6',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            color: '#6B7280',
                                            flexShrink: 0,
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}

                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}