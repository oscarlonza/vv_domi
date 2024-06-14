import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationImplService } from '../../services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'DialogCart',
  templateUrl: './cart.component.html',
  styleUrls: ['./home.component.scss', './cart.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogCart implements OnInit {
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total', 'actions'];
  class: string = ""
  title: string = "Listado de pedidos"

  products: any = [];
  user: any = null;
  totalPrice: number = 0;
  public notificationService = inject(NotificationImplService);

  updateCartEvent: any;

  constructor(
    public oriderService: OrderService,
    public dialogRef: MatDialogRef<DialogCart>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {

    this.user = this.data.user;
    const products = this.data.products;
    this.updateCartEvent = (products: any) => this.data.updateCartEvent(products);

    products.forEach((product: any) => {
      product.total = product.quantity_purchased * product.price;
      this.totalPrice += product.total;
    });

    this.products = new MatTableDataSource(products);

  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }
  async create() {
    try {
      //const result = await this.productService.deleteProduct(this.data.id)
      //if (result.success) {
      //  this.notificationService.successNotification('Eliminación de productos', result.message);
      //  await ProductsComponent.changeValueDialog(1);
      //  this.closeDialog('OK');
      //} else {
      //  this.notificationService.errorNotification('Error en la eliminación de producto.');
      //}
      //hideSpinner()

      this.notificationService.successNotification("TITLE", "OK");
    } catch (error) {
      //hideSpinner()
      //const message = getErrorMessage(error)
      this.notificationService.errorNotification("Fail");
    }

  }

  addRestProduct(product: any, quantity: number): void {
    product.quantity_purchased += quantity;
    if (product.quantity < 1)
      product.quantity_purchased = 1;
    else if (product.quantity_purchased > product.quantity)
      product.quantity_purchased = product.quantity;

    product.total = product.quantity_purchased * product.price;

    this.updateCartEvent(this.products);
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
