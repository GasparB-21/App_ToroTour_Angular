import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OnboardingService } from '../../features/onboarding/services/onboarding.service';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);
  
  // Si el usuario no ha completado el onboarding y NO está en la ruta de onboarding,
  // redirige a onboarding
  if (!onboardingService.hasCompletedOnboarding() && !state.url.includes('onboarding')) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};
