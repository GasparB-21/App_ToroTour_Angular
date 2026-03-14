import { Component, OnInit, AfterViewInit, signal, inject, NgZone } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import * as L from 'leaflet';
import { CardPreview } from "../../../../shared/layout/card-preview/card-preview";
import { MonumentoService } from '../../services/monumentos.service';
import { Monumento } from '../../models/monumento.interface';
import { Toolbar } from '../../../../shared/layout/toolbar/toolbar';

@Component({
  selector: 'app-mapa-monumentos',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CardPreview, Toolbar],
  templateUrl: './monumentos-mapa.html',
  styleUrl: './monumentos-mapa.css',
})
export class MapaMonumentos implements OnInit, AfterViewInit {
  private _monumentoService = inject(MonumentoService);
  private _zone = inject(NgZone);
  
  // Estado para controlar el menú de accesibilidad
  isFabOpen = signal(false);
  userCoords = signal<[number, number] | null>(null);
  private _map!: L.Map;
  
  // Monumento actualmente seleccionado en el mapa
  selectedMonumento = signal<Monumento | null>(null);
  
  readonly FAB_LAYOUT: any = {
    'pan-up':    { x: -120, y: -60 }, 
    'zoom-in':   { x: -60, y: -60 }, 
    'pan-right': { x: -60, y: 0 }, 
    'zoom-out':  { x:   -60, y:  60 }, 
    'pan-down':  { x: -120, y:  60 }, 
    'pan-left':  { x: -180, y: 0 }, 
  };

  ngOnInit() {
    // La carga de datos la manejamos después de que el mapa exista (AfterViewInit)
    // para evitar errores de "map not initialized"
  }

  ngAfterViewInit() {
    this.initMap();
    this.getUserLocation();
    this.cargarMonumentosReales();
  }

  private initMap() {
    // Inicializamos el mapa centrado en Salamanca
    this._map = L.map('map', { zoomControl: false }).setView([40.965, -5.664], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this._map);
  }

  private cargarMonumentosReales() {
    // Configuramos el icono personalizado "pin.png"
    // Asegúrate de que pin.png esté en public/icons/ o ajusta la ruta
    const customIcon = L.icon({
      iconUrl: 'icons/mapa/icon-pin.png', 
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this._monumentoService.getMonumentos().subscribe({
      next: (monumentos: Monumento[]) => {        
        monumentos.forEach(m => {
          // Validamos que tenga coordenadas válidas antes de intentar pintarlo
          if (!isNaN(m.coordenadas.latitud) && !isNaN(m.coordenadas.longitud)) {
            L.marker([m.coordenadas.latitud, m.coordenadas.longitud], { icon: customIcon })
              .addTo(this._map)
              .on('click', () => {
                this.selectedMonumento.set(m);
              });
          }
        });
      },
      error: (err) => console.error('Error al obtener monumentos:', err)
    });
  }

  getUserLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordsTuple: [number, number] = [coords.latitude, coords.longitude];
        this._zone.run(() => this.userCoords.set(coordsTuple));

        L.circleMarker(coordsTuple, { 
          radius: 8, 
          color: 'var(--tabbar-active)', 
          fillColor: 'var(--tabbar-active)', 
          fillOpacity: 1 
        }).addTo(this._map);
      },
      (error) => {
        console.error('No se pudo obtener la ubicación del usuario', error);
      }
    );
  }

  toggleFab() {
    this.isFabOpen.update(v => !v);
  }

  getTransform(action: string) {
    const pos = this.FAB_LAYOUT[action];
    if (this.isFabOpen() && pos) {
      return `translate(${pos.x}px, ${pos.y}px)`;
    }
    return 'translate(0, 0)';
  }  

  executeAction(action: string) {
    switch (action) {
      case 'zoom-in':  this._map.zoomIn(); break;
      case 'zoom-out': this._map.zoomOut(); break;
      case 'pan-up':    this._map.panBy([0, -120]); break;
      case 'pan-down':  this._map.panBy([0, 120]); break;
      case 'pan-left':  this._map.panBy([-120, 0]); break;
      case 'pan-right': this._map.panBy([120, 0]); break;
      case 'locate':   
        const coords = this.userCoords();
        if(coords) {
          this._map.flyTo(coords, 15);
        }
        break;
    }
  }  
}
