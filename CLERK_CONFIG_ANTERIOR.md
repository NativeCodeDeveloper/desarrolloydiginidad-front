# Configuracion anterior de Clerk

Respaldo creado antes de desactivar temporalmente la proteccion del dashboard.

## Objetivo original

El dashboard estaba protegido con Clerk y permisos por rol guardados en `publicMetadata.role` o `publicMetadata.rol`.

## Archivos involucrados

- `src/middleware.ts`
- `src/lib/dashboard-access.js`
- `src/app/dashboard/layout.jsx`
- `src/app/dashboard/SidebarNav.jsx`
- `src/app/dashboard/MobileNav.jsx`
- `src/app/dashboard/UserMenu.jsx`
- `src/app/api/dashboard/users/route.js`

## Middleware anterior

El archivo `src/middleware.ts` usaba:

```js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { canAccessDashboardPath, getDashboardRoleFromClaims } from "@/lib/dashboard-access";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isDashboardApiRoute = createRouteMatcher(["/api/dashboard(.*)"]);
const SUBSCRIPTION_CANCELLED_PATH = "/dashboard/suscripcion-cancelada";

export default clerkMiddleware(async (auth, req) => {
  if (!isDashboardRoute(req) && !isDashboardApiRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = getDashboardRoleFromClaims(sessionClaims);
  const pathname = req.nextUrl.pathname;

  if (isDashboardRoute(req) && role === "cancelado" && pathname !== SUBSCRIPTION_CANCELLED_PATH) {
    return NextResponse.redirect(new URL(SUBSCRIPTION_CANCELLED_PATH, req.url));
  }

  if (isDashboardRoute(req) && !canAccessDashboardPath(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard/no-access", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};
```

## Logica de roles anterior

En `src/lib/dashboard-access.js`:

- `DASHBOARD_ROLES` define los roles disponibles.
- `routeMatchersByRole` define rutas permitidas por rol.
- `routeDenyMatchersByRole` define rutas denegadas por rol.
- `globallyDeniedDashboardMatchers` bloquea rutas globalmente.
- `canAccessDashboardPath(role, pathname)` decide si una ruta del dashboard es accesible.
- `getDashboardRoleFromClaims(claims)` obtiene el rol desde Clerk.
- `getDashboardRoleFromUser(user)` obtiene el rol desde `user.publicMetadata`.
- `getVisibleDashboardSections(role)` filtra el menu visible.

La lectura del rol revisaba:

```js
source?.metadata?.role ||
source?.publicMetadata?.role ||
source?.public_metadata?.role ||
source?.unsafeMetadata?.role ||
source?.unsafe_metadata?.role ||
source?.publicMetadata?.rol ||
source?.public_metadata?.rol ||
source?.unsafeMetadata?.rol ||
source?.unsafe_metadata?.rol
```

## Comportamiento anterior

- Sin usuario Clerk: redireccion a `/sign-in`.
- Usuario con rol `cancelado`: redireccion a `/dashboard/suscripcion-cancelada`.
- Usuario sin permiso para ruta: redireccion a `/dashboard/no-access`.
- Rol `admin` o `default`: acceso completo.
- Menu desktop y movil filtrado por `getVisibleDashboardSections(role)`.

## Cambio temporal aplicado

- `src/middleware.ts` deja pasar `/dashboard` y `/api/dashboard` sin validar Clerk.
- `SidebarNav.jsx` usa rol temporal `admin` para mostrar todo el menu.
- `MobileNav.jsx` usa rol temporal `admin` para mostrar todo el menu.

Para restaurar Clerk, volver a poner el middleware anterior y devolver `SidebarNav.jsx` / `MobileNav.jsx` a lectura de `useUser()`.
