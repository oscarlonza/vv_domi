import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { orderStatusColors, orderStatusText } from '../../services/functions.service';

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

    console.log(`Open dialog >> ${JSON.stringify({ order, status })}`);

  }
  /*
    openDialogOrder(data: any, action: any) {
      const dialogConfig = new MatDialogConfig();
      data.action = action;
      dialogConfig.data = data;
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '57%';
      dialogConfig.height = "fit-content";
      const dialogRef = this.dialog.open(DialogOrder, dialogConfig);
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (OrdersComponent.switch == 1) {
          this.ngOnInit();
        }
        OrdersComponent.switch = 0;
      });
    }
    static changeValueDialog(value: any) {
      this.switch = value
  
    }
    */
  getOrderStatusColor(status: string): string {
    return orderStatusColors[status] || '#000000'; // Negro por defecto si no se encuentra el estado
  }
  getOrderStatusText(status: string): string {
    return orderStatusText[status] || 'Sin estado'; //
  }

  setOrderStaus(status: string) {
    try {
      this.loading = true;

      /*const result = await this.orderService.createOrder(this.products);
      if (result.success) {
        this.notificationService.successNotification('Registro de pedido', "El pedido se ha creado correctamente.");
        this.cartService.updateCart([]);
        this.products = [];
        this.dataSource = new MatTableDataSource(this.products);
        this.dialogRef.close('OK');
      } else {
        this.notificationService.errorNotification(result.message);
      }*/

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
