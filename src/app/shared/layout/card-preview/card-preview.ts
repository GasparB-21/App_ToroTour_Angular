import { Component, input, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card-preview',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {
  @Input() titulo: string = '';
  @Input() tipo: string = '';
}
