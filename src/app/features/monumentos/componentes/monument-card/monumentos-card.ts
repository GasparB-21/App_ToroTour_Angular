import { Component, inject, input, output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Monumento } from '../../models/monumento.interface';

import { MonumentoService } from '../../services/monumentos.service';
import { ImagenesMonumentosService } from '../../services/imagenes-monumentos.service';

@Component({
  selector: 'app-monument-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './monumentos-card.html',
  styleUrl: './monumentos-card.css',
})
export class MonumentoCard {
  monumento = input.required<Monumento>();
  //favorito = output
  private _imagenesService = inject(ImagenesMonumentosService);

  //Obtenemos la imagen y tipo a partir de los diccionarios
  readonly imagenPeriodo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getImagenPeriodo(monumento?.periodoHistorico);
  });
  readonly nombreTipo = computed(() => {
    const monumento = this.monumento();
    return this._imagenesService.getNombreTipo(monumento?.tipoMonumento);
  }); 

  //FUNCIONALIDADES
  //Añadir a favoritos
  private _servicioMonumentos = inject(MonumentoService)
  readonly esFavorito = computed(() => this._servicioMonumentos.esFavorito(this.monumento().id));

  actualizarFavorito(){ this._servicioMonumentos.actualizarFavorito(this.monumento()) }
}
