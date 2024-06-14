import { Component, ElementRef, HostListener, Inject, inject, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../shared/shared.module';
import { NotificationImplService } from '../../services/notification.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import DialogCart from './cart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {

  private SESSION_USER_KEY = 'dataUser';

  loading = false;
  cart: any = [];
  cartTotal: number = 0;

  products: any = [];

  pagination: any = {
    limit: 20,
    page: 1
  };

  private defaultValue = 30;
  private limitSignal = signal<number>(this.defaultValue);

  private localStorage: any;
  private sessionStorage: any;

  authUser: any = null;

  public notificationService = inject(NotificationImplService);
  constructor(private dialog: MatDialog,
    public productService: ProductService, private el: ElementRef, @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
    this.sessionStorage = document.defaultView?.sessionStorage;
  }

  async ngOnInit() {
    this.loading = true;
    this.getProducts().finally(() => this.loading = false);

    //Loading authentication user data
    const data = this.sessionStorage?.getItem(this.SESSION_USER_KEY);
    this.authUser = data ? JSON.parse(data) : null;

    //Loadind card information
    this.loadCart();

  }

  loadCart(): void {
    const infoCart = this.localStorage?.getItem('cart');
    this.cart = infoCart ? JSON.parse(infoCart) : [];
    this.updateCartTotal();
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

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { products: this.cart, user: this.authUser };
    dialogConfig.data.updateCartEvent = (products: any) => this.updateCart(products);
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogCart, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.loadCart();

      console.log(`Dialog result: ${result}`);
    });
  }

  goToProductDetail(id: any): void {
    console.log('id', id);
  }

  getRatingValue(product: any): number {
    return Number(product.rating);
  }

  getDescription(product: any): string {
    const { description } = product;
    if (!description) return '';
    const max: number = 100;
    return description.length > max ? description.substr(0, max) + '...' : description;
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

    const products = this.cart.filter((x: any) => x.id === item.id);
    if (products.length === 0) {
      const { ...data } = item;
      const product = data;
      this.cart.push(product);
    }
    else {
      const product = products[0];
      product.quantity_purchased += item.quantity_purchased;
      product.quantity_purchased = Math.min(product.quantity_purchased, product.quantity);
    }

    this.updateCart(this.cart);
  }

  public updateCart(products: any[]): void {
    this.localStorage?.setItem('cart', JSON.stringify(this.cart));
    this.loadCart()
    this.updateCartTotal();
  }

  updateCartTotal(): void {
    this.cartTotal = this.cart.reduce((a: number, b: any) => a + b.quantity_purchased, 0);
  }

  private threshold = 800;

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    if (this.loading) return;

    // height of whole window page
    const heightOfWholePage = window.document.documentElement.scrollHeight;

    // how big in pixels the element is
    const heightOfElement = this.el.nativeElement.scrollHeight;

    // currently scrolled Y position
    const currentScrolledY = window.scrollY;

    // height of opened window - shrinks if console is opened
    const innerHeight = window.innerHeight;

    /**
     * the area between the start of the page and when this element is visible
     * in the parent component
     */
    const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

    // calculated whether we are near the end
    const scrollToBottom =
      heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

    // if the user is near end
    if (scrollToBottom < this.threshold) {
      if (this.pagination.page === this.pagination.totalPages) return;

      //this.nearEnd.emit();
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
