import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { Monumento } from '../models/monumento.interface';

import { environment } from '../../../../environments/environment';

type FavoritoApi = {
  tipo?: string;
  itemID?: string | number;
  /*itemId?: string | number;
  item_id?: string | number;
  elementoId?: string | number;
  idElemento?: string | number;
  monumentoId?: string | number;*/
};

@Injectable({
  providedIn: 'root'
})

export class MonumentoService {
  private readonly apiUrl = environment.API_URL;
  private readonly monumentosUrl = `${this.apiUrl}/monumentos`;
  private readonly favoritosUrl = `${this.apiUrl}/favoritos`;
  //Lista con los monumentos favoritos para mostrar en la interfaz, se mantiene sincronizada con la API
  listaMonumentosFavoritos = signal<Monumento[]>([])

  constructor(private http: HttpClient)
  {
    this.cargarMonumentosFavoritos();
  }

  getMonumentos(): Observable<Monumento[]> {
    return this.http.get<unknown>(this.monumentosUrl).pipe(
      map(response => this.extraerLista<Record<string, unknown>>(response, 'monumentos')
        .map(item => this.normalizarMonumento(item))
        .filter((monumento): monumento is Monumento => Boolean(monumento))
      )
    );
  }

  getMonumentoById(id: string): Observable<Monumento | undefined> {
    const normalizedId = id.trim();

    return this.http.get<unknown>(`${this.monumentosUrl}/${encodeURIComponent(normalizedId)}`).pipe(
      map(response => this.extraerDetalle<Record<string, unknown>>(response, 'monumento')),
      map(monumento => monumento ? this.normalizarMonumento(monumento) : undefined),
      switchMap(monumento => monumento
        ? of(monumento)
        : this.buscarMonumentoEnListado(normalizedId)
      ),
      catchError(() => this.buscarMonumentoEnListado(normalizedId))
    );
  }

  //Funcion para recuperar los favoritos desde la API al iniciar la app
  cargarMonumentosFavoritos() {
    this.obtenerRegistrosFavoritos().pipe(
      map(favoritos => favoritos
        .filter(favorito => this.esRegistroDeMonumento(favorito))
        .map(favorito => this.extraerItemIDFavorito(favorito))
        .filter((id): id is string => Boolean(id))
      ),
      switchMap(ids => ids.length
        ? forkJoin(ids.map(id => this.getMonumentoById(id).pipe(catchError(() => of(undefined)))))
        : of([])
      ),
      map(monumentos => monumentos.filter((monumento): monumento is Monumento => Boolean(monumento)))
    ).subscribe({
      next: monumentos => this.listaMonumentosFavoritos.set(monumentos),
      error: err => console.error('Error al obtener monumentos favoritos:', err)
    });
  }

  actualizarFavorito(monumento: Monumento)
  {
    /*
    Alterna la presencia del monumento en la lista de favoritos:
    - Si no está, lo añade.
    - Si ya está, lo elimina.
    La lista al tratarse de una signal actualizará automaticamente la interfaz.
    */
    if (!monumento.id) {
      console.error('El monumento no tiene id y no puede actualizarse como favorito');
      return;
    }

    const yaGuardado = this.esFavorito(monumento.id);

    this.listaMonumentosFavoritos.update(monumentosFavoritos =>
      yaGuardado
        ? monumentosFavoritos.filter(m => m.id !== monumento.id)
        : [...monumentosFavoritos, monumento]
    );

    const request$ = yaGuardado
      ? this.http.delete(this.favoritosUrl, {
          body: { tipo: 'monumentos', itemID: monumento.id }
        })
      : this.http.post(this.favoritosUrl, { tipo: 'monumentos', itemID: monumento.id });

    request$.subscribe({
      error: err => {
        console.error(`Error al actualizar favorito ${monumento.nombre}:`, err);
        this.cargarMonumentosFavoritos();
      }
    });

    console.log(`Favorito ${monumento.nombre} actualizado en la lista (signal)`);
  }

  esFavorito(id: string): boolean {
    return this.listaMonumentosFavoritos().some(m => m.id === id);
  }

  private esRegistroDeMonumento(favorito: FavoritoApi): boolean {
    const tipo = favorito.tipo?.toLowerCase();
    return tipo === 'monumento' || tipo === 'monumentos';
  }

  private extraerItemIDFavorito(favorito: FavoritoApi): string {
    return String(
      favorito.itemID ??
      /*favorito.itemId ??
      favorito.item_id ??
      favorito.elementoId ??
      favorito.idElemento ??
      favorito.monumentoId ??*/
      ''
    ).trim();
  }

  private obtenerRegistrosFavoritos(): Observable<FavoritoApi[]> {
    return this.http.get<unknown>(this.favoritosUrl).pipe(
      map(response => this.extraerLista<FavoritoApi>(response, 'favoritos'))
    );
  }


  //FUNCIONES AUXILIARES PARA EXTRAER DATOS DE RESPUESTAS DE API CON ESTRUCTURAS VARIABLES
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

  private buscarMonumentoEnListado(id: string): Observable<Monumento | undefined> {
    return this.getMonumentos().pipe(
      map(monumentos => monumentos.find(m => m.id === id))
    );
  }

  private normalizarMonumento(item: Record<string, unknown>): Monumento | undefined {
    const monumento: Monumento = {
      id: this.toText(item['_id'] ?? item['id'] ?? item['identificador']),
      nombre: this.toText(item['nombre']),
      tipoMonumento: this.toText(item['tipoMonumento']),
      identificadorBienInteresCultural: this.toText(item['identificadorBienInteresCultural']),
      calle: this.toText(item['calle']),
      clasificacion: this.toText(item['clasificacion']),
      tipoConstruccion: this.toText(item['tipoConstruccion']),
      codigoPostal: this.toText(item['codigoPostal']),
      descripcion: this.toText(item['descripcion'] ?? item['Descripcion']),
      periodoHistorico: this.toText(item['periodoHistorico']),
      provincia: this.toText(item['provincia'] ?? item['poblacion_provincia']),
      municipio: this.toText(item['municipio'] ?? item['poblacion_municipio']),
      localidad: this.toText(item['localidad'] ?? item['poblacion_localidad']),
      coordenadas: this.normalizarCoordenadas(item)
    };

    return monumento.id ? monumento : undefined;
  }

  private normalizarCoordenadas(item: Record<string, unknown>): Monumento['coordenadas'] {
    const coordenadas = item['coordenadas'] as Record<string, unknown> | undefined;

    return {
      latitud: Number(coordenadas?.['latitud'] ?? item['coordenadas_latitud'] ?? 0),
      longitud: Number(coordenadas?.['longitud'] ?? item['coordenadas_longitud'] ?? 0)
    };
  }

  private toText(value: unknown): string {
    return String(value ?? '').trim();
  }

  /*
  //LOGICA FAVORITOS EN LOCALSTORAGE
  //Lista con los monumentos favoritos
  listaMonumentosFavoritos = signal<Monumento[]>(this.cargarMonumentosFavoritos())

  //Funcion para recuperar los favoritos desde localStorage al iniciar la app
  cargarMonumentosFavoritos()
  {
    const monumentosFavoritos = localStorage.getItem(environment.MONUMENTS_STORAGE_KEY)
    //NOS interesa transformarlos a JSON???
    return monumentosFavoritos ? JSON.parse(monumentosFavoritos) : []
  }

  actualizarLocalStorage = effect( () => {
    //"Vinculamos" el effect a nuestra lista de favoritos
    const monumentosFavoritos = this.listaMonumentosFavoritos()
    //Actualizamos el localStorage
    localStorage.setItem(environment.MONUMENTS_STORAGE_KEY, JSON.stringify(monumentosFavoritos))
    //Para DEBUGGING
    console.log('Listado de monumentos favoritos actualizado en el LocalStorage')
    }
  )
  */

}
