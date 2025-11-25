import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { Router } from '@angular/router'; // for routerLink
import { AuthService } from '../../services/auth.service';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HeroComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);

  shopNow() {
    this.router.navigate(['/product-listing']);
  }
  registerSeller() {
    this.authService.logout();
    this.router.navigate(['/signup']);
  }

  browseCreators() {
    this.router.navigate(['/product-listing']);
  }

  heroSlides: HeroSlide[] = [
    {
      id: '1',
      title: 'Quirky Tees, Curated for You',
      subtitle: 'Where creators sell bold designs. Where fans discover unique styles.',
      image: 'assets/images/MarkusClassicPortraitTee1.png',
      // image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200',
      badge: 'Marketplace',
    },
    {
      id: '2',
      title: 'Shop from Creative Sellers',
      subtitle: 'Browse unique tees from talented designers worldwide',
      image: 'assets/images/OppaNotBadMemeTee1.png',
      // image: 'https://images.unsplash.com/photo-1724654814378-108c93f5fa54?w=1200',
    },
    {
      id: '3',
      title: 'Sell Your Designs',
      subtitle: 'Join our marketplace and reach fans looking for quirky, premium tees',
      image: 'assets/images/GroupieTrackerTee1.png',
      // image: 'https://images.unsplash.com/photo-1660900506164-9efffc7a4245?w=1200',
      badge: 'Start Selling',
    },
    {
      id: '4',
      title: 'Where Creators & Fans Connect',
      subtitle: 'A curated marketplace for bold, tech-inspired designs',
      image: 'https://images.unsplash.com/photo-1758179762049-615d9aac58ea?w=1200',
    },
  ];
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }
}
