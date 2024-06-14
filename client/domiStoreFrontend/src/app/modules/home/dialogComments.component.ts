import { Component, ElementRef, HostListener, Inject, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { isScrollNearEnd } from '../../services/functions.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'DialogComments',
  templateUrl: './dialogComments.component.html',
  styleUrls: ['./home.component.scss', './dialogComments.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogComments implements OnInit {
  loading: boolean = false;

  product: any;
  comments: any = [];

  pagination: any = {
    limit: 20,
    page: 1
  };

  public notificationService = inject(NotificationImplService);

  constructor(
    public productService: ProductService,
    public dialogRef: MatDialogRef<DialogComments>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private el: ElementRef
  ) {
  }
  ngOnInit() {

    this.product = this.data;

    this.loading = true;
    this.getComments().finally(() => this.loading = false);

  }

  async getComments() {
    const result = await this.productService.getProductComments(this.product.id, this.pagination);
    if (result.success) {
      const { comments, ...paginating } = result.data;
      this.pagination = { ...paginating };
      this.comments.push(...comments);
    } else {
      this.notificationService.errorNotification('Error en la solicitud');
      this.comments = [];
      this.pagination.total = 0;
    }
  }

  getRatingValue(rating:any): number {
    return Number(rating);
  }

  getRatingValueFormatted(): string {
    return Number(this.product.rating).toFixed(2);
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }


  private threshold = 800;
  private defaultValue = 30;
  private limitSignal = signal<number>(this.defaultValue);

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    if (this.loading) return;

    if (isScrollNearEnd(this.el, this.threshold)) {

      console.log('Ready to get comments >> ');
      if (this.pagination.page === this.pagination.totalPages) return;

      this.pagination.page = this.pagination.page + 1;
      this.pagination.page = Math.min(this.pagination.page, this.pagination.totalPages);

      this.loading = true;

      this.getComments().finally(() => {
        this.limitSignal.update((val) => val + this.defaultValue);
        this.loading = false;
      });


    }
  }
}
