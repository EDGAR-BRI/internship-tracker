# Internship Tracker

Aplicación web para registrar y dar seguimiento a todas las actividades realizadas durante las pasantías. Facilita el control de tareas, anotaciones y progreso personal.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework Backend**: [AdonisJS v7](https://adonisjs.com/)
- **Lenguaje**: TypeScript
- **Base de datos**: SQLite (better-sqlite3)
- **Gestor de paquetes**: pnpm
- **Arquitectura**: Monorepo (pnpm workspaces)

## Estructura del Proyecto

```
internships/
├── packages/
│   ├── back/          # Backend API (AdonisJS)
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   └── validators/
│   │   ├── config/
│   │   ├── database/
│   │   │   └── migrations/
│   │   └── start/
│   │       └── routes.ts
│   └── front/         # Frontend (pendiente)
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Instalación

### Prerrequisitos

- Node.js >= 18
- pnpm >= 8

### Pasos

1. Clonar el repositorio
   ```bash
   git clone https://github.com/tu-usuario/internship-tracker.git
   cd internship-tracker
   ```

2. Instalar dependencias
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno
   ```bash
   cp packages/back/.env.example packages/back/.env
   ```

4. Generar la APP_KEY
   ```bash
   cd packages/back
   node ace generate:key
   ```

5. Ejecutar migraciones
   ```bash
   node ace migration:run
   ```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Iniciar backend y frontend en paralelo |
| `pnpm dev:back` | Iniciar solo el backend |
| `pnpm dev:front` | Iniciar solo el frontend |
| `pnpm build` | Construir el proyecto para producción |
| `pnpm lint` | Ejecutar linter en todos los paquetes |
| `pnpm typecheck` | Verificar tipos en todos los paquetes |
| `pnpm test` | Ejecutar tests en todos los paquetes |

## API Endpoints

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/v1/auth/signup` | Crear cuenta | No |
| POST | `/api/v1/auth/login` | Iniciar sesión | No |
| GET | `/api/v1/account/profile` | Obtener perfil | Sí |
| POST | `/api/v1/account/logout` | Cerrar sesión | Sí |

## Licencia

MIT
