import { Injectable } from '@angular/core';

// DTO for updating users (kept inline to avoid missing module)
export interface UserUpdateDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
}

// Define a flat User interface for all user fields
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'seller';
  avatar?: string;
}

const papaAvatar = 'assets/avatars/papa.jpg';
const emilyAvatar = 'assets/avatars/emily.jpg';

@Injectable({
  providedIn: 'root',
})
export class MockUsersService {

  mockUsers: User[] = [
    {
      id: "USER-001",
      name: "Papa",
      email: "papa@papa.com",
      password: "Papa123!",
      role: "client",
      avatar: papaAvatar,
    },
    {
      id: "USER-002",
      name: "Emily Apple",
      email: "emily@apple.com",
      password: "Emily123!",
      role: "seller",
      avatar: emilyAvatar,
    }
  ];

  authenticateUser(email: string, password: string): User | null {
    return (
      this.mockUsers.find(
        user => user.email === email && user.password === password
      ) || null
    );
  }

  getUserByEmail(email: string): User | null {
    return this.mockUsers.find(user => user.email === email) || null;
  }

  updateUser(dto: UserUpdateDTO): User | null {
    const user = this.mockUsers.find(u => u.id === dto.id);
    if (!user) return null;
    user.name = dto.name;
    user.email = dto.email;
    if (dto.avatar) user.avatar = dto.avatar;
    if (dto.password) user.password = dto.password;
    return user;
  }
}
