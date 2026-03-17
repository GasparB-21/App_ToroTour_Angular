import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MonumentoCard } from '../../componentes/monument-card/monumentos-card';
import { Monumento } from '../../models/monumento.interface';
import { MonumentoService } from '../../services/monumentos.service';
import { Toolbar } from '../../../../shared/layout/toolbar/toolbar';

import { combineLatest, map, Observable } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-monumentos-listado',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, Toolbar, MonumentoCard],
  templateUrl: './monumentos-listado.html',
  styleUrl: './monumentos-listado.css',
})
export class MonumentosListado {
  //Inyectamos el servicio desde el q recuperaremos los monumentos
  private _monumentos = inject(MonumentoService)    //DUDA: estandar para escribir _Nombre
  //Definimos la variable donde almacenaremos los monumentos
  readonly listadoMonumentos$: Observable<Monumento[]>
  searchTerm = signal('');
  categoriaSeleccionada = signal<string | null>(null);
  categoriasAbiertas = signal(false);

  private allMonumentos$ = this._monumentos.getMonumentos();

  private monumentosData = toSignal(this.allMonumentos$, { initialValue: [] });
  //Definimos el constructor del componente
  categoriasDisponibles = computed(() => {
    const cats = this.monumentosData().map(m => m.clasificacion);
    return [...new Set(cats)];
  });

  constructor() {
    this.listadoMonumentos$ = combineLatest([
      this.allMonumentos$,
      toObservable(this.searchTerm),
      toObservable(this.categoriaSeleccionada)
    ]).pipe(
      map(([monumentos, term, cat]) => {
        const t = term.toLowerCase();
        return monumentos.filter(m => {
          const cumpleTexto = !t || m.nombre.toLowerCase().includes(t);
          const cumpleCat = !cat || m.clasificacion === cat;
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
