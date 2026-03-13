import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { Monumento } from '../../models/monumento';
import { MonumentoService } from '../../services/monumento-service';

@Component({
  selector: 'app-detalle-monumento',
  standalone: true,
  imports: [],
  templateUrl: './detalle-monumento.html',
  styleUrl: './detalle-monumento.css',
})
export class DetalleMonumento {
  private route = inject(ActivatedRoute);
  private monumentosService = inject(MonumentoService);

  readonly monumento = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')?.trim() ?? ''),
      switchMap((id) => (id ? this.monumentosService.getMonumentoById(id) : of(undefined)))
    ),
    { initialValue: undefined }
  );

  //FUNCIONALIDADES
  //Añadir a favoritos
  servicioMonuemntos = inject(MonumentoService)

  readonly esFavorito = computed(() => {
    const monumento = this.monumento();
    return monumento ? this.servicioMonuemntos.esFavorito(monumento.id) : false;
  });

  actualizarFavorito(){
    const currentMonumento = this.monumento();
    if (currentMonumento) {
      this.servicioMonuemntos.actualizarFavorito(currentMonumento);
    } else {
      //En este caso como recuperamos el monumento a partir del segment del path puede q se produzca un error y obtenegamos undefined
      //Manejamos el error mediante un guard
      console.error('No monumento available to add to favorites');
    }
  }
}
