import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { Monumento } from '../../models/monumento.interface';
import { MonumentoService } from '../../services/monumentos.service';

@Component({
  selector: 'app-detalle-monumento',
  standalone: true,
  imports: [],
  templateUrl: './monumentos-detalles.html',
  styleUrl: './monumentos-detalles.css',
})
export class DetalleMonumento {
  private _route = inject(ActivatedRoute);
  private _monumentosService = inject(MonumentoService);

  readonly monumento = toSignal(
    this._route.paramMap.pipe(
      map((params) => params.get('id')?.trim() ?? ''),
      switchMap((id) => (id ? this._monumentosService.getMonumentoById(id) : of(undefined)))
    ),
    { initialValue: undefined }
  );

  //FUNCIONALIDADES
  //Añadir a favoritos
  servicioMonumentos = inject(MonumentoService)

  readonly esFavorito = computed(() => {
    const monumento = this.monumento();
    return monumento ? this.servicioMonumentos.esFavorito(monumento.id) : false;
  });

  actualizarFavorito(){
    const monumentoActual = this.monumento();
    if (monumentoActual) {
      this.servicioMonumentos.actualizarFavorito(monumentoActual);
    } else {
      //En este caso como recuperamos el monumento a partir del segment del path puede q se produzca un error y obtenegamos undefined
      //Manejamos el error mediante un guard
      console.error('El monumento no puede añadirse a favoritos');
    }
  }
}
