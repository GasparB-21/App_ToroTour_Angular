import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Tabbar } from "./core/layout/tabbar/tabbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tabbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  /**
   * Determina si debe mostrar el tabbar
   * No se muestra en: splash (raíz ''), onboarding
   */
  get showTabbar(): boolean {
    const url = this.router.url;
    return url !== '/' && !url.includes('onboarding');
  }
}
