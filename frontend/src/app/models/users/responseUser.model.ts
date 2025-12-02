export interface ResponseUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'seller';
  avatar?: string;
}
