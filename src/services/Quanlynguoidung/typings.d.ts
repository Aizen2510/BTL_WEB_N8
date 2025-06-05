declare module UserManagement {
    export interface User {
        id: string;
        username: string;// hien thi o pro file
        password: string;
        role: 'user';
        enabled: boolean;
        email: string; // hien thi o pro file
        avatarUrl?: string; // hien thi o pro file
        downloadCount: number; // hien thi o pro file
        uploadCount: number; // hien thi o pro file
        status: 'active' | 'inactive'; // hien thi o pro file
    }
}