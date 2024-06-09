import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CodeInputModule } from 'angular-code-input';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
/* import { CodeOtpComponent } from '../../components/code-otp/code-otp.component'; */
import { NotificationImplService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    CodeInputModule,
    MatBottomSheetModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  private _bottomSheet = inject(MatBottomSheet);
  public notificationService = inject(NotificationImplService);

  validationCode = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signIn() {
    if (
      this.loginForm.value.password === '12345' &&
      this.loginForm.value.username === 'admin'
    ) {
      this.openBottomSheet();
    } else {

      this.notificationService.errorNotification(
        'Credenciales inválidas, por favor intente de nuevo.'
      );
    }
  }

  openBottomSheet(): void {
    this.router.navigate(['/dashboard']);
  }
}
