import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../shared/shared.module';
import { NotificationImplService } from '../../services/notification.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {

  products: any = [];

  dataParams: any = {
    total: 0,
    size: 10,
    page: 1
  };
  public notificationService = inject(NotificationImplService);
  constructor(private dialog: MatDialog,
    public productService: ProductService
  ) { }

  async ngOnInit() {
    await this.getProducts();
  }

  async getProducts() {
    const result = await this.productService.getProducts(this.dataParams);
    if (result.success) {
      this.products = result.data.products;
      this.dataParams.total = result.data.products.length;
    } else {
      this.notificationService.errorNotification('Error en la solicitud');
      this.products = [];
      this.dataParams.total = 0;
    }
  }

  openDialog(data: any): void {
    console.log('data', data);
  }

  goToProductDetail(id: any): void {
    console.log('id', id);
  }

  addStar(calificacion: number, item: any): void {
    console.log('calificacion', calificacion);
    console.log('item', item);
  }

  goToBuy(item: any): void {
    console.log('item', item);
  }

}
