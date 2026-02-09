import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServices } from '../service/all-services';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None // Ensures styles apply globally
})
export class Login {
  // Form properties
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  // UI state
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(public route: Router, private service: AllServices) { }

  ngOnInit() {

  }

  loginForm = new FormGroup({
    emailId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  /**
   * Toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // if (!this.email || !this.password) {
    //   return;
    // }

    this.isLoading = true;

    // Simulate login - replace with actual authentication logic
    setTimeout(() => {
      const loginRes = this.loginForm.value;
      // hard coded login

      // if(loginRes.emailId == 'admin' && loginRes.password == 'admin@123'){
      //   alert('login successfully');
      //   this.isLoading = false;
      //   localStorage.setItem('loginuser','admin');
      //   // Dispatch custom event to notify header component in same tab
      //   window.dispatchEvent(new Event('login-state-change'));
      //   this.route.navigateByUrl('/dashboard');
      // }else{
      //   alert('login failed');
      //   this.isLoading = false;
      // }
      // ----------------------------------------- 

      //api integrated

      this.service.login(loginRes).subscribe({
        next: (res: any) => {
          console.log('Login API Response:', res); // Debug: Check the full response
          alert(res.message);
          localStorage.setItem('loginUser', res.data.userId);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('emailId',res.data.emailId)
          console.log('Token stored:', localStorage.getItem('token')); // Debug: Verify token is stored
          this.isLoading = false;
          // Dispatch custom event to notify header component in same tab
          window.dispatchEvent(new Event('login-state-change'));
          this.route.navigateByUrl('/dashboard');
        }, error(err: any) {
          console.error('Login Error:', err); // Debug: Check for errors
          alert(err.message);
          //  this.isLoading = false;
        }
      })

    }, 1500);
    // this.isLoading = false;

  }



}
