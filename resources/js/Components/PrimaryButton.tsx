import { ButtonHTMLAttributes } from 'react';

type Variant = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis' | 'default';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: string;
}

const VARIANT_STYLES: Record<Variant, { bg: string; shadow: string; glow: string }> = {
    beranda: { bg: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)', shadow: 'rgba(22,163,74,0.4)', glow: '#16A34A' },
    lapor: { bg: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)', shadow: 'rgba(29,78,216,0.4)', glow: '#1D4ED8' },
    riwayat: { bg: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)', shadow: 'rgba(109,40,217,0.4)', glow: '#6D28D9' },
    tukar: { bg: 'linear-gradient(135deg, #C2410C 0%, #F97316 100%)', shadow: 'rgba(194,65,12,0.4)', glow: '#C2410C' },
    kuis: { bg: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)', shadow: 'rgba(190,24,93,0.4)', glow: '#BE185D' },
    default: { bg: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)', shadow: 'rgba(22,163,74,0.4)', glow: '#16A34A' },
};

const SIZE_STYLES = {
    sm: { padding: '8px 16px', fontSize: '12px', height: '34px', radius: '10px' },
    md: { padding: '11px 24px', fontSize: '14px', height: '42px', radius: '12px' },
    lg: { padding: '14px 32px', fontSize: '15px', height: '50px', radius: '14px' },
};

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    variant = 'default',
    size = 'md',
    loading = false,
    icon,
    style,
    ...props
}: PrimaryButtonProps) {
    const v = VARIANT_STYLES[variant];
    const s = SIZE_STYLES[size];
    const isDisabled = disabled || loading;

    return (
        <button
            {...props}
            disabled={isDisabled}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: s.height,
                padding: s.padding,
                fontSize: s.fontSize,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.01em',
                color: '#ffffff',
                background: isDisabled ? '#D1D5DB' : v.bg,
                border: 'none',
                borderRadius: s.radius,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                boxShadow: isDisabled ? 'none' : `0 4px 14px ${v.shadow}`,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
                opacity: isDisabled ? 0.6 : 1,
                transform: 'translateY(0)',
                ...style,
            }}
            onMouseEnter={(e) => {
                if (isDisabled) return;
                const el = e.currentTarget;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = `0 8px 20px ${v.shadow}`;
            }}
            onMouseLeave={(e) => {
                if (isDisabled) return;
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = `0 4px 14px ${v.shadow}`;
            }}
            onMouseDown={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'translateY(0) scale(0.97)';
            }}
            onMouseUp={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
        >
            {loading ? (
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ animation: 'komin-spin 0.7s linear infinite', flexShrink: 0 }}
                >
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
            ) : icon ? (
                <span style={{ fontSize: parseInt(s.fontSize) + 2 + 'px' }}>{icon}</span>
            ) : null}
            {children}

            <style>{`
                @keyframes komin-spin { to { transform: rotate(360deg); } }
            `}</style>
        </button>
    );
}