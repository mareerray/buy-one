import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [RouterModule, CommonModule]
})
export class NavigationComponent {
  @Input() isAuthenticated = false;
  @Input() userRole: 'client' | 'seller' | null = null;
  @Input() currentUserName = '';
}
