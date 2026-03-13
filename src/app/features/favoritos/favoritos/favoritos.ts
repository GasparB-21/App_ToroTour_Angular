import { Component, inject, signal } from '@angular/core';
import { Toolbar } from '../../../shared/layout/toolbar/toolbar';
import { MonumentCard } from '../../monumentos/componentes/monument-card/monument-card';
import { MonumentoService } from '../../monumentos/services/monumento-service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [Toolbar, MonumentCard],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private monumentoService = inject(MonumentoService);

  // Estado de la pestaña seleccionada en el chip selector
  readonly categoriaSeleccionada = signal<'monumentos' | 'eventos'>('monumentos');

  // Listas de favoritos almacenadas en localStorage u origen equivalente
  readonly monumentosFavoritos = this.monumentoService.listaMonumentosFavoritos;
  readonly eventosFavoritos = signal<unknown[]>([]);

  seleccionarCategoria(categoria: 'monumentos' | 'eventos') {
    this.categoriaSeleccionada.set(categoria);
  }
}
