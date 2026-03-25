import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly ONBOARDING_COMPLETED_KEY = 'false';

  /**
   * Verifica si el usuario ya completó el onboarding
   */
  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(this.ONBOARDING_COMPLETED_KEY) === 'true';
  }

  /**
   * Marca el onboarding como completado
   */
  completeOnboarding(): void {
    localStorage.setItem(this.ONBOARDING_COMPLETED_KEY, 'true');
  }

  /**
   * Reinicia el onboarding (útil para testing)
   */
  resetOnboarding(): void {
    localStorage.removeItem(this.ONBOARDING_COMPLETED_KEY);
  }
}
