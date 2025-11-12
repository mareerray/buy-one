import { Injectable } from '@angular/core';

// Define a flat User interface for all user fields
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'seller';
  // joinedDate: string;
  avatar?: string;
  // phone?: string;
  // address?: string;
  // description?: string;
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
      // joinedDate: "2023-01-01T09:00:00Z",
      avatar: papaAvatar,
    },
    {
      id: "USER-002",
      name: "Emily Apple",
      email: "emily@apple.com",
      password: "Emily123!",
      role: "seller",
      // joinedDate: "2023-01-02T09:00:00Z",
      avatar: emilyAvatar,
      // phone: "+49 123 456 7890",
      // address: "Berlin, Germany",
      // description: "Crafting quirky tees for techies and anime fans!",
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
}
