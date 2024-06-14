import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, inject, OnInit, signal } from '@angular/core';
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
import { CdkScrollable, ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'DialogComments',
  templateUrl: './dialogComments.component.html',
  styleUrls: ['./home.component.scss', './dialogComments.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule, ScrollingModule]
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
    public scrollDispatcher: ScrollDispatcher,
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ) {
    this.scrollDispatcher.scrolled().subscribe((event: any) => {
      this.onScroll(event);
    });
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

      console.log(`Total comments ${this.comments.length}`);
      console.log(`Comments > ${JSON.stringify(this.comments)}`);

    } else {
      this.notificationService.errorNotification('Error en la solicitud');
      this.comments = [];
      this.pagination.total = 0;
    }
  }

  getRatingValue(rating: any): number {
    return Number(rating);
  }

  getRatingValueFormatted(): string {
    return Number(this.product.rating).toFixed(2);
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }

  commentsExist(): boolean {
    return this.comments ? this.comments.length > 0 : false;
  }

  private threshold = 800;
  private defaultValue = 30;
  private limitSignal = signal<number>(this.defaultValue);

  private onScroll(event: any): void {

    if (!event || this.loading) return;

    const { scrollTop, scrollHeight } = event.elementRef.nativeElement;
    const abs = Math.abs(scrollHeight - scrollTop);

    if (abs < this.threshold) {

      if (this.pagination.page === this.pagination.totalPages) return;

      this.pagination.page = this.pagination.page + 1;
      this.pagination.page = Math.min(this.pagination.page, this.pagination.totalPages);

      this.loading = true;

      this.getComments().finally(() => {
        this.limitSignal.update((val) => val + this.defaultValue);
        this.loading = false;
        this.cdr.detectChanges();
      });


    }
  }
}
