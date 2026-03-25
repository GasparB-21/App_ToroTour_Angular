import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    // Espera 1 segundo y luego redirige
    setTimeout(() => {
      this.router.navigate(['/monumentos']);
    }, 1500);
  }
}
