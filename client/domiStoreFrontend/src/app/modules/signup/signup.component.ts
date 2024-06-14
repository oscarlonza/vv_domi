import { Component, Inject, ViewChild, inject } from '@angular/core';
import LoginComponent from '../login/login.component';
import { NotificationImplService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { getErrorMessage, hideSpinner, showSpinner } from '../../services/functions.service';
type ActionType = 'new';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export default class SignupComponent {
  @ViewChild(LoginComponent) team: LoginComponent | undefined;
  actions = {
    new: 'Registrar'
  };
  action!: ActionType;
  title: any = null;
  form: FormGroup
  hide = false;
  teamData: any = []
  previewUrl: any = null;
  public notificationService = inject(NotificationImplService);
  constructor(
    public auth: AuthService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    /*    private teamService: TeamService */
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["",[Validators.required, Validators.email]],
      password: ["",
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15)]
      ],
      address: ["", [Validators.required]]
    });
  }
  ngOnInit() {
    this.action = this.data?.action;
    switch (this.action) {
      case 'new':
        this.title = 'Registrate';
        break;
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  async create() {
    showSpinner();
    if (this.form.valid) {
      try {
        const result = await this.auth.register(this.form.value)
        if (result.success) {
          this.notificationService.successNotification('Registro de usuario', 'Usuario creado con éxito.');
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
    }else{
      hideSpinner()
      this.notificationService.errorNotification('Todos los campos son obligatorios.');
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
