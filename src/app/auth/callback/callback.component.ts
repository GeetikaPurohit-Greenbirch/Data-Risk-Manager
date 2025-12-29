import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
// import { AuthService } from '../auth.service';
import { UserService } from 'src/app/features/shared-services/user.service';

@Component({
  selector: 'app-callback',
  template: '<p>Logging in...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService,private router: Router,private userService : UserService) {}

//   ngOnInit(): void {

// debugger;
//     // this.authService.handleRedirectCallback();
//     this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
//       if (isAuthenticated) {
//         // Check for saved redirect URL
//         const redirectUrl = localStorage.getItem('redirectUrl');
        
//         if (redirectUrl) {
//           localStorage.removeItem('redirectUrl'); // Clear after usage
//           this.router.navigateByUrl(redirectUrl); // Redirect to saved URL
//         } else {
//           this.router.navigate(['/home']); // Fallback if no URL is stored
//         }
//       }
//     });
//   }

ngOnInit(): void {
  this.authService.handleRedirectCallback().subscribe({
    next: () => {
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
          const redirectUrl = localStorage.getItem('redirectUrl');
          this.router.navigateByUrl(redirectUrl || '/home');
        }
      });
    },
    error: err => {
      console.error('Auth callback error', err);
      this.router.navigate(['/login']);
    }
  });
}

}
