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
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import SignupComponent from '../signup/signup.component';


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
  public auth = inject(AuthService);
  public notificationService = inject(NotificationImplService);

  validationCode = signal(false);
  static switch: any = 0;
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
constructor(private dialog: MatDialog,){

}
  async signIn() {
    const { email, password } = this.loginForm.value;
    const result = await this.auth.login({ email, password });
    console.log('result', result);
    if (result.success) {
      environment.accessToken = await this.auth.getCookie('token')!;
      const role = result.data.role;
      sessionStorage.setItem('dataUser', JSON.stringify(result.data));
      this.auth.user = JSON.parse(sessionStorage.getItem('dataUser')!);
      console.log('token', environment.accessToken);
      if (role === 'superadmin') {
        this.goToDashboard();
      } else {
        this.goToStore();
      }

    } else {
      this.notificationService.errorNotification(result.error.message);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToStore(): void {
    this.router.navigate(['/store/home']);
  }
  openSignup(data:any,action:string) {
    const dialogConfig = new MatDialogConfig();
    data.action = action;
    dialogConfig.data = data;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '57%';
    dialogConfig.height = "fit-content";
    const dialogRef = this.dialog.open(SignupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (LoginComponent.switch == 1) {
        //this.getProducts();
      }
      LoginComponent.switch = 0;
    });

  }
  static changeValueDialog(value: any) {
    this.switch = value

  }
}
