import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
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

  constructor(){}

  ngOnInit(){}

  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required]),
    password : new FormControl('',[Validators.required])
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

    if(loginRes.email == 'admin' && loginRes.password == 'admin@123'){
      alert('login successfully');
      this.isLoading = false;
    }else{
      alert('login failed');
      this.isLoading = false;
    }
      
      // this.isLoading = false;
      
      // Show success message or redirect
      // alert('Login functionality - integrate with your backend');
    }, 1500);
  }
}
