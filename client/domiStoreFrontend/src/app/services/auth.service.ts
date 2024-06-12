import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient,@Inject(DOCUMENT) private document: Document) { }
  login(params:any){
    const http_options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      }),
    };
    return this.http.post(`http://localhost:8012/api/auth/login`,params,http_options);
  }
  public getCookie(name: string) {
    const cookies = this.document.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}
}
