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

  // devuelve undefined si no existe ningún monumento con ese id
  getMonumentoById(id: string): Observable<Monumento | undefined> {
    const normalizedId = id.trim();

    return this.getMonumentos().pipe(
      map(monumentos => monumentos.find(m => m.id === normalizedId))
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
}
