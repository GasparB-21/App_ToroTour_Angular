import { Component, output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  onSearch = output<string>();
  onFilterClick = output<void>();

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch.emit(value);
  }

  handleFilter() {
    this.onFilterClick.emit();
  }
}
