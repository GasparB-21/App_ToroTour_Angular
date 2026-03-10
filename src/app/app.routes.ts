import { Routes } from '@angular/router';
import { monumentosRoutes } from './features/monumentos/monumentos-routes';

export const routes: Routes = [
    {
        path: 'monumentos',
        children: monumentosRoutes

        /*loadChildren: () =>
            import('./features/monumentos/monumentos-routes').then(m => m.monumentosRoutes)
        */
    },
    {
        path: 'eventos',
        loadChildren: () =>
            import('./features/eventos/eventos-routes').then(m => m.eventosRoutes)
    },
    {
        path: 'favoritos',
        loadChildren: () =>
            import('./features/favoritos/favoritos-routes').then(m => m.favoritosRoutes)
    },
    {
        path: '**',
        redirectTo: 'monumentos'
    }
];
