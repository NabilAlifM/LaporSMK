import { InertiaLinkProps, Link } from '@inertiajs/react';
import { useState } from 'react';

type TabKey = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis';

interface ResponsiveNavLinkProps extends InertiaLinkProps {
    active?: boolean;
    'data-tab'?: TabKey;
}

const TAB_COLORS: Record<TabKey, { active: string; indicator: string; glow: string }> = {
    beranda:  { active: '#16A34A', indicator: 'rgba(22,163,74,0.15)',   glow: 'rgba(22,163,74,0.3)'   },
    lapor:    { active: '#2563EB', indicator: 'rgba(37,99,235,0.15)',   glow: 'rgba(37,99,235,0.3)'   },
    riwayat:  { active: '#7C3AED', indicator: 'rgba(124,58,237,0.15)',  glow: 'rgba(124,58,237,0.3)'  },
    tukar:    { active: '#EA580C', indicator: 'rgba(234,88,12,0.15)',   glow: 'rgba(234,88,12,0.3)'   },
    kuis:     { active: '#DB2777', indicator: 'rgba(219,39,119,0.15)',  glow: 'rgba(219,39,119,0.3)'  },
};

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    'data-tab': tabKey,
    ...props
}: ResponsiveNavLinkProps) {
    const [pressed, setPressed] = useState(false);
    const colors = tabKey ? TAB_COLORS[tabKey] : null;

    const activeColor = colors ? colors.active : '#16A34A';
    const indicatorBg = colors ? colors.indicator : 'rgba(22,163,74,0.15)';

    return (
        <Link
            {...props}
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                flex: 1,
                padding: '6px 4px',
                borderRadius: '14px',
                textDecoration: 'none',
                background: active ? indicatorBg : 'transparent',
                transform: pressed ? 'scale(0.92)' : active ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
        >
            {/* Active top indicator bar */}
            {active && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '25%',
                    right: '25%',
                    height: '3px',
                    background: activeColor,
                    borderRadius: '0 0 4px 4px',
                }} />
            )}

            {/* Icon & label rendered from children */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
            }}>
                {/* Children: first = emoji icon, second = label */}
                {Array.isArray(children) ? (
                    <>
                        <span style={{
                            fontSize: '20px',
                            lineHeight: 1,
                            filter: active ? 'none' : 'grayscale(0.4)',
                            transition: 'filter 0.2s ease',
                        }}>
                            {children[0]}
                        </span>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: active ? 700 : 500,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: active ? activeColor : '#9CA3AF',
                            letterSpacing: '0.02em',
                            transition: 'color 0.15s ease',
                            lineHeight: 1,
                        }}>
                            {children[1]}
                        </span>
                    </>
                ) : (
                    <span style={{
                        fontSize: '10px',
                        color: active ? activeColor : '#9CA3AF',
                    }}>
                        {children}
                    </span>
                )}
            </div>
        </Link>
    );
}