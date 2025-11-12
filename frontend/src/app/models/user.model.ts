export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'client' | 'seller';
    // joinedDate: string;
    avatar?: string;
    // phone?: string;
    // address?: string;
    // description?: string;
}