import { Routes } from "@angular/router";
import { MapaMonumentos } from "./pages/mapa-monumentos/mapa-monumentos";
import { MonumentosListado } from "./pages/monumentos-listado/monumentos-listado";
import { DetalleMonumento } from "./pages/detalle-monumento/detalle-monumento";

export const monumentosRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'mapa',
                component: MapaMonumentos
            },
            {
                path: 'listado',
                component: MonumentosListado
            },
            {
                path: 'detalle',
                component: DetalleMonumento
            },
            {
                path: '**',
                redirectTo: 'mapa'
            }
        ]
    }
]
