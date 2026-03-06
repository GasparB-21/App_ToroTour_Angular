import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Monumento } from '../../../shared/models/monumento';

declare var Papa: any;

@Injectable({
  providedIn: 'root'
})
export class MonumentoService {
  // Ruta al archivo que descargaste de la JCyL
  private readonly csv = '/csv/relacion-monumentos.csv';

  constructor(private http: HttpClient) {}

  getMonumentos(): Observable<Monumento[]> {
    return this.http.get(this.csv, { responseType: 'text' }).pipe(
      map(csvData => {
        const results = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true
        });

        // Mapeamos los nombres de las columnas del CSV de la JCyL a nuestro modelo
        return results.data.map((item: any) => ({
          id: item['identificador'],
          nombre: item['nombre'],
          tipoMonumento: item['tipoMonumento'],
          identificadorBienInteresCultural: item['identificadorBienInteresCultural'],
          calle: item['calle'],
          clasificacion: item['clasificacion'],
          tipoConstruccion: item['tipoConstruccion'],
          codigoPostal: item['codigoPostal'],
          descripcion: item['Descripcion'],
          periodoHistorico: item['periodoHistorico'],
          provincia: item['poblacion_provincia'],
          municipio: item['poblacion_municipio'],
          localidad: item['poblacion_localidad'],
          coordenadas: {
            latitud: parseFloat(item['coordenadas_latitud']),
            longitud: parseFloat(item['coordenadas_longitud'])
          }      
        }));
      })
    );
  }
}