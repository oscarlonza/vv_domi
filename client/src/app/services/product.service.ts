import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { resourceUsage } from 'process';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private requestsService: RequestService) { }

  async getProducts(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.get(`${environment.apiUrl}/products/paginated`, params);
    return result;
  }
  async createProduct(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(
      `${environment.apiUrl}/products`, params
    );
    return result
  }
  async updateProduct(params: any, productId: string): Promise<BasicResponse> {
    const result = await this.requestsService.putLikeJSON(
      `${environment.apiUrl}/products/${productId}`, params
    );
    return result
  }
  async deleteProduct(productId: string): Promise<BasicResponse> {
    const result = await this.requestsService.delete(
      `${environment.apiUrl}/products/${productId}`
    );
    return result
  }

  async getProductComments(id: any, pagination: any) {
    const result = await this.requestsService.get(`${environment.apiUrl}/products/${id}/comments/paginated`, pagination);
    return result;
  }
}
