export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'client' | 'seller';
    avatar?: string;
}