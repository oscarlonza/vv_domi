import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export default class StoreComponent {

  showFiller = false;
  router = inject(Router);
  rebote = false;
  counter = 0;

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
