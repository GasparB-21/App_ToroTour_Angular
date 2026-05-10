import { Component, output } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  onMenuClick = output<void>();

  toggleMenu() {
    this.onMenuClick.emit();
  }
}
