import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = false;
  isMobileMenuOpen = false;
  currentRoute = 'home';
  userName = 'John Doe';

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleLoginState(): void {
    this.isLoggedIn = !this.isLoggedIn;
  }

  setRoute(route: string): void {
    this.currentRoute = route;
    this.isMobileMenuOpen = false;
  }
}
