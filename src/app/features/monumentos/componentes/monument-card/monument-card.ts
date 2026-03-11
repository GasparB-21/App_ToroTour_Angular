import { Component, input, output } from '@angular/core';
import { Monumento } from '../../models/monumento';

@Component({
  selector: 'app-monument-card',
  standalone: true,
  imports: [],
  templateUrl: './monument-card.html',
  styleUrl: './monument-card.css',
})
export class MonumentCard {
  monumento = input.required<Monumento>();
  //favorito = output

  //Añadir la funcionalidad para añadir a favoritos
}
