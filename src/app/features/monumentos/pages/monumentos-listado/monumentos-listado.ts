import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MonumentoCard } from '../../componentes/monument-card/monumentos-card';
import { Monumento } from '../../models/monumento.interface';
import { MonumentoService } from '../../services/monumentos.service';
import { Toolbar } from '../../../../shared/layout/toolbar/toolbar';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-monumentos-listado',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, Toolbar, MonumentoCard],
  templateUrl: './monumentos-listado.html',
  styleUrl: './monumentos-listado.css',
})
export class MonumentosListado {
  //Inyectamos el servicio desde el q recuperaremos los monumentos
  private _monumentos = inject(MonumentoService)    //DUDA: estandar para escribir _Nombre
  //Definimos la variable donde almacenaremos los monumentos
  readonly listadoMonumentos$: Observable<Monumento[]>

  //Definimos el constructor del componente
  constructor()
  {
    this.listadoMonumentos$ = this._monumentos.getMonumentos()
  }
  
}
