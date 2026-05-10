import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Banner } from './shared/layout/banner/banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, Banner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  /**
   * Determina si debe mostrar el banner y la navegación
   * No se muestra en: splash (raíz ''), onboarding, detalles
   */
  get showBanner(): boolean {
    const url = this.router.url;
    return url !== '/' && !url.includes('onboarding') && !url.includes('detalles');
  }
}
