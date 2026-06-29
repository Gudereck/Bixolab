import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMobileMenuOpen = false;
  isNavbarScrolled = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isNavbarScrolled = window.scrollY > 20;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isNavbarScrolled = window.scrollY > 20;
    }
  }
}
