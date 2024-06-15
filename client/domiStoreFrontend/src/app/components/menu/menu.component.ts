import { Component } from '@angular/core';
import { SharedModule } from '../../modules/shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { DialogVerify } from '../../modules/login/login.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export default class MenuComponent {
  static switch: any = 0;
  constructor(public auth: AuthService,private dialog: MatDialog,){

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
      if (MenuComponent.switch == 1) {
        this.auth.logout();
      }
      MenuComponent.switch = 0;
    });

  }
  static changeValueDialog(value: any) {
    this.switch = value

  }
}
