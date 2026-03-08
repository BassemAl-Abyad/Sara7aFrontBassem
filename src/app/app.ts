import { Component, signal, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var google: any;

class AuthService {
  private http = inject(HttpClient);

  googleLogin(idToken: string) {
    return this.http
      .post('http://localhost:3000/api/auth/social-login', { idToken })
      .subscribe((res) => {
        console.log('Google login response:', res);
      });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [AuthService],
})
export class App implements AfterViewInit {
  protected readonly title = signal('Sara7aFrontBassem');
  user: any | null = null;

  constructor(private authService: AuthService) {}

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    console.log('Google object:', typeof google);

    if (typeof google !== 'undefined') {
      console.log('Initializing Google Sign-In...');
      google.accounts.id.initialize({
        client_id: '235164484876-mh1vf12t1bruk9f2tv5qj643rrkfrpn2.apps.googleusercontent.com',
        callback: async (response: any) => {
          console.log('ID TOKEN:', response.credential);
          this.authService.googleLogin(response.credential);
          //Send token to backend
        },
      });

      const element = document.getElementById('google-btn');
      console.log('Google button element:', element);

      if (element) {
        google.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
        });
        console.log('Google button rendered');
      } else {
        console.error('Google button element not found');
      }
    } else {
      console.error('Google object not available');
    }
  }
}
