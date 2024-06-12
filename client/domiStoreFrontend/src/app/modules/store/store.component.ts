import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../home/header/header.component';
import { NavComponent } from '../home/nav/nav.component';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterModule, HeaderComponent, NavComponent, FooterComponent],
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
