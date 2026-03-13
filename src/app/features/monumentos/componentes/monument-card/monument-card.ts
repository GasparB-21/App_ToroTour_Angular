import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Monumento } from '../../models/monumento';

@Component({
  selector: 'app-monument-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './monument-card.html',
  styleUrl: './monument-card.css',
})
export class MonumentCard {
  monumento = input.required<Monumento>();
  //favorito = output

  //FUNCIONALIDADES
  //Añadir la funcionalidad para añadir a favoritos
}
