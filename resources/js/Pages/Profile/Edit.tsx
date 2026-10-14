import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user as any;
    const isPending = user?.status === 'pending';

    return (
        <>
            <Head title="Profil Saya" />

            <div className="flex flex-col gap-gutter mt-6">
                {isPending && (
                    <div className="bg-warning text-on-warning p-6 neo-border neo-shadow flex items-start gap-4 uppercase font-bold text-lg mb-4">
                        <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl">Akses Ditahan: Menunggu Validasi Admin</span>
                            <span className="font-body-md normal-case font-medium">Akun Anda sedang dalam peninjauan oleh Admin untuk memastikan Anda adalah siswa terdaftar. Anda belum dapat menggunakan fitur Komin sebelum akun divalidasi.</span>
                        </div>
                    </div>
                )}

                <section className="bg-surface-container-lowest p-6 lg:p-8 neo-border neo-shadow-lg flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b-4 border-on-background pb-3">
                        <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>account_box</span>
                        <h2 className="font-headline-lg text-headline-lg uppercase text-on-background m-0 leading-none">
                            Pengaturan Profil
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="bg-surface p-6 neo-border neo-shadow flex flex-col h-full"
                            />
                        </div>
                        <div className="flex flex-col gap-8">
                            <UpdatePasswordForm className="bg-surface p-6 neo-border neo-shadow flex-1" />
                            <DeleteUserForm className="bg-error-container text-on-error-container p-6 neo-border neo-shadow flex-1" />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

Edit.layout = (page: any) => <AuthenticatedLayout activeTab="profile">{page}</AuthenticatedLayout>;
