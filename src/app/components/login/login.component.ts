import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      const user = this.authService.getCurrentUser();

      if (user) {
        switch (user.role) {
          case 'super-admin' : this.router.navigate(['/admin']);
          break;
          case 'client' : this.router.navigate(['/client']);
          break;
          case 'entry-operator' : this.router.navigate(['/entry']);
          break;
          case 'exit-operator' : this.router.navigate(['/exit']);
          break;
          default : this.router.navigate(['/dashboard']);
        }
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    }
  }
}
