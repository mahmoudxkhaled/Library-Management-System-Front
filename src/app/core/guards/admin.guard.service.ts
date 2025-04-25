import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    let userData : any  = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  
        if (user.role == "Admin") {
          return true; // User is authenticated
        }
      }
  
      // Redirect to login if not authenticated
      this.router.navigate(['/auth/login']);
      return false;
  }
}