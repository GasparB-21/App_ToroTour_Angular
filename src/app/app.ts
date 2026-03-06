import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabbar } from "./core/layout/tabbar/tabbar";
import { Toolbar } from "./core/layout/toolbar/toolbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tabbar, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ToroTour');
}
