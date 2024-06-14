import { Component, HostListener, Inject, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { isScrollNearEnd } from '../../services/functions.service';

@Component({
  selector: 'DialogComents',
  templateUrl: './dialogComents.component.html',
  styleUrls: ['./home.component.scss', './dialogComents.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogComents implements OnInit {
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total', 'actions'];
  class: string = ""
  title: string = "Listado de pedidos"

  loading: boolean = false;
  products: any = [];
  dataSource: any = [];
  product: any = null;
  totalPrice: number = 0;

  public notificationService = inject(NotificationImplService);

  constructor(
    public oriderService: OrderService,
    public dialogRef: MatDialogRef<DialogComents>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit() {

    this.product = this.data;
    
    getComments();

  }

  getComments(){
    
  }


  closeDialog() {
    this.dialogRef.close('cancel');
  }

  product: any;
  comments: any = [];

  pagination: any = {
    limit: 20,
    page: 1
  };

  private threshold = 800;
  private defaultValue = 30;
  private limitSignal = signal<number>(this.defaultValue);

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    if (this.loading) return;

    if (isScrollNearEnd(this.el, this.threshold)) {
      if (this.pagination.page === this.pagination.totalPages) return;

      this.pagination.page = this.pagination.page + 1;
      this.pagination.page = Math.min(this.pagination.page, this.pagination.totalPages);

      this.loading = true;

      this.getProducts().finally(() => {
        this.limitSignal.update((val) => val + this.defaultValue);
        this.loading = false;
      });


    }
  }
}
