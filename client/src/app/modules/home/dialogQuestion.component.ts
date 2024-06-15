import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'DialogQuestion',
  templateUrl: './dialogQuestion.component.html',
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogQuestion {
  title: string = "Title";
  description: string = "Description";
  cancelText: string = "Cancel";
  yesText: string = "Yes";
  obj: any;
  constructor(public dialogRef: MatDialogRef<DialogQuestion>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.title = data.title;
    this.description = data.description;
    this.cancelText = data.cancelText;
    this.yesText = data.yesText;
    this.obj = data.obj;
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Cancelar' });
  }
  yesDialog() {
    this.dialogRef.close({ action: 'Sí', obj: this.obj});
  }
}
