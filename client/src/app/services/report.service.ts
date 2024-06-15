import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { resourceUsage } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private requestsService: RequestService) { }
  async getTopTen(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.get(`${environment.apiUrl}/orders/topten`, params);
    return result;
  }
  async getTotalPerStatus(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.get(`${environment.apiUrl}/orders/totalperstatus`, params);
    return result;
  }
  async resumeOrder(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.get(`${environment.apiUrl}/orders/resume`, params);
    return result;
  }
}
