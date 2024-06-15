import { NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, inject, signal } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import SignupComponent from '../signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getErrorMessage, hideSpinner, showSpinner } from '../../services/functions.service';
type ActionType = 'new' | 'change';

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
    SharedModule,
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
  hide = false;
  validationCode = signal(false);
  static switch: any = 0;
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(private dialog: MatDialog,) {

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
      if (result?.error?.is_verified == false) {
        //TODO LLamar modal de codigo
        this.openVerify({}, 'new');
        console.log('modall');
      } else {
        this.notificationService.errorNotification(result.error.message);
      }
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToStore(): void {
    this.router.navigate(['/store/home']);
  }
  openSignup(data: any, action: string) {
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
  openVerify(data: any, action: string) {
    const dialogConfig = new MatDialogConfig();
    data.action = action;
    dialogConfig.data = data;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '57%';
    dialogConfig.height = "fit-content";
    const dialogRef = this.dialog.open(DialogVerify, dialogConfig);

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
@Component({
  selector: 'DialogVerify',
  templateUrl: './DialogVerify.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule]  // Asumiendo que usas botones en el diáEscudo
})
export class DialogVerify implements OnInit {
  @ViewChild(LoginComponent) team: LoginComponent | undefined;
  actions = {
    new: 'Verificar',
    change: 'Recuperar'
  };
  action!: ActionType;
  title: any = null;
  form: FormGroup
  useLoginForm: boolean = true;
  showPasswordFields: boolean = false;
  passwordForm: FormGroup
  teamData: any = []
  emailUser:any=''
  previewUrl: any = null;
  base64Image: any = null;
  hideCurrent = false;
  hideNew = false;
  public notificationService = inject(NotificationImplService);
  constructor(
    public auth: AuthService,
    public dialogRef: MatDialogRef<DialogVerify>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    /*    private teamService: TeamService */
  ) {
    this.form = this.formBuilder.group({
      ping: ["", [Validators.required]],
    });
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15)]],
      newPassword: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15)]]
    });
  }
  ngOnInit() {
    this.action = this.data?.action;
    this.useLoginForm = this.action === 'new';
    switch (this.action) {
      case 'new':
        this.title = 'Verificar correo';
        break;
      case 'change':
        this.title = 'Recuperar contraseña';
        break;
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  async create() {
    showSpinner();
    if (this.useLoginForm) {
      if (this.form.valid) {
        try {
          const result = await this.auth.verifyUser(this.form.value)
          if (result.success) {
            this.notificationService.successNotification('Verificación de usuario', result.message);
            //await LoginComponent.changeValueDialog(1);
            this.dialogClose();
          } else {
            this.notificationService.errorNotification(result.message);
          }
          hideSpinner()
        } catch (error) {
          hideSpinner()
          const message = getErrorMessage(error)
          this.notificationService.errorNotification(message);
        }
      } else {
        hideSpinner()
        this.notificationService.errorNotification('Todos los campos son obligatorios.');
      }
    } else {
      if (this.passwordForm.valid) {
        if (!this.showPasswordFields) {
          try {
            const result = await this.auth.resetPassword({ email: this.passwordForm.value.email })
            if (result.success) {
              this.notificationService.successNotification('Recuperar contraseña', result.message);
              this.showPasswordFields = true;
              this.passwordForm.get('currentPassword')!.enable();
              this.passwordForm.get('newPassword')!.enable();
              //await LoginComponent.changeValueDialog(1);
              //this.dialogClose();
            } else {
              this.notificationService.errorNotification(result.message);
            }
            hideSpinner()
          } catch (error) {
            hideSpinner()
            const message = getErrorMessage(error)
            this.notificationService.errorNotification(message);
          }
        } else {
          try {
            const resultLogin = await this.auth.login({ email:this.passwordForm.value.email, password: this.passwordForm.value.currentPassword })
            if (resultLogin.success) {
              const result = await this.auth.changePassword({ oldPassword: this.passwordForm.value.currentPassword, newPassword: this.passwordForm.value.newPassword })
              if (result.success) {
                this.notificationService.successNotification('Recuperar contraseña', result.message);
                //await LoginComponent.changeValueDialog(1);
                this.dialogClose();
              } else {
                this.notificationService.errorNotification(result.message);
              }
            }else{
              this.notificationService.errorNotification('Por favor, verifique los datos ingresados.');
            }
            hideSpinner()
          } catch (error) {
            hideSpinner()
            const message = getErrorMessage(error)
            this.notificationService.errorNotification(message);
          }
        }

      } else {
        hideSpinner()
        this.notificationService.errorNotification('Todos los campos son obligatorios.');
      }
    }
  }
  async resendCode() {
    showSpinner();
    try {
      const result = await this.auth.resendCode({})
      if (result.success) {
        this.notificationService.successNotification('Reenvío de codigo', result.message);
        //await LoginComponent.changeValueDialog(1);
        //this.dialogClose();
      } else {
        this.notificationService.errorNotification(result.message);
      }
      hideSpinner()
    } catch (error) {
      hideSpinner()
      const message = getErrorMessage(error)
      this.notificationService.errorNotification(message);
    }
  }
  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type
    });
  }
}
