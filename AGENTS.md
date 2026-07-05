# AGENTS.md - Guía del Proyecto Internship Tracker

## Guía de Uso de opencode

### Comandos útiles
- `npm run dev` - Iniciar desarrollo
- `npm run build` - Construir para producción
- `npm run lint` - Verificar código
- `npm run typecheck` - Verificar tipos TypeScript

### Cuando trabajes en este proyecto
1. Lee los archivos relevantes antes de hacer cambios
2. Sigue las convenciones de código establecidas
3. Ejecuta `npm run lint` y `npm run typecheck` antes de commit
4. Usa los templates de issues y PRs

## Convenciones de Código

### Estilo
- **Sin punto y coma** (`semi: false`)
- **Comillas simples** (`singleQuote: true`)
- **Archivos en snake_case**: `user_controller.ts`, `access_tokens.ts`
- **Clases en PascalCase**: `UserController`, `AccessTokensService`
- **Funciones/variables en camelCase**: `getUser()`, `userName`
- **Constantes en UPPER_CASE**: `API_VERSION`, `MAX_RETRIES`
- **Indentación**: 2 espacios
- **Ancho de línea**: 100 caracteres

### TypeScript
- Usar `import type` para imports de tipo
- Path aliases con `#`: `#models/user`, `#controllers/auth`
- Decoradores para ORM: `@column()`, `@hasMany()`
- Estricto: `strictNullChecks`, `noImplicitAny`

### Imports
```typescript
// Correcto
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

// Incorrecto
const User = require('#models/user')
```

### Controllers
- Un controller por archivo
- Métodos HTTP: `store`, `show`, `update`, `destroy`
- Usar `HttpContext` para acceder a request/response
- Validar con `request.validateUsing(validator)`

### Rutas
- Prefijo versionado: `/api/v1/`
- Agrupar por contexto: `/api/v1/auth/`, `/api/v1/tasks/`
- Nombrar grupos: `.as('auth')`, `.as('tasks')`

## Arquitectura

### Estructura del Monorepo
```
internship-tracker/
├── packages/
│   ├── back/          # Backend API (AdonisJS 7)
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   └── validators/
│   │   ├── config/
│   │   ├── database/
│   │   │   └── migrations/
│   │   └── start/
│   └── front/         # Frontend (pendiente)
├── AGENTS.md
├── package.json
└── pnpm-workspace.yaml
```

### Stack Tecnológico
- **Backend**: AdonisJS 7 + TypeScript
- **Base de datos**: SQLite (better-sqlite3)
- **ORM**: Lucid
- **Autenticación**: Token-based (DbAccessTokens)
- **Gestor de paquetes**: pnpm
- **Validación**: VineJS

### Decisiones Técnicas
- Monorepo para separar backend/frontend
- SQLite para desarrollo simple sin configuración
- Tokens de acceso para autenticación stateless
- Transformadores para respuestas consistentes

## Comandos Disponibles

### Desarrollo
```bash
pnpm dev          # Iniciar backend y frontend en paralelo
pnpm dev:back     # Solo backend
pnpm dev:front    # Solo frontend
```

### Build
```bash
pnpm build        # Construir todos los paquetes
```

### Calidad de Código
```bash
pnpm lint         # Ejecutar ESLint en todos los paquetes
pnpm typecheck    # Verificar tipos TypeScript
```

### Testing
```bash
pnpm test         # Ejecutar tests en todos los paquetes
```

## Flujo de Trabajo

### Estrategia de Ramas
- **`main`**: Producción estable. Solo el owner mergea aquí.
- **`dev`**: Desarrollo integrado. Recibe PRs de feature branches.
- **`feature/*`**: Ramas de desarrollo para cada issue/tarea.

### Naming de Ramas
```
feature/issue-123-nombre-descriptivo
fix/issue-456-corregir-error
chore/actualizar-dependencias
```

### Commits (Conventional Commits)
```
feat: añadir sistema de registro de actividades
fix: corregir autenticación de usuarios
chore: actualizar dependencias
docs: documentar endpoints de API
refactor: reorganizar estructura de controllers
test: añadir tests para modelo User
```

**Formato**: `<tipo>(<scope>): <descripción>`

**Tipos permitidos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `chore`: Tareas de mantenimiento
- `docs`: Documentación
- `refactor`: Refactorización sin cambio de funcionalidad
- `test`: Añadir o modificar tests
- `style`: Cambios de estilo (formato, espacios, etc.)
- `perf`: Mejoras de rendimiento
- `ci`: Cambios en CI/CD

### Pull Requests

#### Flujo
1. Crear issue (bug, feature, task)
2. Crear branch `feature/nombre-descriptivo` desde `dev`
3. Desarrollar y commitear con conventional commits
4. Abrir PR → `dev`
5. Review + merge a `dev`
6. Cuando esté listo → PR `dev` → `main` (release)

#### Template de PR
```markdown
## Tipo de cambio
- [ ] feat: Nueva funcionalidad
- [ ] fix: Corrección de bug
- [ ] chore: Tareas de mantenimiento
- [ ] docs: Documentación
- [ ] refactor: Refactorización

## Descripción
Descripción clara de los cambios.

## Cambios realizados
- Cambio 1
- Cambio 2

## Testing
- [ ] Tests unitarios pasan
- [ ] Tests funcionales pasan
- [ ] Lint sin errores
- [ ] Typecheck sin errores

## Issue relacionada
Closes #...
```

#### Reglas de PRs
- Título claro usando conventional commits
- Describir qué cambia y por qué
- Incluir issue relacionada
- Pasar todos los checks (lint, typecheck, tests)
- Review aprobado antes de merge
- Squash commits al merge

### Issues

#### Tipos de Issue
1. **Bug Report**: Reportar errores
2. **Feature Request**: Sugerir funcionalidades
3. **Task**: Tareas de pasantía

#### Labels
- `bug`: Algo no funciona correctamente
- `enhancement`: Nueva funcionalidad o mejora
- `task`: Tarea de pasantía
- `documentation`: Mejora en documentación
- `good first issue`: Buen primer issue para comenzar
- `priority: high`: Alta prioridad
- `priority: low`: Baja prioridad

#### Cómo crear una Issue
1. Usar el template correspondiente
2. Ser descriptivo en el título
3. Incluir pasos para reproducir (bugs)
4. Añadir labels apropiadas
5. Asignar si es necesario

### Release Process
1. Todas las features están en `dev`
2. Crear PR `dev` → `main`
3. Actualizar versión en package.json
4. Crear tag con versión: `git tag v1.0.0`
5. Merge a `main`
6. Crear release en GitHub
