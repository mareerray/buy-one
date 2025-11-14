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
const emilyAvatar = 'assets/avatars/emily.jpg'; //002
const johnAvatar = 'assets/avatars/koaladrinkscoffee.webp'; //004
const sarahAvatar = 'assets/avatars/panda.webp'; //006

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
    },
    {
      id: "USER-004",
      name: "John Doe",
      email: "john@doe.com",
      password: "John123!",
      role: "seller",
      avatar: johnAvatar,
    },
      {
      id: "USER-006",
      name: "Sarah Lee",
      email: "sarah@lee.com",
      password: "Sarah123!",
      role: "seller",
      avatar: sarahAvatar,
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
