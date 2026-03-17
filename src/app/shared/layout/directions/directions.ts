import { Component, input } from '@angular/core';

@Component({
  selector: 'app-directions',
  imports: [],
  templateUrl: './directions.html',
  styleUrl: './directions.css',
})
export class Directions {
  localidad = input<string>();
  provincia = input<string>();
  coordenadas = input<any>();

  abrirMapa(coords: any) {
    window.open(`https://www.google.com/maps?q=${coords.latitud},${coords.longitud}`, '_blank');
  }
}
