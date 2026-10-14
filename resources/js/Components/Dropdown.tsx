import { Transition } from '@headlessui/react';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
    CSSProperties,
} from 'react';

const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}>({
    open: false,
    setOpen: () => { },
    toggleOpen: () => { },
});

const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((prev) => !prev);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen} style={{ cursor: 'pointer', display: 'inline-block' }}>
                {children}
            </div>
            {open && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    children,
}: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48' | '56' | '64';
}>) => {
    const { open, setOpen } = useContext(DropDownContext);

    const widthMap: Record<string, string> = { '48': '192px', '56': '224px', '64': '256px' };

    const posStyle: CSSProperties =
        align === 'left'
            ? { left: 0, transformOrigin: 'top left' }
            : { right: 0, transformOrigin: 'top right' };

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95 translate-y-1"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-1"
        >
            <div
                style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    zIndex: 50,
                    width: widthMap[width] ?? '192px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    ...posStyle,
                }}
                onClick={() => setOpen(false)}
            >
                {children}
            </div>
        </Transition>
    );
};

const DropdownLink = ({
    className = '',
    children,
    ...props
}: InertiaLinkProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            {...props}
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#374151',
                textDecoration: 'none',
                background: hovered ? '#F8FAFC' : 'transparent',
                transition: 'background 0.12s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;