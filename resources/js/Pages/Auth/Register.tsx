import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nis_nip: '',
        nama_lengkap: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun" />

            <div className="mb-8 border-b-4 border-on-surface pb-4">
                <h2 className="font-headline-lg text-3xl uppercase text-on-background m-0">Daftar Akun</h2>
                <p className="font-body-md text-on-surface-variant mt-1">Buat akun baru untuk mulai melapor.</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="nis_nip" className="font-label-lg font-bold uppercase">NIS / NIP</label>
                    <input
                        id="nis_nip"
                        name="nis_nip"
                        value={data.nis_nip}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoFocus
                        onChange={(e) => setData('nis_nip', e.target.value)}
                        required
                    />
                    <InputError message={errors.nis_nip} className="mt-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nama_lengkap" className="font-label-lg font-bold uppercase">Nama Lengkap</label>
                    <input
                        id="nama_lengkap"
                        name="nama_lengkap"
                        value={data.nama_lengkap}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                        required
                    />
                    <InputError message={errors.nama_lengkap} className="mt-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="font-label-lg font-bold uppercase">Username</label>
                    <input
                        id="username"
                        name="username"
                        value={data.username}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        onChange={(e) => setData('username', e.target.value)}
                        required
                    />
                    <InputError message={errors.username} className="mt-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-label-lg font-bold uppercase">Email (Opsional)</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password_confirmation" className="font-label-lg font-bold uppercase">Konfirmasi Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="mt-4 flex flex-col items-center gap-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="font-button-text bg-secondary text-on-secondary px-8 py-3 neo-border neo-shadow neo-hover transition-all uppercase disabled:opacity-50 text-lg flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person_add</span>
                        Daftar Akun
                    </button>

                    <div className="flex flex-col items-center gap-2 w-full text-center border-t-2 border-on-surface/10 pt-4">
                        <span className="font-body-sm text-on-surface-variant">Sudah punya akun?</span>
                        <Link
                            href={route('login')}
                            className="font-button-text text-sm hover:underline uppercase text-primary transition-colors"
                        >
                            Masuk Sekarang
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
