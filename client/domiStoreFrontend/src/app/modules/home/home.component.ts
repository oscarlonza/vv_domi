import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../shared/shared.module';


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

  constructor(private dialog: MatDialog,
    public productService: ProductService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts(this.dataParams).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.products = res.products;
        this.dataParams.total = res.products.length;
      },
      error: (err: any) => {
        this.products = [];
        this.dataParams.total = 0;
        console.error('Error fetching data: ', err)
      },
      complete: () => console.log('Data fetching complete')
    });
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
