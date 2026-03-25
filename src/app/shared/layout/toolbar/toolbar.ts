import { Component, OnInit, output } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  onSearch = output<string>();
  onFilterClick = output<void>();

  //Inyectamos en el constructor
  constructor(private router: Router) {}

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch.emit(value);
  }

  handleFilter() {
    this.onFilterClick.emit();
  }

  //Función para mostrar un placaholder personalizado dependiendo de la feature en la q estemos
  isMonumentosFeature()
  {
    return this.router.url.includes("monumentos");
  }

  isFavoritosFeature()
  {
    return this.router.url.includes("favoritos");
  }

  getPlaceholder(){
    if(this.isFavoritosFeature()) { return "Buscar favoritos" }
    return this.isMonumentosFeature() ? "Buscar monumentos" : "Buscar eventos"
  }
}
