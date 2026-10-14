import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-6 border-b-4 border-on-surface pb-4">
                <h2 className="font-headline-md text-headline-md uppercase text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>password</span>
                    Ganti Password
                </h2>
                <p className="mt-1 font-body-md text-on-surface-variant">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6 flex-1 flex flex-col">
                <div className="flex flex-col gap-1">
                    <label htmlFor="current_password" className="font-label-lg font-bold uppercase">Password Saat Ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-label-lg font-bold uppercase">Password Baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password_confirmation" className="font-label-lg font-bold uppercase">Konfirmasi Password Baru</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t-2 border-on-surface/10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="font-button-text bg-primary text-on-primary px-8 py-3 neo-border neo-shadow neo-hover transition-all uppercase disabled:opacity-50 text-lg flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>key</span>
                        Simpan Password
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="font-label-mono text-sm text-primary font-bold px-3 py-2 bg-primary/10 neo-border border-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                            BERHASIL
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
