import { Routes } from "@angular/router";
import { MapaMonumentos } from "./pages/mapa-monumentos/monumentos-mapa";
import { MonumentosListado } from "./pages/monumentos-listado/monumentos-listado";
import { DetalleMonumento } from "./pages/detalle-monumento/monumentos-detalles";

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
                path: 'detalles/:id',
                component: DetalleMonumento
            },
            {
                path: '**',
                redirectTo: 'mapa'
            }
        ]
    }
]
