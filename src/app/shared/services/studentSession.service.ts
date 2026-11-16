import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {

  private readonly TIMEOUT = 60 * 60 * 1000; // 60 minutes
  private timeout: any;

  constructor(private router: Router,private authState:AuthStateService) {}

  startSession() {

    const loginTime = new Date().toISOString();

    localStorage.setItem('login_time', loginTime);


    this.startWatching();
    this.resetTimer();
  }

  startWatching() {

    const events = [
      'mousemove',
      'click',
      'keypress',
      'scroll',
      'touchstart'
    ];

    events.forEach(event => {
      window.addEventListener(event, () => {
        this.resetTimer();
      });
    });
  }

  resetTimer() {

    clearTimeout(this.timeout);

    const lastActivity = new Date().toISOString();

    localStorage.setItem('last_activity', lastActivity);


    this.timeout = setTimeout(() => {
      this.logout();
    }, this.TIMEOUT);
  }

  logout() {
    const logoutTime = new Date().toISOString();
        console.log('Session expired at:', logoutTime);
        this.authState.clearTokens();
        this.router.navigate(['/account/login']);
    }
}