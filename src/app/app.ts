import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Header } from './header/header';
import { Hero } from './hero/hero';
import { ComoFunciona } from './como-funciona/como-funciona';
import { Galeria } from './galeria/galeria';
import { Collab } from './collab/collab';
import { Orcamento } from './orcamento/orcamento';
import { OLab } from './o-lab/o-lab';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Hero, ComoFunciona, Galeria, Collab, Orcamento, OLab, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  initScrollAnimations() {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
          observer.observe(el);
        });
      }, 100);
    }
  }
}
