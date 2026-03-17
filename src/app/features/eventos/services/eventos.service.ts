import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Evento } from '../models/evento.interface';

declare var Papa: any;

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private readonly csv = '/csv/eventos-de-la-agenda-cultural-categorizados-y-geolocalizados.csv';
  constructor(private http: HttpClient) {}

  //Esta función devolvera un Observable q emitira un array de eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get(this.csv, { responseType: 'text' }).pipe(
      map(csvData => {
        const results = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
          transformHeader: (header: string) => header.trim()
        });

        const toText = (value: any) => String(value ?? '').trim();
        
        return results.data
        .map((item: any) => {
          const coordenadasRaw = toText(item['Posicion']).split(',');
          return {
            id: toText(item['ID evento']),
            titulo: toText(item['Título']),
            descripcion: toText(item['Descripción']),
            tematica: toText(item['Temática']),
            categoria: toText(item['Categoría']),
            fecha: {
              inicio: toText(item['Fecha de inicio']),
              fin: toText(item['Fecha de fin']),
            },
            hora: {
              inicio: toText(item['Hora inicio']),
              fin: toText(item['Hora fin']),
            },
            precio: toText(item['Precio']),
            colectivoDestinatario: toText(item['Colectivo destinatario']),
            destinatarios: toText(item['Destinatarios']),
            imagen: toText(item['Imagen del evento']),
            lugarCelebracion: toText(item['Lugar de celebración']),
            nombreLocalidad: toText(item['Nombre Localidad']),
            nombreProvincia: toText(item['Nombre Provincia']),
            calle: toText(item['Calle']),
            cp: toText(item['CP']),
            eventoEnBiblioteca: toText(item['Evento en biblioteca']),
            coordenadas: {
              latitud: coordenadasRaw[0] ? parseFloat(coordenadasRaw[0]) : 0,
              longitud: coordenadasRaw[1] ? parseFloat(coordenadasRaw[1]) : 0
            },
            enlace: toText(item['Enlace al contenido']),
          };
        })
        .filter((e: Evento) => this.esEventoValido(e));
      })
    );
  }

  // devuelve undefined si no existe ningún evento con ese id
  getEventoById(id: string): Observable<Evento | undefined> {
    const normalizedId = id.trim();

    return this.getEventos().pipe(
      map(eventos => eventos.find(e => e.id === normalizedId))
    );
  }

  private esEventoValido(evento: Evento): boolean {
    const infoDestinatarios = (evento.destinatarios || evento.colectivoDestinatario || '').trim();
    const requiredStrings = [
      evento.id,
      evento.titulo,
      evento.categoria,
      evento.tematica,
      evento.fecha.inicio,
      evento.hora.inicio,
      infoDestinatarios,
      evento.descripcion,
    ];
    const tienenContenido = requiredStrings.every(s => s && s.trim().length > 0);
    const fechaValida = evento.fecha.inicio.length > 5;
    const tieneCoordenadas = evento.coordenadas.latitud !== 0 && !isNaN(evento.coordenadas.latitud);
    return tienenContenido && fechaValida && tieneCoordenadas;
  }


  //LOGICA FAVORITOS EN LOCALSTORAGE
  listaEventosFavoritos = signal<Evento[]>(this.cargarEventosFavoritos())

  //Funcion para recuperar los favoritos desde localStorage al iniciar la app
  cargarEventosFavoritos() {
    const eventosFavoritos = localStorage.getItem(environment.EVENTS_STORAGE_KEY)
    return eventosFavoritos ? JSON.parse(eventosFavoritos) : []
  }

  actualizarFavorito(evento: Evento)
  {
    this.listaEventosFavoritos.update( eventosFavoritos => {
      const yaGuardado = eventosFavoritos.some(e => e.id === evento.id);
      return yaGuardado
        ? eventosFavoritos.filter(e => e.id !== evento.id)
        : [...eventosFavoritos, evento];
    });

    console.log(`Favorito ${evento.titulo} actualizado en la lista (signal)`);
  }

  esFavorito(id: string): boolean {
    return this.listaEventosFavoritos().some(e => e.id === id);
  }

  actualizarLocalStorage = effect( () => {
    const eventosFavoritos = this.listaEventosFavoritos()
    localStorage.setItem(environment.EVENTS_STORAGE_KEY, JSON.stringify(eventosFavoritos))
    console.log('Listado de eventos favoritos actualizado en el LocalStorage')
  })

}
