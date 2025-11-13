import { Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [RouterModule, CommonModule]
})

export class NavigationComponent {
  isAuthenticated = false;
  currentUserName = '';
  currentUserAvatar = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUserName = user?.name || '';
      this.currentUserAvatar = user?.avatar || '';
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
