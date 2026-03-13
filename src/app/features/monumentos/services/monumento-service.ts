import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Monumento } from '../models/monumento';

declare var Papa: any;

@Injectable({
  providedIn: 'root'
})

export class MonumentoService {
  // Ruta al archivo con los datos de la JCyL
  private readonly csv = '/csv/relacion-monumentos.csv';
  constructor(private http: HttpClient) {}

  //Esta función devolvera un Observable q emitira un array de monumentos
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
        return results.data.map((item: any) => ({
          id: String(item['identificador'] ?? '').trim(),
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

// devuelve undefined si no existe ningún monumento con ese id
getMonumentoById(id: string): Observable<Monumento | undefined> {
  const normalizedId = id.trim();

  return this.getMonumentos().pipe(
    map(monumentos => monumentos.find(m => m.id === normalizedId))
  );
}
}
