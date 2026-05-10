import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Evento } from '../models/evento.interface';

type FavoritoApi = {
  tipo?: string;
  itemID?: string | number;
  /*itemId?: string | number;
  item_id?: string | number;
  elementoId?: string | number;
  idElemento?: string | number;
  eventoId?: string | number;*/
};

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private readonly apiUrl = environment.API_URL;
  private readonly eventosUrl = `${this.apiUrl}/eventos`;
  private readonly favoritosUrl = `${this.apiUrl}/favoritos`;
  listaEventosFavoritos = signal<Evento[]>([]);

  constructor(private http: HttpClient) {
    this.cargarEventosFavoritos();
  }

  //Esta función devolvera un Observable q emitira un array de eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<unknown>(this.eventosUrl).pipe(
      map(response => this.extraerLista<Record<string, unknown>>(response, 'eventos')
        .map(item => this.normalizarEvento(item))
        .filter((evento): evento is Evento => Boolean(evento))
      )
    );
  }

  //Devuelve undefined si no existe ningún evento con ese id
  getEventoById(id: string): Observable<Evento | undefined> {
    const normalizedId = id.trim();

    return this.http.get<unknown>(`${this.eventosUrl}/${encodeURIComponent(normalizedId)}`).pipe(
      map(response => this.extraerDetalle<Record<string, unknown>>(response, 'evento')),
      map(evento => evento ? this.normalizarEvento(evento) : undefined),
      switchMap(evento => evento
        ? of(evento)
        : this.buscarEventoEnListado(normalizedId)
      ),
      catchError(() => this.buscarEventoEnListado(normalizedId))
    );
  }

  //Funcion para recuperar los favoritos desde la API al iniciar la app
  cargarEventosFavoritos() {
    this.obtenerRegistrosFavoritos().pipe(
      map(favoritos => favoritos
        .filter(favorito => this.esRegistroDeEvento(favorito))
        .map(favorito => this.extraerItemIDFavorito(favorito))
        .filter((id): id is string => Boolean(id))
      ),
      switchMap(ids => ids.length
        ? forkJoin(ids.map(id => this.getEventoById(id).pipe(catchError(() => of(undefined)))))
        : of([])
      ),
      map(eventos => eventos.filter((evento): evento is Evento => Boolean(evento)))
    ).subscribe({
      next: eventos => this.listaEventosFavoritos.set(eventos),
      error: err => console.error('Error al obtener eventos favoritos:', err)
    });
  }

  actualizarFavorito(evento: Evento)
  {
    if (!evento.id) {
      console.error('El evento no tiene id y no puede actualizarse como favorito');
      return;
    }

    const yaGuardado = this.esFavorito(evento.id);

    this.listaEventosFavoritos.update(eventosFavoritos =>
      yaGuardado
        ? eventosFavoritos.filter(e => e.id !== evento.id)
        : [...eventosFavoritos, evento]
    );

    const request$ = yaGuardado
      ? this.http.delete(this.favoritosUrl, {
          body: { tipo: 'eventos', itemID: evento.id }
        })
      : this.http.post(this.favoritosUrl, { tipo: 'eventos', itemID: evento.id });

    request$.subscribe({
      error: err => {
        console.error(`Error al actualizar favorito ${evento.titulo}:`, err);
        this.cargarEventosFavoritos();
      }
    });

    console.log(`Favorito ${evento.titulo} actualizado en la lista (signal)`);
  }

  esFavorito(id: string): boolean {
    return this.listaEventosFavoritos().some(e => e.id === id);
  }

  private esRegistroDeEvento(favorito: FavoritoApi): boolean {
    const tipo = favorito.tipo?.toLowerCase();
    return tipo === 'evento' || tipo === 'eventos';
  }

  private extraerItemIDFavorito(favorito: FavoritoApi): string {
    return String(
      favorito.itemID ??
      /*favorito.itemId ??
      favorito.item_id ??
      favorito.elementoId ??
      favorito.idElemento ??
      favorito.eventoId ??*/
      ''
    ).trim();
  }

  private obtenerRegistrosFavoritos(): Observable<FavoritoApi[]> {
    return this.http.get<unknown>(this.favoritosUrl).pipe(
      map(response => this.extraerLista<FavoritoApi>(response, 'favoritos'))
    );
  }

  private extraerLista<T>(response: unknown, property: string): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (response && typeof response === 'object') {
      const data = response as Record<string, unknown>;
      const possibleList = data[property] ?? data['data'] ?? data['items'] ?? data['results'];
      return Array.isArray(possibleList) ? possibleList as T[] : [];
    }

    return [];
  }

  private extraerDetalle<T>(response: unknown, property: string): T | undefined {
    const listResponse = this.extraerLista<T>(response, `${property}s`);
    if (listResponse.length > 0) {
      return listResponse[0];
    }

    if (response && typeof response === 'object') {
      const data = response as Record<string, unknown>;
      return (data[property] ?? data['data'] ?? response) as T;
    }

    return undefined;
  }

  private buscarEventoEnListado(id: string): Observable<Evento | undefined> {
    return this.getEventos().pipe(
      map(eventos => eventos.find(e => e.id === id))
    );
  }

  private normalizarEvento(item: Record<string, unknown>): Evento | undefined {
    const evento: Evento = {
      id: this.toText(item['_id'] ?? item['id'] ?? item['ID evento']),
      titulo: this.toText(item['titulo'] ?? item['Título']),
      descripcion: this.toText(item['descripcion'] ?? item['Descripción']),
      tematica: this.toText(item['tematica'] ?? item['Temática']),
      categoria: this.toText(item['categoria'] ?? item['Categoría']),
      fecha: {
        inicio: this.toText((item['fecha'] as Record<string, unknown> | undefined)?.['inicio'] ?? item['Fecha de inicio']),
        fin: this.toText((item['fecha'] as Record<string, unknown> | undefined)?.['fin'] ?? item['Fecha de fin']),
      },
      hora: {
        inicio: this.toText((item['hora'] as Record<string, unknown> | undefined)?.['inicio'] ?? item['Hora inicio']),
        fin: this.toText((item['hora'] as Record<string, unknown> | undefined)?.['fin'] ?? item['Hora fin']),
      },
      precio: this.toText(item['precio'] ?? item['Precio']),
      colectivoDestinatario: this.toText(item['colectivoDestinatario'] ?? item['Colectivo destinatario']),
      destinatarios: this.toText(item['destinatarios'] ?? item['Destinatarios']),
      imagen: this.toText(item['imagen'] ?? item['Imagen del evento']),
      lugarCelebracion: this.toText(item['lugarCelebracion'] ?? item['Lugar de celebración']),
      nombreLocalidad: this.toText(item['nombreLocalidad'] ?? item['Nombre Localidad']),
      nombreProvincia: this.toText(item['nombreProvincia'] ?? item['Nombre Provincia']),
      calle: this.toText(item['calle'] ?? item['Calle']),
      cp: this.toText(item['cp'] ?? item['CP']),
      eventoEnBiblioteca: this.toText(item['eventoEnBiblioteca'] ?? item['Evento en biblioteca']),
      coordenadas: this.normalizarCoordenadas(item),
      enlace: this.toText(item['enlace'] ?? item['Enlace al contenido']),
    };

    return evento.id ? evento : undefined;
  }

  private normalizarCoordenadas(item: Record<string, unknown>): Evento['coordenadas'] {
    const coordenadas = item['coordenadas'] as Record<string, unknown> | undefined;
    const posicion = this.toText(item['Posicion']).split(',');

    return {
      latitud: Number(coordenadas?.['latitud'] ?? posicion[0] ?? 0),
      longitud: Number(coordenadas?.['longitud'] ?? posicion[1] ?? 0)
    };
  }

  private toText(value: unknown): string {
    return String(value ?? '').trim();
  }

  /*
  //LOGICA FAVORITOS EN LOCALSTORAGE
  listaEventosFavoritos = signal<Evento[]>(this.cargarEventosFavoritos())

  //Funcion para recuperar los favoritos desde localStorage al iniciar la app
  cargarEventosFavoritos() {
    const eventosFavoritos = localStorage.getItem(environment.EVENTS_STORAGE_KEY)
    return eventosFavoritos ? JSON.parse(eventosFavoritos) : []
  }

  actualizarLocalStorage = effect( () => {
    const eventosFavoritos = this.listaEventosFavoritos()
    localStorage.setItem(environment.EVENTS_STORAGE_KEY, JSON.stringify(eventosFavoritos))
    console.log('Listado de eventos favoritos actualizado en el LocalStorage')
  })
  */

}
