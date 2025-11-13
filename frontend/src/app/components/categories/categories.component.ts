import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor

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

  categories: Category[] = [
    { id: 'code-nerd', name: 'Code & Nerd Humor', icon: 'fa fa-code', description: 'Developer jokes, programming puns, and tech humor', color: 'from-blue-500 to-cyan-500' },
    { id: 'anime-pop', name: 'Anime & Pop Culture', icon: 'fa fa-hand-peace', description: 'Your favorite anime characters and pop culture icons', color: 'from-pink-500 to-purple-500' },
    { id: 'minimal-tech', name: 'Minimal Tech', icon: 'fa fa-microchip', description: 'Clean, minimalist designs for tech enthusiasts', color: 'from-slate-500 to-slate-700' },
    { id: 'gaming-esports', name: 'Gaming & Esports', icon: 'fa fa-gamepad', description: 'Gaming legends, esports teams, and pixel art', color: 'from-green-500 to-emerald-500' },
    { id: 'geeky-memes', name: 'Geeky Memes/Quotes', icon: 'fa fa-laugh', description: 'Internet memes and legendary geek quotes', color: 'from-orange-500 to-red-500' },
    { id: 'limited-editions', name: 'Limited Editions', icon: 'fa fa-star', description: 'Exclusive collabs and limited-run designs', color: 'from-purple-500 to-indigo-500' },
  ];
}

