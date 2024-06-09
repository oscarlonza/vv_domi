import { Injectable, inject } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationImplService {
  constructor() {}

  successNotification(title: string, text: string) {
    Swal.fire({
      position: 'top-end',
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Ok',
      timer: 1500,
      timerProgressBar: true,
    });
  }

  errorNotification(text: string) {
    Swal.fire({
      position: 'top-end',
      title: 'Error!',
      text,
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
    });
  }
}
