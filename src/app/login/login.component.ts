import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginService } from '../service/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  responsedata: any;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private service: LoginService, private router: Router) {
    localStorage.clear();
    // Initialize the form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters for form controls
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Example method to set an error message
  handleLoginError() {
    this.errorMessage = 'Invalid username or password';
  }

  // Method to clear the error message
  clearError() {
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.service.onSubmit(loginData).subscribe({
        next: (result) => {
          this.responsedata = result;
          if (this.responsedata != null && this.responsedata.token) {
            // Store the token in local storage
            localStorage.setItem('token', this.responsedata.token);
  
            // Show success message with an alert
            alert('Successfully logged in!');
  
            // Navigate to the business search page
            this.router.navigateByUrl('/Businesssearch');
          } else {
            // If token is not available, show a failed login message
            alert('Login Failed!');
          }
        },
        error: (error) => {
          // Handle HTTP error responses like Unauthorized (401)
          if (error.status === 401) {
            alert('Incorrect username or password. Unauthorized!');
          } else {
            // Generic error message for any other errors
            alert('An error occurred during login. Please try again.');
          }
        }
      });
    } else {
      alert('Enter valid data!');
    }
  }
}
