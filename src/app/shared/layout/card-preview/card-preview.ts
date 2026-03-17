import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card-preview',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {
  titulo = input<string>();
  tipo = input<string>();
  monumentoId = input<string>();
  seccion = input<string>('monumentos');
}
