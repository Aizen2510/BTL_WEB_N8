// src/services/interfaceUser/User.ts
export namespace UserManagement {
    export interface User {
        id: string;
        username: string;
        email: string;
        password: string;
        avatarUrl?: string;
        role: 'admin' | 'user';
        enabled: boolean;
        status: string; // 'active' | 'inactive'
    }
}
