import { Component, signal, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('bixolab-frontend');
  isMobileMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  initScrollAnimations() {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optional: unobserve if we want it to animate only once
            // observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
          observer.observe(el);
        });
      }, 100);
    }
  }
}
