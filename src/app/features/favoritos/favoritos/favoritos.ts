import { Component, computed, inject, signal } from '@angular/core';
import { Toolbar } from '../../../shared/layout/toolbar/toolbar';
import { MonumentoCard } from '../../monumentos/componentes/monument-card/monumentos-card';
import { MonumentoService } from '../../monumentos/services/monumentos.service';
import { EventosService } from '../../eventos/services/eventos.service';
import { EventosCard } from "../../eventos/componentes/eventos-card/eventos-card";

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [Toolbar, MonumentoCard, EventosCard],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private _monumentoService = inject(MonumentoService);
  private _eventoService = inject(EventosService);

  searchTerm = signal('');
  tabActual = signal<'monumentos' | 'eventos'>('monumentos');

  readonly categoriaSeleccionada = signal<'monumentos' | 'eventos'>('monumentos');

  categoriasAbiertas = signal(false);
  filtroCategoria = signal<string | null>(null);

  // Listas de favoritos recuperadas desde los servicios
  readonly monumentosFav = this._monumentoService.listaMonumentosFavoritos;
  readonly eventosFav = this._eventoService.listaEventosFavoritos;
  
  categoriasDisponibles = computed(() => {
    if (this.tabActual() === 'monumentos') {
      const cats = this.monumentosFav().map(m => m.clasificacion);
      return [...new Set(cats)];
    } else {
      const cats = this.eventosFav().map(e => e.categoria);
      return [...new Set(cats)];
    }
  });

  // --- LISTAS FILTRADAS FINAL ---
  readonly monumentosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.filtroCategoria();
    let lista = this.monumentosFav();

    if (term) lista = lista.filter(m => m.nombre.toLowerCase().includes(term));
    if (cat && this.tabActual() === 'monumentos') {
      lista = lista.filter(m => m.clasificacion === cat);
    }
    return lista;
  });

  readonly eventosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.filtroCategoria();
    let lista = this.eventosFav();

    if (term) lista = lista.filter(e => e.titulo.toLowerCase().includes(term));
    if (cat && this.tabActual() === 'eventos') {
      lista = lista.filter(e => e.categoria === cat);
    }
    return lista;
  });

  // Métodos para la Toolbar
  actualizarBusqueda(texto: string) {
    this.searchTerm.set(texto);
  }

  seleccionarTab(tab: 'monumentos' | 'eventos') {
    this.tabActual.set(tab);
    this.filtroCategoria.set(null);
    this.categoriasAbiertas.set(false);
  }

  togglePanelCategorias() {
    this.categoriasAbiertas.update(v => !v);
  }

  aplicarFiltroCategoria(cat: string | null) {
    this.filtroCategoria.set(cat);
    this.categoriasAbiertas.set(false);
  }
  
  seleccionarCategoria(categoria: 'monumentos' | 'eventos') {
    this.categoriaSeleccionada.set(categoria);
  }

  //Metodo para saber el tipo mostrado
  isTabMonumentos()
  {
    if(this.tabActual() == 'monumentos')
    {
      return true
    }
    return false
  }
}
