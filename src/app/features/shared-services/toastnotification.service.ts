import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastnotificationService {

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',  // Only used to keep config valid
    verticalPosition: 'top',
    panelClass: ['custom-snackbar-overlay']  // Default class
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000): void {
    this.show(message, duration, ['custom-snackbar-overlay', 'snackbar-success']);
  }

  error(message: string, duration: number = 3000): void {
    this.show(message, duration, ['custom-snackbar-overlay', 'snackbar-error']);
  }

  info(message: string, duration: number = 3000): void {
    this.show(message, duration, ['custom-snackbar-overlay', 'snackbar-info']);
  }

  warn(message: string, duration: number = 3000): void {
    this.show(message, duration, ['custom-snackbar-overlay', 'snackbar-warn']);
  }

  private show(message: string, duration: number, panelClass: string[]): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass
    };
    this.snackBar.open(message, 'Close', config);
  }
}
