import { Component, ElementRef, HostListener, Inject, inject, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../shared/shared.module';
import { NotificationImplService } from '../../services/notification.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import DialogCart from './dialogCart.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { isScrollNearEnd } from '../../services/functions.service';
import DialogComments from './dialogComments.component';
import MenuComponent  from '../../components/menu/menu.component';
import DialogOrders from './dialogOrders.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CommonModule,MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {

  loading = false;

  products: any = [];

  pagination: any = {
    limit: 20,
    page: 1
  };


  public notificationService = inject(NotificationImplService);
  constructor(private dialog: MatDialog,
    public productService: ProductService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document,
    @Inject(AuthService) public authUser: AuthService,
    @Inject(CartService) public cartService: CartService,
    private el: ElementRef,

  ) {
  }

  async ngOnInit() {
    this.loading = true;
    this.getProducts().finally(() => this.loading = false);

    //Loadind card information
    this.cartService.loadCart();

  }

  async logout() {
    await this.authUser.logout();
    window.location.reload();
  }

  async getProducts() {
    const result = await this.productService.getProducts(this.pagination);
    if (result.success) {
      const { products, ...paginating } = result.data;
      this.pagination = { ...paginating };
      this.products.push(...products);

      this.products.forEach((product: any) => {
        product.quantity_purchased = 1;
      });

    } else {
      this.notificationService.errorNotification('Error en la solicitud');
      this.products = [];
      this.pagination.total = 0;
    }
  }

  isAuthUserAdmin(): boolean {
    return 'superadmin' === this.authUser?.user?.role;
  }

  getUserName() {
    return this.authUser?.user?.name || '';
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { user: this.authUser?.user };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogCart, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.cartService.loadCart();

      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogOrders(): void {

    console.log('Open Orders dialog ');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '260px';

    const dialogRef = this.dialog.open(DialogOrders, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openComents(product: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = product;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = '590px';

    this.dialog.open(DialogComments, dialogConfig);

  }

  goToProductDetail(id: any): void {
    console.log('id', id);
  }

  getDescription(product: any): string {
    const { description } = product;
    if (!description) return '';
    const max: number = 100;
    return description.length > max ? description.substr(0, max) + '...' : description;
  }

  getRatingValue(product: any): number {
    return Number(product.rating);
  }

  getRatingValueFormatted(product: any): string {
    return Number(product.rating).toFixed(2);
  }


  addStar(calificacion: number, item: any): void {
    console.log('calificacion', calificacion);
    console.log('item', item);
  }

  addRestProduct(product: any, quantity: number): void {
    product.quantity_purchased += quantity;
    if (product.quantity_purchased < 1)
      product.quantity_purchased = 1;
    else if (product.quantity_purchased > product.quantity)
      product.quantity_purchased = product.quantity;
  }

  onAddProduct(item: any): void {
    this.cartService.addProductToCart(item);
    this.openSnackBar('Producto agregado al carrito', 'Cerrar', 'success');
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type
    });
  }

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
