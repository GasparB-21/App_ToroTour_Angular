# Proyecto

ToroTour es una aplicación web desarrollada con Angular, Node.js y MongoDB para consultar 
monumentos y eventos culturales de Salamanca, incluyendo un sistema de favoritos.

# Stack

- Frontend: Angular
- Backend: Node.js + Express
- Base de datos: MongoDB

# Arquitectura

- Angular consume una API REST desarrollada con Express.
- El backend utiliza servicios separados para el acceso a datos.
- MongoDB almacena monumentos, eventos y favoritos.
- La colección favoritos puede contener referencias tanto a monumentos como a eventos.

# Convenciones

- Usar async/await en backend.
- Mantener separación entre rutas y servicios.
- Responder siempre con JSON.
- Usar códigos HTTP adecuados.
- Mantener estilo simple y legible.

# Objetivo

Priorizar claridad del código y simplicidad arquitectónica frente a soluciones 
excesivamente complejas.

# Reglas

Tratar de mantener en la medida de lo posible el código original. Solo hacer refactori-
zaciones cuando sea estrictamente necesario.
No borrar mis comentarios.

# Estructura interna del frontend Angular

## Estructura de carpetas

```
src/app/
├── core/                         # Funcionalidad central (splash, tabbar, guards)
│   ├── guards/onboarding.guard.ts
│   ├── layout/tabbar/
│   └── splash/
├── features/                     # Módulos funcionales (lazy-loaded)
│   ├── monumentos/               # Monumentos (mapa, listado, detalles)
│   ├── eventos/                  # Eventos (calendario, listado, detalles)
│   ├── favoritos/                # Favoritos (monumentos + eventos en tabs)
│   └── onboarding/               # Guía de primer uso
├── shared/layout/                # Componentes reutilizables
│   ├── toolbar/                  # Barra de búsqueda + filtro
│   ├── card-preview/             # Tarjeta preview para mapa/calendario
│   └── directions/               # Enlace a Google Maps
├── app.ts / app.routes.ts        # Componente raíz y rutas principales
└── app.config.ts                 # Configuración Angular (providers)
```

## Rutas

- `/` -> Splash (redirige a `/monumentos/mapa` tras 1.5s)
- `/monumentos/mapa` | `/monumentos/listado` | `/monumentos/detalles/:id`
- `/eventos/calendario` | `/eventos/listado` | `/eventos/detalles/:id`
- `/favoritos/listado`
- `/onboarding` (protegido por guard, solo primera vez)

## Cada feature sigue esta estructura

```
feature/
├── models/          # Interfaces (monumento.interface.ts, evento.interface.ts)
├── services/        # Servicios HTTP + estado (Signals)
├── pages/           # Páginas/vistas principales
└── componentes/     # Componentes específicos (cards, etc.)
```

## Patrones clave

- **Standalone components** (sin NgModules)
- **Angular Signals** para estado (favoritos, filtros, datos reactivos)
- **RxJS** para HTTP (`getMonumentos()`, `getEventos()`) convertido a signals con `toSignal()`
- **Computed signals** para listas filtradas y categorías
- **Leaflet** para el mapa interactivo con geolocalización
- API REST en `http://localhost:3000/api` (configurable en `environments/`)

## Servicios principales

| Servicio | Responsabilidad |
|----------|----------------|
| `MonumentoService` | CRUD monumentos + favoritos (signals) |
| `EventosService` | CRUD eventos + favoritos (signals) |
| `ImagenesMonumentosService` | Mapeo atributos -> imágenes (periodo, tipo, clasificación) |
| `OnboardingService` | Estado onboarding en localStorage |

## Endpoints API consumidos

- `GET/POST/DELETE /api/monumentos`, `/api/eventos`, `/api/favoritos`
- Los servicios manejan múltiples formatos de respuesta (array directo, `{ data: [] }`, `{ monumentos: [] }`)

## Dependencias relevantes

- Angular 21.2.2, TypeScript 5.9.2
- Leaflet 1.9.4 (mapas), PapaParse 5.5.3 (CSV)
- Vitest (testing), Prettier (formato)
- CSS puro con variables (sin Ionic ni Angular Material)