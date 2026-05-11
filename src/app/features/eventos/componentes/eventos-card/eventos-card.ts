import { Component, computed, inject, input } from '@angular/core';
import { Evento } from '../../models/evento.interface';
import { EventosService } from '../../services/eventos.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-eventos-card',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './eventos-card.html',
  styleUrl: './eventos-card.css',
})
export class EventosCard {
  evento = input.required<Evento>();

  private _servicioEventos = inject(EventosService)
  readonly esFavorito = computed(() => this._servicioEventos.esFavorito(this.evento().id));

  actualizarFavorito(){ this._servicioEventos.actualizarFavorito(this.evento()) }

  onImgError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'images/placeholder.png';
}
}
