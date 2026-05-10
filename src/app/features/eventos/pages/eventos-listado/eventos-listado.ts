import { Component, computed, inject, signal } from '@angular/core';
import { Toolbar } from "../../../../shared/layout/toolbar/toolbar";
import { EventosService } from '../../services/eventos.service';
import { combineLatest, finalize, map, Observable, shareReplay } from 'rxjs';
import { Evento } from '../../models/evento.interface';
import { EventosCard } from "../../componentes/eventos-card/eventos-card";
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-eventos-listado',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, Toolbar, EventosCard],
  templateUrl: './eventos-listado.html',
  styleUrl: './eventos-listado.css',
})
export class EventosListado {
  private _eventos = inject(EventosService)

  readonly listadoEventos$: Observable<Evento[]>

  searchTerm = signal('');
  categoriaSeleccionada = signal<string | null>(null);
  categoriasAbiertas = signal(false);
  cargando = signal(true);

  private allEventos$ = this._eventos.getEventos().pipe(
    finalize(() => this.cargando.set(false)),
    shareReplay(1)
  );

  private eventosData = toSignal(this.allEventos$, { initialValue: [] });

  categoriasDisponibles = computed(() => {
    const cats = this.eventosData().map(e => e.categoria);
    return [...new Set(cats)];
  });

  constructor() {
    this.listadoEventos$ = combineLatest([
      this.allEventos$,
      toObservable(this.searchTerm),
      toObservable(this.categoriaSeleccionada)
    ]).pipe(
      map(([eventos, term, cat]) => {
        const t = term.toLowerCase();
        return eventos.filter(e => {
          const cumpleTexto = !t || e.titulo.toLowerCase().includes(t);
          const cumpleCat = !cat || e.categoria === cat;
          return cumpleTexto && cumpleCat;
        });
      })
    );
  }

  actualizarBusqueda(texto: string) {
    this.searchTerm.set(texto);
  }

  abrirPanelCategorias() {
    this.categoriasAbiertas.set(!this.categoriasAbiertas());
  }

  filtrarPorCategoria(cat: string | null) {
    this.categoriaSeleccionada.set(cat);
    this.categoriasAbiertas.set(false);
  }
}
