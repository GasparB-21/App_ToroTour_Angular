import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { Monumento } from '../models/monumento.interface';

import { environment } from '../../../../environments/environment.development';

/*
Instakar los tipos:
npm install papaparse
npm install --save-dev @types/papaparse
*/
//declare var Papa: any;

@Injectable({
  providedIn: 'root'
})

export class MonumentoService {

  //TRATAMIENTO DATOS CSV JCyL
  // Ruta al archivo con los datos de la JCyL
  //private readonly csv = '/csv/relacion-monumentos.csv';
  private readonly apiUrl = 'http://localhost:3001/api/monumentos';
  constructor(private http: HttpClient) {}

  //Esta función devolvera un Observable q emitira un array de monumentos
  /*
  getMonumentos(): Observable<Monumento[]> {
    //Leemos el CSV y especificamos q el formato es "text"
    return this.http.get(this.csv, { responseType: 'text' }).pipe(
      //Transformamos los elementos del observable al formato q especifiquemos
      map(csvData => {
        //Especificamos q se haga la conversión a objetos JavaScript mediante Papa parse
        const results = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
          transformHeader: (header: string) => header.trim()
        });

        // Mapeamos los nombres de las columnas del CSV de la JCyL a nuestro modelo
        const toText = (value: any) => String(value ?? '').trim();

        return results.data
          .map((item: any) => ({
            id: toText(item['identificador']),
            nombre: toText(item['nombre']),
            tipoMonumento: toText(item['tipoMonumento']),
            identificadorBienInteresCultural: toText(item['identificadorBienInteresCultural']),
            calle: toText(item['calle']),
            clasificacion: toText(item['clasificacion']),
            tipoConstruccion: toText(item['tipoConstruccion']),
            codigoPostal: toText(item['codigoPostal']),
            descripcion: toText(item['Descripcion']),
            periodoHistorico: toText(item['periodoHistorico']),
            provincia: toText(item['poblacion_provincia']),
            municipio: toText(item['poblacion_municipio']),
            localidad: toText(item['poblacion_localidad']),
            coordenadas: {
              latitud: parseFloat(item['coordenadas_latitud']),
              longitud: parseFloat(item['coordenadas_longitud'])
            }      
          }))
          .filter((m: Monumento) => this.esMonumentoValido(m));
      })
    );
  }
  */

  getMonumentos(): Observable<Monumento[]> {
    return this.http.get<{ data: any[], message: string }>(this.apiUrl).pipe(
      map(response => response.data),
      map(dataArray => dataArray.map(item => ({
        ...item,
        id: item._id,
        nombre: item.nombre,
        tipoMonumento: item.tipoMonumento,
        identificadorBienInteresCultural: item.identificadorBienInteresCultural,
        calle: item.calle,
        clasificacion: item.clasificacion,
        tipoConstruccion: item.tipoConstruccion,
        codigoPostal: item.codigoPostal,
        descripcion: item.Descripcion,
        periodoHistorico: item.periodoHistorico,
        provincia: item.poblacion_provincia,
        municipio: item.poblacion_municipio,
        localidad: item.poblacion_localidad,
        coordenadas: {
          latitud: parseFloat(item.coordenadas?.latitud),
          longitud: parseFloat(item.coordenadas?.longitud)
        }
      }))),
      map(monumentos => monumentos.filter(m => this.esMonumentoValido(m)))
    );
  }

  // devuelve undefined si no existe ningún monumento con ese id
  /*
  getMonumentoById(id: string): Observable<Monumento | undefined> {
    const normalizedId = id.trim();

    return this.getMonumentos().pipe(
      map(monumentos => monumentos.find(m => m.id === normalizedId))
    );
  }
  */
  getMonumentoById(id: string): Observable<Monumento | undefined> {
    return this.http.get<{ data: any, message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const item = response.data;
        if (!item) return undefined;
        return {
          id: item._id,
          nombre: item.nombre,
          tipoMonumento: item.tipoMonumento,
          identificadorBienInteresCultural: item.identificadorBienInteresCultural,
          calle: item.calle,
          clasificacion: item.clasificacion,
          tipoConstruccion: item.tipoConstruccion,
          codigoPostal: item.codigoPostal,
          descripcion: item.Descripcion,
          periodoHistorico: item.periodoHistorico,
          provincia: item.poblacion_provincia,
          municipio: item.poblacion_municipio,
          localidad: item.poblacion_localidad,
          coordenadas: {
            latitud: parseFloat(item.coordenadas?.latitud),
            longitud: parseFloat(item.coordenadas?.longitud)
          }
        } as Monumento;
      })
    );
  }

  private esMonumentoValido(monumento: Monumento): boolean {
    const requiredStrings = [
      monumento.id,
      monumento.nombre,
      monumento.tipoMonumento,
      monumento.clasificacion,
      monumento.periodoHistorico,
      monumento.descripcion,
      monumento.localidad,
      monumento.provincia,
    ];

    const hasRequiredStrings = requiredStrings.every(v => typeof v === 'string' && v.trim().length > 0);
    const hasCoords = monumento.coordenadas &&
      !isNaN(monumento.coordenadas.latitud) &&
      !isNaN(monumento.coordenadas.longitud);

    return hasRequiredStrings && hasCoords;
  }


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

  actualizarFavorito(monumento: Monumento)
  {
    /*
    Alterna la presencia del monumento en la lista de favoritos:
    - Si no está, lo añade.
    - Si ya está, lo elimina.
    La lista al tratarse de una signal actualizará el localStorage automaticamente haciendo uso de los effects
    */
    this.listaMonumentosFavoritos.update( monumentosFavoritos => {
      const yaGuardado = monumentosFavoritos.some(m => m.id === monumento.id);
      return yaGuardado
        ? monumentosFavoritos.filter(m => m.id !== monumento.id)
        : [...monumentosFavoritos, monumento];
    });

    console.log(`Favorito ${monumento.nombre} actualizado en la lista (signal)`);
  }

  esFavorito(id: string): boolean {
    return this.listaMonumentosFavoritos().some(m => m.id === id);
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

}
