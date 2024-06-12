import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  showFiller = false;
  router = inject(Router);
  rebote = false;
  counter = 0;
  public auth = inject(AuthService);
  ngOnInit(){
    console.log(console.log(this.auth.getCookie('token')));

  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
