import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card-preview',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {
  /*Angular Antiguo*/
  /*
  @Input() titulo: string = '';
  @Input() tipo: string = '';
  @Input() monumentoId: string = '';
  */

  /*Angular Moderno*/
  titulo = input<string>();
  tipo = input<string>();
  monumentoId = input<string>();
}
