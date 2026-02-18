import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AlertService } from '../../share/alert/alert.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isMobileMenuOpen : boolean= false;
  currentRoute = 'home';
  userName = signal<any>('');

  isLoggedIn = signal<boolean>(false);

   

  constructor(public route: Router, private alert : AlertService){
    this.userName.set( localStorage.getItem('emailId'));
    // alert(this.userName);
  }

  ngOnInit(){
     this.checkLogin();
     this.currentRoute = this.getRouteFromUrl(this.route.url);

     this.route.events
       .pipe(filter(event => event instanceof NavigationEnd))
       .subscribe((event: any) => {
         this.currentRoute = this.getRouteFromUrl(event.urlAfterRedirects || event.url);
         this.isMobileMenuOpen = false;
       });

     // Listen for storage events (cross-tab)
     window.addEventListener('storage',()=>{this.checkLogin()});
     // Listen for custom login state change events (same tab)
     window.addEventListener('login-state-change', () => {
       this.checkLogin();
     });
   }


  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleLoginState(): void {
    this.isLoggedIn.set(!this.isLoggedIn);
  }

  setRoute(route: string): void {
    this.currentRoute = route;
    this.isMobileMenuOpen = false;
  }

  scrollToSection(sectionId: string): void {
    this.currentRoute = sectionId;
    this.isMobileMenuOpen = false;
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }


   

  checkLogin(){
    const user = localStorage.getItem('emailId');
    if(user){
       this.isLoggedIn.set(true);
       this.userName.set(user);
    }else{
      this.isLoggedIn.set(false);
      this.userName.set('');
    }
    this.isMobileMenuOpen = false;
  }

  logOut(){
    localStorage.removeItem('loginUser');
    localStorage.removeItem('emailId');
    localStorage.removeItem('token')
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.isMobileMenuOpen = false;
    this.alert.success('logout successfully')
    // Dispatch custom event to notify same-tab listeners
    window.dispatchEvent(new Event('login-state-change'));
    this.route.navigateByUrl('/home')
  }

  private getRouteFromUrl(url: string): string {
    const cleanUrl = (url || '').split('?')[0].split('#')[0].replace(/^\//, '');
    if (cleanUrl.startsWith('dashboard')) return 'dashboard';
    if (cleanUrl.startsWith('enquirydetails')) return 'enquirydetails';
    if (cleanUrl.startsWith('category')) return 'categories';
    if (cleanUrl.startsWith('submitenquiry')) return 'submitenquiry';
    if (cleanUrl.startsWith('login')) return 'login';
    return 'home';
  }


 
}
