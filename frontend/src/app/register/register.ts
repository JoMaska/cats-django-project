import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false
})
export class RegisterComponent {
  username = '';
  password = '';
  confirm = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (this.password !== this.confirm) {
      this.error = 'Пароли не совпадают';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.authService.login(this.username, this.password).subscribe({
          next: () => {
            this.router.navigate(['/cats']);
          },
          error: () => {
            this.error = 'Ошибка входа после регистрации';
          }
        });
      },
      error: () => {
        this.error = 'Пользователь с таким именем уже существует';
      }
    });
  }
}