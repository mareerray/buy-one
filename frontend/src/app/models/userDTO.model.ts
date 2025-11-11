export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: 'client' | 'seller';
    joinedDate: string;
    avatar?: string;
    phone?: string;
    address?: string;
    description?: string;
}
