import { Component, OnInit, AfterViewInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import * as L from 'leaflet';
import { CardPreview } from "../../../../shared/layout/card-preview/card-preview";
import { MonumentoService } from '../../services/monumento-service';
import { Monumento } from '../../models/monumento';
import { Toolbar } from '../../../../shared/layout/toolbar/toolbar';

@Component({
  selector: 'app-mapa-monumentos',
  standalone: true,
  imports: [RouterLink, CardPreview, Toolbar],
  templateUrl: './mapa-monumentos.html',
  styleUrl: './mapa-monumentos.css',
})
export class MapaMonumentos implements OnInit, AfterViewInit {
  private monumentoService = inject(MonumentoService);
  
  // Estado para controlar el menú de accesibilidad
  isFabOpen = signal(false);
  userCoords: [number, number] | null = null;
  private map!: L.Map;
  
  // Datos para la card (se inicializa con valores vacíos o por defecto)
  selectedPoi = signal({ name: 'Selecciona un monumento', type: '-' });
  
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
    this.map = L.map('map', { zoomControl: false }).setView([40.965, -5.664], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);
  }

  private cargarMonumentosReales() {
    // Configuramos el icono personalizado "pin.png"
    // Asegúrate de que pin.png esté en public/icons/ o ajusta la ruta
    const customIcon = L.icon({
      iconUrl: 'icons/mapa/pin.png', 
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.monumentoService.getMonumentos().subscribe({
      next: (monumentos: Monumento[]) => {        
        monumentos.forEach(m => {
          // Validamos que tenga coordenadas válidas antes de intentar pintarlo
          if (!isNaN(m.coordenadas.latitud) && !isNaN(m.coordenadas.longitud)) {
            L.marker([m.coordenadas.latitud, m.coordenadas.longitud], { icon: customIcon })
              .addTo(this.map)
              .on('click', () => {
                this.selectedPoi.set({ 
                  name: m.nombre, 
                  type: m.clasificacion // Usamos el atributo del modelo
                });
              });
          }
        });
      },
      error: (err) => console.error('Error al obtener monumentos:', err)
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.userCoords = [coords.latitude, coords.longitude];
        L.circleMarker(this.userCoords, { 
          radius: 8, 
          color: '#0A84FF', 
          fillColor: '#0A84FF', 
          fillOpacity: 1 
        }).addTo(this.map);
      });
    }
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
      case 'zoom-in':  this.map.zoomIn(); break;
      case 'zoom-out': this.map.zoomOut(); break;
      case 'pan-up':    this.map.panBy([0, -120]); break;
      case 'pan-down':  this.map.panBy([0, 120]); break;
      case 'pan-left':  this.map.panBy([-120, 0]); break;
      case 'pan-right': this.map.panBy([120, 0]); break;
      case 'locate':   
        if(this.userCoords) {
          this.map.flyTo(this.userCoords, 15);
        }
        break;
    }
  }  
}