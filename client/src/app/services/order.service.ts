import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private requestsService: RequestService) { }

  async getOrders(): Promise<BasicResponse> {
    const result = await this.requestsService.get(`${environment.apiUrl}/orders`);
    return result;
  }
  async changeStatusOrder(params: any, orderId: string): Promise<BasicResponse> {
    const result = await this.requestsService.putLikeJSON(
      `${environment.apiUrl}/orders/${orderId}`, params
    );
    return result
  }

  async createOrder(products: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/orders`, { products });
    return result;
  }
}
