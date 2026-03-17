import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { Directions } from '../../../../shared/layout/directions/directions';

@Component({
  selector: 'app-detalle-evento',
  imports: [Directions],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css',
})
export class DetalleEvento {
  private _route = inject(ActivatedRoute);
  private _eventosService = inject(EventosService);

  readonly evento = toSignal(
    this._route.paramMap.pipe(
      map((params) => params.get('id')?.trim() ?? ''),
      switchMap((id) => (id ? this._eventosService.getEventoById(id) : of(undefined)))
    ),
    { initialValue: undefined }
  );

  servicioEventos = inject(EventosService)

  readonly esFavorito = computed(() => {
    const evento = this.evento();
    return evento ? this.servicioEventos.esFavorito(evento.id) : false;
  });

  actualizarFavorito(){
    const monumentoActual = this.evento();
    if (monumentoActual) {
      this.servicioEventos.actualizarFavorito(monumentoActual);
    } else {
      console.error('El evento no puede añadirse a favoritos');
    }
  }
}
