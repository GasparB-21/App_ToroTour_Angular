import { Component, inject, input, output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Monumento } from '../../models/monumento';
import { MonumentoService } from '../../services/monumento-service';

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
  //Añadir a favoritos
  servicioMonumentos = inject(MonumentoService)
  readonly esFavorito = computed(() => this.servicioMonumentos.esFavorito(this.monumento().id));

  actualizarFavorito(){ this.servicioMonumentos.actualizarFavorito(this.monumento()) }
}
