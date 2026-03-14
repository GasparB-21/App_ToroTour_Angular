import { Component, inject, signal } from '@angular/core';
import { Toolbar } from '../../../shared/layout/toolbar/toolbar';
import { MonumentoCard } from '../../monumentos/componentes/monument-card/monumentos-card';
import { MonumentoService } from '../../monumentos/services/monumentos.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [Toolbar, MonumentoCard],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private _monumentoService = inject(MonumentoService);

  // Estado de la pestaña seleccionada en el chip selector
  readonly categoriaSeleccionada = signal<'monumentos' | 'eventos'>('monumentos');

  // Listas de favoritos almacenadas en localStorage u origen equivalente
  readonly monumentosFavoritos = this._monumentoService.listaMonumentosFavoritos;
  readonly eventosFavoritos = signal<unknown[]>([]);

  seleccionarCategoria(categoria: 'monumentos' | 'eventos') {
    this.categoriaSeleccionada.set(categoria);
  }
}
