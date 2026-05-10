import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MonumentoCard } from '../../componentes/monument-card/monumentos-card';
import { Monumento } from '../../models/monumento.interface';
import { MonumentoService } from '../../services/monumentos.service';
import { ImagenesMonumentosService } from '../../services/imagenes-monumentos.service';
import { ICONOS_TIPO } from '../../services/categorias-tipos';
import { Toolbar } from '../../../../shared/layout/toolbar/toolbar';

import { combineLatest, finalize, map, Observable, shareReplay } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

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
  private _imagenes = inject(ImagenesMonumentosService)
  //Definimos la variable donde almacenaremos los monumentos
  readonly listadoMonumentos$: Observable<Monumento[]>
  searchTerm = signal('');
  categoriaSeleccionada = signal<string | null>(null);
  categoriasAbiertas = signal(false);
  cargando = signal(true);

  private allMonumentos$ = this._monumentos.getMonumentos().pipe(
    finalize(() => this.cargando.set(false)),
    shareReplay(1)
  );

  categoriasDisponibles = Object.keys(ICONOS_TIPO).filter(tipo => tipo !== 'default');

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
          const cumpleCat = !cat || this._imagenes.getClaveTipo(m.tipoMonumento) === cat;
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

  nombreCategoria(cat: string): string {
    const nombres: Record<string, string> = {
      religiosa: 'Arquitectura Religiosa',
      civil: 'Arquitectura Civil',
      defensa: 'Estructuras Militares',
      patrimonio: 'Patrimonio Arqueológico',
      publico: 'Espacio Público',
    };

    return nombres[cat] ?? cat;
  }
}
