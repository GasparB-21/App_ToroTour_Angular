import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ONBOARDING_IMAGES, ONBOARDING_TEXT } from '../../models/onboardingResources';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-onboarding-page',
  imports: [],
  templateUrl: './onboarding-page.html',
  styleUrl: './onboarding-page.css',
})
export class OnboardingPage {
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);

  currentIndex = 0;

  /*
  private images: string[] = [
    ONBOARDING_IMAGES[0].ilustracionImg,
    ONBOARDING_IMAGES[0].tabbarImg,
  ];
  */

  /*
  get currentImage(): string {
    return this.images[this.currentIndex];
  }
  */
  getCurrentILustracion(): string
  {
    return ONBOARDING_IMAGES[this.currentIndex].ilustracionImg
  }

  getCurrentTabbarImg(): string
  {
    return ONBOARDING_IMAGES[this.currentIndex].tabbarImg
  }
  
  getCurrentText(): string
  {
    return ONBOARDING_TEXT[this.currentIndex]
  }

  next() {
    if (this.currentIndex < ONBOARDING_IMAGES.length - 1) {
      this.currentIndex++;
    } else {
      // Marca el onboarding como completado antes de navegar
      this.onboardingService.completeOnboarding();
      this.router.navigate(['/monumentos']);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  get progressPercent(): number {
    return ((this.currentIndex + 1) / ONBOARDING_IMAGES.length) * 100;
  }

  get isPrevDisabled(): boolean {
    return this.currentIndex === 0;
  }

  get isLastImage(): boolean {
    return this.currentIndex === ONBOARDING_IMAGES.length - 1;
  }
}
