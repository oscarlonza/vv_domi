import { HttpClient, HttpHeaders ,HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private requestsService: RequestService) { }
  
  async getProducts(params:any): Promise<BasicResponse>{
    const result= await this.requestsService.get(`${environment.apiUrl}/products/paginated`,params);
    return result;
  }
}
