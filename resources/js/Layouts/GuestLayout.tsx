import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0 relative overflow-hidden p-4">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-secondary rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 w-full sm:max-w-md flex flex-col gap-6">
                <div className="flex justify-center">
                    <Link href="/" className="group flex items-center justify-center neo-border bg-surface text-on-surface px-6 py-4 neo-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#171d16] transition-all">
                        <h1 className="font-display-lg text-4xl m-0 leading-none uppercase tracking-tighter text-primary group-hover:text-secondary transition-colors">KOMIN</h1>
                    </Link>
                </div>

                <div className="w-full bg-surface-container-lowest p-6 sm:p-8 neo-border neo-shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
