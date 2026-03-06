import { Routes } from "@angular/router";
import { CalendarioEventos } from "./pages/calendario-eventos/calendario-eventos";
import { EventosListado } from "./pages/eventos-listado/eventos-listado";
import { DetalleEvento } from "./pages/detalle-evento/detalle-evento";

export const eventosRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'calendario',
                component: CalendarioEventos
            },
            {
                path: 'listado',
                component: EventosListado
            },
            {
                path: 'detalle',
                component: DetalleEvento
            },
            {
                path: '**',
                redirectTo: 'calendario'
            }
        ]
    }
]
