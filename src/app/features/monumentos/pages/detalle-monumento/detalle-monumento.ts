import { Component, inject } from '@angular/core';
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
}
