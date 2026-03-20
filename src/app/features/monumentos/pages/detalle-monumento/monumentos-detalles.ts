import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { Monumento } from '../../models/monumento.interface';



import { MonumentoService } from '../../services/monumentos.service';
import { ImagenesMonumentosService } from '../../services/imagenes-monumentos.service';
import { Directions } from "../../../../shared/layout/directions/directions";

@Component({
  selector: 'app-detalle-monumento',
  standalone: true,
  imports: [Directions],
  templateUrl: './monumentos-detalles.html',
  styleUrl: './monumentos-detalles.css',
})
export class DetalleMonumento {
  private _route = inject(ActivatedRoute);
  private _monumentosService = inject(MonumentoService);
  private _imagenesService = inject(ImagenesMonumentosService);

  //Obtenemos el valor del monumento
  readonly monumento = toSignal(
    this._route.paramMap.pipe(
      map((params) => params.get('id')?.trim() ?? ''),
      switchMap((id) => (id ? this._monumentosService.getMonumentoById(id) : of(undefined)))
    ),
    { initialValue: undefined }
  );


  //Obtenemos las imágenes correspondientes a partir de los valores del monumento
  /*=======*/
  /*PERIODO*/
  /*=======*/
  readonly imagenPeriodo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getImagenPeriodo(monumento?.periodoHistorico);
  });

  readonly nombrePeriodo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getNombrePeriodo(monumento?.periodoHistorico);
  });
  /*====*/
  /*TIPO*/
  /*====*/
  readonly imagenTipo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getImagenTipo(monumento?.tipoMonumento);
  });

  readonly nombreTipo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getNombreTipo(monumento?.tipoMonumento);
  }); 
  /*=============*/
  /*CLASIFICACIÓN*/
  /*=============*/
  readonly imagenClasificacion = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getImagenClasificacion(monumento?.clasificacion);
  });

  readonly nombreClasificacion = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getNombreClasificacion(monumento?.clasificacion);
  });   


  //Lógica favoritos
  readonly esFavorito = computed(() => {
    const monumento = this.monumento();
    return monumento ? this._monumentosService.esFavorito(monumento.id) : false;
  });

  actualizarFavorito(){
    const monumentoActual = this.monumento();
    if (monumentoActual) {
      this._monumentosService.actualizarFavorito(monumentoActual);
    } else {
      //En este caso como recuperamos el monumento a partir del segment del path puede q se produzca un error y obtenegamos undefined
      //Manejamos el error mediante un guard
      console.error('El monumento no puede añadirse a favoritos');
    }
  }
}
