import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { orderStatusColors, orderStatusText } from '../../services/functions.service';
import DialogQuestion from './dialogQuestion.component';

@Component({
  selector: 'DialogOrders',
  templateUrl: './dialogOrders.component.html',
  styleUrls: ['./home.component.scss', './dialogOrders.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogOrders implements OnInit {
  displayedColumns: string[] = ['order', 'client', 'value', 'state', 'actions'];
  class: string = ""
  title: string = "Listado de pedidos"
  loading: boolean = false;

  dataSource: any = [];

  public notificationService = inject(NotificationImplService);
  constructor(
    private dialog: MatDialog,
    notificationService: NotificationImplService,
    public orderService: OrderService,
    public dialogRef: MatDialogRef<DialogOrders>
  ) {
  }

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    this.loading = true;
    const result = await this.orderService.getOrders();

    if (result.success) {
      this.dataSource = new MatTableDataSource(result.data);
    } else {
      this.notificationService.errorNotification('Error en la solicitud');
      this.dataSource = new MatTableDataSource([]);
    }

    this.loading = false;
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }

  openDialogOrder(order: any, status: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Cambio de estado',
      description: '¿Está seguro de cambiar el estado del pedido?',
      cancelText: 'No',
      yesText: 'Sí',
      obj: { status, order },
    }
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(DialogQuestion, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {

      const { action, obj } = result;

      if ('Sí' === action) {
        await this.setOrderStatus(obj.status, obj.order);
      }
    });
  }

  getOrderStatusColor(status: string): string {
    return orderStatusColors[status] || '#000000'; // Negro por defecto si no se encuentra el estado
  }
  getOrderStatusText(status: string): string {
    return orderStatusText[status] || 'Sin estado'; //
  }

  async setOrderStatus(status: string, order: any) {
    try {
      this.loading = true;

      console.log("OK Change estatus");
      const result = await this.orderService.changeStatusOrder({ status }, order.id);
      if (result.success) {
        order.status = status;
        this.notificationService.successNotification('Registro de pedido', "El estado se ha cambiado satisfactoriamente.");
      } else {
        this.notificationService.errorNotification(result.message);
      }

    } catch (error) {
      //hideSpinner()
      //const message = getErrorMessage(error)
      this.notificationService.errorNotification("Un error ha ocurrido durante la creación del pedido. Por favor, intente de nuevo.");
    }
    finally {

      this.loading = false;

    }
  }

}
