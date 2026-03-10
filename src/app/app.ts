import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabbar } from "./core/layout/tabbar/tabbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tabbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
