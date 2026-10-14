import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    ReactNode,
} from 'react';

type Variant = 'beranda' | 'lapor' | 'riwayat' | 'tukar' | 'kuis' | 'default';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    variant?: Variant;
    label?: string;
    error?: string;
    hint?: string;
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
}

const VARIANT_FOCUS: Record<Variant, { ring: string; border: string }> = {
    beranda: { ring: 'rgba(22,163,74,0.2)', border: '#16A34A' },
    lapor: { ring: 'rgba(29,78,216,0.2)', border: '#1D4ED8' },
    riwayat: { ring: 'rgba(109,40,217,0.2)', border: '#6D28D9' },
    tukar: { ring: 'rgba(194,65,12,0.2)', border: '#C2410C' },
    kuis: { ring: 'rgba(190,24,93,0.2)', border: '#BE185D' },
    default: { ring: 'rgba(22,163,74,0.2)', border: '#16A34A' },
};

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        variant = 'default',
        label,
        error,
        hint,
        prefixIcon,
        suffixIcon,
        style,
        ...props
    }: TextInputProps,
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const v = VARIANT_FOCUS[variant];

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) localRef.current?.focus();
    }, [isFocused]);

    const hasPrefixIcon = !!prefixIcon;
    const hasSuffixIcon = !!suffixIcon;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {label && (
                <label
                    style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: error ? '#DC2626' : focused ? v.border : '#6B7280',
                        transition: 'color 0.15s ease',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                >
                    {label}
                </label>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {hasPrefixIcon && (
                    <div style={{
                        position: 'absolute',
                        left: '14px',
                        color: focused ? v.border : '#9CA3AF',
                        fontSize: '18px',
                        lineHeight: 1,
                        transition: 'color 0.15s ease',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}>
                        {prefixIcon}
                    </div>
                )}

                <input
                    {...props}
                    type={type}
                    ref={localRef}
                    className={className}
                    onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
                    style={{
                        width: '100%',
                        height: '46px',
                        padding: `0 ${hasSuffixIcon ? '44px' : '16px'} 0 ${hasPrefixIcon ? '44px' : '16px'}`,
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: '#111827',
                        background: error ? '#FFF5F5' : focused ? '#FAFFFE' : '#F9FAFB',
                        border: `1.5px solid ${error ? '#EF4444' : focused ? v.border : '#E5E7EB'}`,
                        borderRadius: '12px',
                        outline: 'none',
                        boxShadow: focused
                            ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : v.ring}`
                            : 'none',
                        transition: 'all 0.18s ease',
                        ...style,
                    }}
                />

                {hasSuffixIcon && (
                    <div style={{
                        position: 'absolute',
                        right: '14px',
                        color: focused ? v.border : '#9CA3AF',
                        fontSize: '18px',
                        lineHeight: 1,
                        transition: 'color 0.15s ease',
                    }}>
                        {suffixIcon}
                    </div>
                )}
            </div>

            {error && (
                <p style={{
                    fontSize: '12px',
                    color: '#DC2626',
                    margin: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <span>⚠️</span> {error}
                </p>
            )}

            {hint && !error && (
                <p style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    {hint}
                </p>
            )}
        </div>
    );
});