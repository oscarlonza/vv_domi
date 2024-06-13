import { Component, ViewChild, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { DialogProduct } from '../products/products.component';
import { NotificationImplService } from '../../../services/notification.service';
type ActionType = 'new' | 'edit' | 'delete';

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
    const result = await this.orderService.getOrders();
    console.log('orders',result.data);
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialogProduct(data: any, action: any) {
    const dialogConfig = new MatDialogConfig();
    data.action = action;
    dialogConfig.data = data;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '57%';
    dialogConfig.height = "fit-content";
    const dialogRef = this.dialog.open(DialogProduct, dialogConfig);

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
}

