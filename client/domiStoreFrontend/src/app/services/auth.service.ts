import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }
  login(params: any) {
    const http_options = {
      headers: new HttpHeaders({
        // Ejemplo: si necesitas enviar un contenido tipo JSON
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
    };
    return this.http.post(`http://localhost:8012/api/auth/login`, params);
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
