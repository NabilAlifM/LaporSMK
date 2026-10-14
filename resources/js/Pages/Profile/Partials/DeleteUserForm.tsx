import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`flex flex-col gap-6 ${className}`}>
            <header className="border-b-4 border-on-error-container pb-4">
                <h2 className="font-headline-md text-headline-md uppercase flex items-center gap-2 text-error">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                    Hapus Akun
                </h2>
                <p className="mt-1 font-body-md text-on-error-container opacity-80">
                    Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.
                </p>
            </header>

            <div className="mt-auto pt-6 border-t-2 border-on-error-container/20">
                <button
                    onClick={confirmUserDeletion}
                    className="font-button-text bg-error text-on-error px-8 py-3 neo-border neo-shadow neo-hover transition-all uppercase text-lg flex items-center gap-2"
                >
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>delete_forever</span>
                    Hapus Akun Permanen
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-surface-container-lowest neo-border border-error border-4 flex flex-col gap-6">
                    <div>
                        <h2 className="font-headline-md text-headline-md uppercase text-error flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>dangerous</span>
                            Apakah Anda Yakin?
                        </h2>
                        <p className="mt-2 font-body-md text-on-surface-variant">
                            Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-label-lg font-bold uppercase text-on-surface">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full neo-border neo-shadow-sm bg-surface text-on-surface focus:ring-2 focus:ring-error focus:border-error px-4 py-3 font-body-lg"
                            autoFocus
                            placeholder="Masukkan Password Anda"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-4 mt-4 pt-4 border-t-2 border-on-surface/10">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="font-button-text bg-surface-container-highest text-on-surface px-6 py-2 neo-border shadow-[2px_2px_0px_0px_#171d16] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="font-button-text bg-error text-on-error px-6 py-2 neo-border shadow-[2px_2px_0px_0px_#171d16] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50"
                        >
                            Hapus Akun
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
