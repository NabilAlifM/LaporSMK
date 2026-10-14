import { Config } from 'ziggy-js';

export interface User {
    id_user: number;
    nis_nip: string;
    nama_lengkap: string;
    username: string;
    email: string | null;
    email_verified_at?: string;
    role: 'admin' | 'siswa';
    total_poin: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
