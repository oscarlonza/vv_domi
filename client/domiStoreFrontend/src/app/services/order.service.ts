import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public http: HttpClient) { }

  getOrders(params: any) {
    return this.http.get(`http://localhost:8012/api/orders/paginated?page=${params.page}&limit=${params.size}`);
  }
}
