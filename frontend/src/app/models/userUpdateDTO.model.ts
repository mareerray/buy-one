export interface UserUpdateDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string; // only present if changing
  password?: string; // only present if changing
}
