import { ButtonHTMLAttributes } from 'react';

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    ghost?: boolean;
}

const SIZE_STYLES = {
    sm: { padding: '7px 14px', fontSize: '12px', height: '34px', radius: '10px' },
    md: { padding: '10px 22px', fontSize: '14px', height: '42px', radius: '12px' },
    lg: { padding: '13px 30px', fontSize: '15px', height: '50px', radius: '14px' },
};

export default function DangerButton({
    className = '',
    disabled,
    children,
    size = 'md',
    loading = false,
    ghost = false,
    style,
    ...props
}: DangerButtonProps) {
    const s = SIZE_STYLES[size];
    const isDisabled = disabled || loading;

    const solidStyle = {
        color: '#ffffff',
        background: isDisabled ? '#FCA5A5' : 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        border: 'none',
        boxShadow: isDisabled ? 'none' : '0 4px 14px rgba(220,38,38,0.35)',
    };

    const ghostStyle = {
        color: isDisabled ? '#FCA5A5' : '#DC2626',
        background: 'transparent',
        border: `1.5px solid ${isDisabled ? '#FCA5A5' : '#DC2626'}`,
        boxShadow: 'none',
    };

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
                borderRadius: s.radius,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: isDisabled ? 0.65 : 1,
                ...(ghost ? ghostStyle : solidStyle),
                ...style,
            }}
            onMouseEnter={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'translateY(-2px)';
                if (!ghost) e.currentTarget.style.boxShadow = '0 8px 20px rgba(220,38,38,0.4)';
                else e.currentTarget.style.background = 'rgba(220,38,38,0.07)';
            }}
            onMouseLeave={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'translateY(0)';
                if (!ghost) e.currentTarget.style.boxShadow = '0 4px 14px rgba(220,38,38,0.35)';
                else e.currentTarget.style.background = 'transparent';
            }}
            onMouseDown={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
        >
            {loading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ animation: 'komin-spin 0.7s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            ) : (
                <span style={{ fontSize: '16px' }}>🗑️</span>
            )}
            {children}
            <style>{`@keyframes komin-spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    );
}