import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tabbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tabbar.html',
  styleUrl: './tabbar.css',
})
export class Tabbar {
}
