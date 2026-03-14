import { Component, inject, input, output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Monumento } from '../../models/monumento.interface';
import { MonumentoService } from '../../services/monumentos.service';

@Component({
  selector: 'app-monument-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './monumentos-card.html',
  styleUrl: './monumentos-card.css',
})
export class MonumentoCard {
  monumento = input.required<Monumento>();
  //favorito = output

  //FUNCIONALIDADES
  //Añadir a favoritos
  private _servicioMonumentos = inject(MonumentoService)
  readonly esFavorito = computed(() => this._servicioMonumentos.esFavorito(this.monumento().id));

  actualizarFavorito(){ this._servicioMonumentos.actualizarFavorito(this.monumento()) }
}
