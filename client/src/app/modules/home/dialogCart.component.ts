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
  selector: 'DialogCart',
  templateUrl: './dialogCart.component.html',
  styleUrls: ['./home.component.scss', './dialogCart.component.scss'],
  standalone: true,
  imports: [SharedModule, MatCardModule]
})
export default class DialogCart implements OnInit {
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total', 'actions'];
  class: string = ""
  title: string = "Listado de pedidos"

  loading: boolean = false;
  products: any = [];
  dataSource: any = [];
  user: any = null;
  totalPrice: number = 0;

  public notificationService = inject(NotificationImplService);

  constructor(
    public orderService: OrderService,
    public dialogRef: MatDialogRef<DialogCart>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(CartService) private cartService: CartService,
  ) {
  }
  ngOnInit() {

    this.user = this.data.user;
    const [...products] = this.cartService.cart;

    this.updateTotalprice(products);

    this.products = products;
    this.dataSource = new MatTableDataSource(this.products);

  }

  updateTotalprice(products:any){
    this.totalPrice = 0;
    products.forEach((product: any) => {
      product.total = product.quantity_purchased * product.price;
      this.totalPrice += product.total;
    });

  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }
  async create() {
    try {
      this.loading = true;

      const result = await this.orderService.createOrder(this.products);
      if (result.success) {
        this.notificationService.successNotification('Registro de pedido', "El pedido se ha creado correctamente.");
        this.cartService.updateCart([]);
        this.products = [];
        this.dataSource = new MatTableDataSource(this.products);
        this.dialogRef.close('OK');
      } else {
        this.notificationService.errorNotification(result.message);
      }
      
    } catch (error) {
      //hideSpinner()
      //const message = getErrorMessage(error)
      this.notificationService.errorNotification("Un error ha ocurrido durante la creación del pedido. Por favor, intente de nuevo.");
    }
    finally{
      
      this.loading = false;

    }

  }

  addRestProduct(product: any, quantity: number): void {

    if(quantity === 0) {
      this.products = this.products.filter((p: any) => p.id !== product.id);  
      this.dataSource = new MatTableDataSource(this.products);    
    }
    else{

      product.quantity_purchased += quantity;
      if (product.quantity_purchased < 1)
        product.quantity_purchased = 1;
      else if (product.quantity_purchased > product.quantity)
        product.quantity_purchased = product.quantity;
  
      product.total = product.quantity_purchased * product.price;
  
    }
    this.updateTotalprice(this.products);
    this.cartService.updateCart(this.products);
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
