import { Routes } from '@angular/router';
import { monumentosRoutes } from './features/monumentos/monumentos.routes';
import { OnboardingPage } from './features/onboarding/pages/onboarding-page/onboarding-page';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { SplashComponent } from './core/splash/splash.component';

export const routes: Routes = [
    {
        path: '',
        component: SplashComponent,
    },
    {
        path: 'monumentos',
        canActivate: [onboardingGuard],
        loadChildren: () => import('./features/monumentos/monumentos.routes').then(m => m.monumentosRoutes)
    },
    {
        path: 'eventos',
        canActivate: [onboardingGuard],
        loadChildren: () =>
            import('./features/eventos/eventos-routes').then(m => m.eventosRoutes)
    },
    {
        path: 'favoritos',
        canActivate: [onboardingGuard],
        loadChildren: () =>
            import('./features/favoritos/favoritos.routes').then(m => m.favoritosRoutes)
    },
    {
        path: 'onboarding',
        component: OnboardingPage,
    },
    {
        path: '**',
        redirectTo: ''
    }
];
