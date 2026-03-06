import { Routes } from "@angular/router";
import { Favoritos } from "./favoritos/favoritos";

export const favoritosRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'listado',
                component: Favoritos
            },
            {
                path: '**',
                redirectTo: 'listado'
            }
        ]
    }
]