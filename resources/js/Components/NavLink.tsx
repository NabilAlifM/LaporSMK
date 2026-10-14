import { InertiaLinkProps, Link } from '@inertiajs/react';
import { useState } from 'react';

type TabKey = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis';

interface NavLinkProps extends InertiaLinkProps {
    active: boolean;
    'data-tab'?: TabKey;
}

const TAB_COLORS: Record<TabKey, { bg: string; text: string; dot: string }> = {
    beranda:  { bg: 'rgba(22,163,74,0.12)',   text: '#15803D',  dot: '#16A34A' },
    lapor:    { bg: 'rgba(29,78,216,0.12)',   text: '#1E40AF',  dot: '#2563EB' },
    riwayat:  { bg: 'rgba(109,40,217,0.12)',  text: '#5B21B6',  dot: '#7C3AED' },
    tukar:    { bg: 'rgba(194,65,12,0.12)',   text: '#9A3412',  dot: '#EA580C' },
    kuis:     { bg: 'rgba(190,24,93,0.12)',   text: '#9D174D',  dot: '#DB2777' },
};

export default function NavLink({
    active = false,
    className = '',
    children,
    'data-tab': tabKey,
    ...props
}: NavLinkProps) {
    const [hovered, setHovered] = useState(false);
    const colors = tabKey ? TAB_COLORS[tabKey] : null;

    const activeStyle = colors
        ? { background: colors.bg, color: colors.text }
        : { background: 'rgba(22,163,74,0.12)', color: '#15803D' };

    const hoverStyle = colors
        ? { background: colors.bg + '80', color: colors.text }
        : { background: '#F3F4F6', color: '#374151' };

    return (
        <Link
            {...props}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: active ? 700 : 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.01em',
                textDecoration: 'none',
                borderRadius: '50px',
                border: 'none',
                transition: 'all 0.18s ease',
                ...(active ? activeStyle : hovered ? hoverStyle : { background: 'transparent', color: '#6B7280' }),
                whiteSpace: 'nowrap',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {active && colors && (
                <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: colors.dot,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${colors.dot}`,
                }} />
            )}
            {children}
        </Link>
    );
}