import { HttpClient, HttpHeaders ,HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public http: HttpClient) { }
  getProducts(params:any){
    console.log('siiiiiiiiiii');
    return this.http.get(`${environment.apiUrl}/products/paginated?page=${params.page}&limit=${params.size}`);
  }
}
