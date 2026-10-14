import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-6 font-label-mono text-sm font-bold bg-primary/20 text-primary border-2 border-primary p-3 uppercase text-center">
                    {status}
                </div>
            )}

            <div className="mb-8 border-b-4 border-on-surface pb-4">
                <h2 className="font-headline-lg text-3xl uppercase text-on-background m-0">Masuk Akun</h2>
                <p className="font-body-md text-on-surface-variant mt-1">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-label-lg font-bold uppercase">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-label-lg font-bold uppercase">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        className="w-6 h-6 neo-border bg-surface text-primary focus:ring-primary focus:ring-2"
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label htmlFor="remember" className="font-body-md text-on-surface uppercase cursor-pointer select-none">
                        Ingat Saya
                    </label>
                </div>

                <div className="mt-4 flex flex-col items-center gap-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="font-button-text bg-primary text-on-primary px-8 py-3 neo-border neo-shadow neo-hover transition-all uppercase disabled:opacity-50 text-lg flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>login</span>
                        Masuk
                    </button>

                    <div className="flex flex-col items-center gap-2 w-full text-center border-t-2 border-on-surface/10 pt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="font-button-text text-sm hover:underline uppercase text-on-surface-variant transition-colors"
                            >
                                Lupa Password?
                            </Link>
                        )}
                        <span className="font-body-sm text-on-surface-variant">atau</span>
                        <Link
                            href={route('register')}
                            className="font-button-text text-sm hover:underline uppercase text-primary transition-colors"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
