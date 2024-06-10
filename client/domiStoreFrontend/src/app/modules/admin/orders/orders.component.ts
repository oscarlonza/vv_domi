import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { DialogProduct } from '../products/products.component';
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

  constructor(
    private dialog: MatDialog,
    public orderService: OrderService
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders(this.dataParams).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.dataSource = res;
        this.dataParams.total = res.length;
      },
      error: (err: any) => {
        this.dataSource = [];
        this.dataParams.total = 0;
        console.error('Error fetching data: ', err)
      },
      complete: () => console.log('Data fetching complete')
    });
  }

  applyFilter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  handlePage(e: PageEvent) {
    this.dataParams.size = e.pageSize;
    this.dataParams.page = e.pageIndex + 1;
    this.getOrders();
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

