import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Evento } from '../../models/evento.interface';
import { EventosService } from '../../services/eventos.service';
import { CardPreview } from "../../../../shared/layout/card-preview/card-preview";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Toolbar } from "../../../../shared/layout/toolbar/toolbar";

@Component({
  selector: 'app-calendario-eventos',
  imports: [CardPreview, RouterLink, RouterLinkActive, Toolbar],
  templateUrl: './calendario-eventos.html',
  styleUrl: './calendario-eventos.css',
})
export class CalendarioEventos implements OnInit {
  readonly MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  readonly DAYS_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Estado con Signals
  hoy = new Date();
  mesActual = signal(this.hoy.getMonth());
  anioActual = signal(this.hoy.getFullYear());
  pickerAbierto = signal(false);
  categoriasAbiertas = signal(false);
  
  eventoSeleccionado = signal<Evento | null>(null);
  //REVISAr
  listaEventos = signal<Evento[]>([]);
  
  searchTerm = signal('');
  categoriaSeleccionada = signal<string | null>(null);

  //Servicio 
  /*
  private _eventosService = inject(EventosService)
  private allEventos = this._eventosService.getEventos()

  calendario = computed(() => {
                                //Obtenemos los datos de la fecha actual
                                const ano = this.hoy.getFullYear();
                                const mes = this.hoy.getMonth();

                                //Obtenemos la lista de eventos
                                const eventos = this._eventosService.getEventos()
                                const cells = [];

                                //
                                const diaInicio = new Date(ano, mes, 1);
                                const espaciosEnBlanco = (diaInicio.getDay() + 6) % 7;
                                const totalDays = new Date(y, m + 1, 0).getDate();


                              }
)
*/


  constructor(private eventosService: EventosService) {}
  ngOnInit() {
    this.eventosService.getEventos().subscribe(data => {
      this.listaEventos.set(data);
    });
  }


  // Computed: Genera la rejilla automáticamente cuando cambia el mes, año o la lista de eventos
  grid = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const catFiltro = this.categoriaSeleccionada();

    const y = this.anioActual();
    const m = this.mesActual();

    const eventos = this.listaEventos();
    const cells = [];

    const firstDay = new Date(y, m, 1);
    const blanks = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < blanks; i++) cells.push({ day: null });

    for (let i = 1; i <= totalDays; i++) {
      const evento = this.obtenerEventoParaDia(i, m, y, eventos);

      const cumpleTexto = !term || evento?.titulo.toLowerCase().includes(term);
      const cumpleCat = !catFiltro || evento?.categoria === catFiltro;
      const esVisible = evento && cumpleTexto && cumpleCat;
      
      cells.push({
        day: i,
        isToday: this.esHoy(i),
        hasEvent: !!esVisible,
        evento: esVisible ? evento : undefined
      });
    }

    while (cells.length % 7 !== 0) cells.push({ day: null });

    return cells;
  });

  categoriasDisponibles = computed(() => {
    const eventos = this.listaEventos();
    const cats = eventos.map(e => e.categoria);
    return [...new Set(cats)]; 
  });

  // Helpers

  private esHoy(dia: number): boolean {
    return dia === this.hoy.getDate() && 
           this.mesActual() === this.hoy.getMonth() && 
           this.anioActual() === this.hoy.getFullYear();
  }

  private obtenerEventoParaDia(dia: number, mes: number, anio: number, eventos: Evento[]): Evento | undefined {
    return eventos.find(e => {
      const d = new Date(e.fecha.inicio);
      return d.getDate() === dia && 
             d.getMonth() === mes && 
             d.getFullYear() === anio;
    });
  }
  
  seleccionarDia(cell: any) {
    if (cell.evento) {
      this.eventoSeleccionado.set(cell.evento);
    }
  }

  aplicarFiltro(m: string, y: string) {
    this.mesActual.set(parseInt(m));
    this.anioActual.set(parseInt(y));
    this.pickerAbierto.set(false);
  }

  actualizarBusqueda(texto: string) {
    this.searchTerm.set(texto);
  }
  
  filtrarPorCategoria(cat: string | null) {
    this.categoriaSeleccionada.set(cat);
    this.categoriasAbiertas.set(false); 
  }
  
  abrirPanelCategorias() {
    this.categoriasAbiertas.set(!this.categoriasAbiertas());
    this.pickerAbierto.set(false); 
  }
}
