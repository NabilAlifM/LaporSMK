import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user as any;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch',
            nama_lengkap: user.nama_lengkap,
            username: user.username,
            email: user.email || '',
            avatar: null as File | null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <section className={className}>
            <header className="mb-6 border-b-4 border-on-surface pb-4">
                <h2 className="font-headline-md text-headline-md uppercase text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>badge</span>
                    Informasi Profil
                </h2>
                <p className="mt-1 font-body-md text-on-surface-variant">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6 flex-1 flex flex-col">
                {/* Avatar Upload */}
                <div className="flex flex-col gap-4 items-start bg-surface-container-lowest p-4 neo-border">
                    <label className="font-label-lg font-bold uppercase">Foto Profil</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 neo-border neo-shadow bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
                            {preview ? (
                                <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="font-button-text text-sm bg-secondary text-on-secondary px-4 py-2 neo-border neo-shadow-sm neo-hover transition-all uppercase"
                            >
                                Pilih Gambar
                            </button>
                            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">JPG, PNG max 2MB</span>
                        </div>
                    </div>
                    <InputError message={errors.avatar} />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nama_lengkap" className="font-label-lg font-bold uppercase">Nama Lengkap</label>
                    <input
                        id="nama_lengkap"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        value={data.nama_lengkap}
                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.nama_lengkap} />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="font-label-lg font-bold uppercase">Username</label>
                    <input
                        id="username"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-label-lg font-bold uppercase">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 font-body-lg"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-error-container/20 p-4 neo-border border-error text-on-surface mt-2">
                        <p className="text-sm font-body-md">
                            Email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline ml-1 font-bold hover:text-primary transition-colors"
                            >
                                Klik di sini untuk mengirim ulang.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-primary">
                                Tautan verifikasi baru telah dikirim!
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 mt-auto pt-6 border-t-2 border-on-surface/10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="font-button-text bg-primary text-on-primary px-8 py-3 neo-border neo-shadow neo-hover transition-all uppercase disabled:opacity-50 text-lg flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>save</span>
                        Simpan Profil
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
