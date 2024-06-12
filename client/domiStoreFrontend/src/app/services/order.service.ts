import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public http: HttpClient) { }

  getOrders(params: any) {
    return this.http.get(`${environment.apiUrl}/orders/paginated?page=${params.page}&limit=${params.size}`);
  }
}
