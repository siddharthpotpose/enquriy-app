import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Route, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMobileMenuOpen : boolean= false;
  currentRoute = 'home';
  userName = signal<any>('');

  isLoggedIn = signal<boolean>(false);

   

  constructor(public route: Router){
    this.userName.set( localStorage.getItem('emailId'));
    // alert(this.userName);
  }

  ngOnInit(){
     this.checkLogin();
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


   

  checkLogin(){
    const user = localStorage.getItem('emailId');
    if(user){
       this.isLoggedIn.set(true);
       this.userName.set(user);
    }else{
      this.isLoggedIn.set(false);
      this.userName.set('');
    }
  }

  logOut(){
    localStorage.removeItem('loginUser');
    localStorage.removeItem('emailId');
    localStorage.removeItem('token')
    this.isLoggedIn.set(false);
    this.userName.set('');
    // Dispatch custom event to notify same-tab listeners
    window.dispatchEvent(new Event('login-state-change'));
    this.route.navigateByUrl('/home')
  }



 
}
