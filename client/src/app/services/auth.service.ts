import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  router = inject(Router);
  constructor(private requestsService: RequestService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem('dataUser') != null) {
        this.user = JSON.parse(sessionStorage.getItem('dataUser')!);
      }
    }
  }
  async login(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/login`, params);
    return result;
  }
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    console.log('values', value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift(); // Usamos el operador de encadenamiento opcional
      return cookieValue ?? null; // Usamos coalescencia nula para convertir 'undefined' en 'null'
    }
    return null;
  }
  async logout() {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/logout`, {});
    console.log('logout',result);
    sessionStorage.clear()
    this.user = undefined;
    this.router.navigate(['/store/home']);
  }
  async register(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/register`, params);
    return result;
  }
  async verifyUser(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/verify`, params);
    return result;
  }
  async resendCode(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/resendcode`, params);
    return result;
  }
  async resetPassword(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/resetpassword`, params);
    return result;
  }
  async changePassword(params: any): Promise<BasicResponse> {
    const result = await this.requestsService.postLikeJSON(`${environment.apiUrl}/auth/changepassword`, params);
    return result;
  }
}
