import { HttpClient, HttpHeaders ,HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public http: HttpClient) { }
  getProducts(params:any){
    console.log('siiiiiiiiiii');
    return this.http.get(`http://localhost:8012/api/products/paginated?page=${params.page}&limit=${params.size}`);
  }
}
