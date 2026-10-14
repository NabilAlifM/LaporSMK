import { ButtonHTMLAttributes } from 'react';

type Variant = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis' | 'default';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
}

const VARIANT_COLORS: Record<Variant, { border: string; text: string; bg: string }> = {
    beranda: { border: '#16A34A', text: '#16A34A', bg: 'rgba(22,163,74,0.07)' },
    lapor: { border: '#1D4ED8', text: '#1D4ED8', bg: 'rgba(29,78,216,0.07)' },
    riwayat: { border: '#6D28D9', text: '#6D28D9', bg: 'rgba(109,40,217,0.07)' },
    tukar: { border: '#C2410C', text: '#C2410C', bg: 'rgba(194,65,12,0.07)' },
    kuis: { border: '#BE185D', text: '#BE185D', bg: 'rgba(190,24,93,0.07)' },
    default: { border: '#D1D5DB', text: '#374151', bg: 'rgba(0,0,0,0.03)' },
};

const SIZE_STYLES = {
    sm: { padding: '7px 14px', fontSize: '12px', height: '34px', radius: '10px' },
    md: { padding: '10px 22px', fontSize: '14px', height: '42px', radius: '12px' },
    lg: { padding: '13px 30px', fontSize: '15px', height: '50px', radius: '14px' },
};

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    variant = 'default',
    size = 'md',
    icon,
    style,
    ...props
}: SecondaryButtonProps) {
    const v = VARIANT_COLORS[variant];
    const s = SIZE_STYLES[size];

    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: s.height,
                padding: s.padding,
                fontSize: s.fontSize,
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.01em',
                color: disabled ? '#9CA3AF' : v.text,
                background: disabled ? 'transparent' : 'transparent',
                border: `1.5px solid ${disabled ? '#E5E7EB' : v.border}`,
                borderRadius: s.radius,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s ease',
                opacity: disabled ? 0.5 : 1,
                ...style,
            }}
            onMouseEnter={(e) => {
                if (disabled) return;
                e.currentTarget.style.background = v.bg;
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
                if (disabled) return;
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
        >
            {icon && <span style={{ fontSize: parseInt(s.fontSize) + 2 + 'px' }}>{icon}</span>}
            {children}
        </button>
    );
}