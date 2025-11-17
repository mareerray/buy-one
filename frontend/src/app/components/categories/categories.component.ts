import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { CATEGORIES } from '../../models/categories.model';

interface Category {
  id: string;
  name: string;
  icon: string; // Instead of ReactNode, pass SVG or CSS class
  description: string;
  color: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CategoriesComponent {
  @Input() onCategoryClick: (categoryId: string) => void = () => {};

  categories = CATEGORIES;
}

