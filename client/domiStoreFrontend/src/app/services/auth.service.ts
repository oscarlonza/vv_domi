import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private requestsService: RequestService) { }
  async login(params: any): Promise<BasicResponse> {
    const result= await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/login`, params,{},true);
    return result;
  }
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    console.log('values',value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift(); // Usamos el operador de encadenamiento opcional
        return cookieValue ?? null; // Usamos coalescencia nula para convertir 'undefined' en 'null'
    }
    return null;
}


}
