import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
  private monumentosService = inject(MonumentoService);

  readonly monumento = toSignal(
    this.monumentosService.getMonumentos()
                          .pipe(map((monumentos): Monumento | null => monumentos[0] ?? null)),
                          { initialValue: null as Monumento | null },
  );
}
