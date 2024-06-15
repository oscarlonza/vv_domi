import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { DialogProduct } from '../products/products.component';
import { NotificationImplService } from '../../../services/notification.service';
import { getErrorMessage, hideSpinner, orderStatusColors, orderStatusText, showSpinner } from '../../../../app/services/functions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
type ActionType = 'change' | 'accept' | 'reject';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [SharedModule, HttpClientModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export default class OrdersComponent {
  displayedColumns: string[] = ['order', 'client', 'value', 'state', 'actions'];
  class: string = ""
  title: string = "Listado de pedidos"
  pageSizeOptions: number[] = [10, 20, 50, 100]
  description: string = "Seleccione un registro para modificar"
  static switch: any = 0;
  dataSource: any = [];
  dataParams: any = {
    total: 0,
    size: 10,
    page: 1
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public notificationService = inject(NotificationImplService);
  constructor(
    private dialog: MatDialog,
    public orderService: OrderService
  ) { }

  async ngOnInit() {
    await this.getOrders();
  }
  ngAfterViewInit() {
    //console.log(window.document.documentElement.scrollHeight);
    this.dataSource.paginator = this.paginator;
  }
  async getOrders() {
    try {
      const result = await this.orderService.getOrders();
      if (result.success) {
        this.dataSource = new MatTableDataSource(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataParams.total = result.data.length;
      } else {
        this.notificationService.errorNotification('Error en la solicitud');
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataParams.total = 0;
      }
    } catch (error) {
      const message = getErrorMessage(error)
      this.notificationService.errorNotification(message)
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
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
  getOrderStatusColor(status: string): string {
    return orderStatusColors[status] || '#000000'; // Negro por defecto si no se encuentra el estado
  }
  getOrderStatusText(status: string): string {
    return orderStatusText[status] || 'Sin estado'; //
  }
}

@Component({
  selector: 'DialogOrder',
  templateUrl: './DialogOrder.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [SharedModule]  // Asumiendo que usas botones en el diáEscudo
})
export class DialogOrder implements OnInit {
  @ViewChild(OrdersComponent) team: OrdersComponent | undefined;
  actions = {
    change: 'Cambiar',
    accept: 'Aceptar',
    reject: 'Rechazar',
  };
  action!: ActionType;
  title: any = null;
  form: FormGroup
  teamData: any = []
  status: any = [
    { english: 'preparing', spanish: 'Preparando' },
    { english: 'delivered', spanish: 'Enviado' },
    { english: 'rejected', spanish: 'Rechazado' }];
  previewUrl: any = null;
  public notificationService = inject(NotificationImplService);
  constructor(
    public orderService: OrderService,
    public dialogRef: MatDialogRef<DialogOrder>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    /*    private teamService: TeamService */
  ) {
    this.form = this.formBuilder.group({
      status: ["", [Validators.required]],
    });
  }
  ngOnInit() {
    this.action = this.data?.action;
    switch (this.action) {
      case 'change':
        this.title = 'Cambiar estado';
        this.form.setValue({
          status: this.data.status
        })
        break;
      case 'accept':
        this.title = 'Aceptar pedido';
        break;
      case 'reject':
        this.title = 'Rechazar pedido';
        break;
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  async create() {
    showSpinner();
    try {
      if (this.action == 'accept') {
        this.form.setValue({
          status: 'preparing'
        })
      } else if (this.action == 'reject') {
        this.form.setValue({
          status: 'rejected'
        })
      }
      const result = await this.orderService.changeStatusOrder(this.form.value, this.data.id)
      if (result.success) {
        this.notificationService.successNotification('Cambio de estado', result.message);
        await OrdersComponent.changeValueDialog(1);
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
