# Despliegue Híbrido: Railway + Supabase

## Arquitectura

```
Frontend (Railway)  ←→  Backend (Railway)  ←→  Supabase (PostgreSQL)
    Astro SSR             AdonisJS                BD persistente gratis (500MB)
```

> **Nota**: Ambos servicios van en Railway porque `@astrojs/vercel` no es compatible con Astro 7. Railway soporta Node.js SSR sin problemas.

## 1. Base de Datos - Supabase

### Crear proyecto
1. Ve a [supabase.com](https://supabase.com) e inicia sesión con GitHub
2. Click en "New Project"
3. Configura nombre, región (elige la más cercana), y contraseña de la DB
4. Espera a que se provisione (~2 min)

### Obtener credenciales
1. Ve a **Project Settings → Database**
2. En "Connection string" selecciona **URI** y copia:
   - `DB_HOST`: `db.xxxxx.supabase.co`
   - `DB_PORT`: `5432`
   - `DB_USER`: `postgres`
   - `DB_PASSWORD`: tu contraseña
   - `DB_DATABASE`: `postgres`

## 2. Backend - Railway

### Desplegar
1. Ve a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Click en "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repositorio `internships`
4. Railway detectará automáticamente los servicios por los `railway.json`
5. Para el servicio backend, configura **Root Directory**: `packages/back`

### Variables de entorno
En Settings > Environment del servicio backend:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3333` |
| `HOST` | `0.0.0.0` |
| `APP_KEY` | Generar: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `APP_URL` | `${{Railway.PUBLIC_URL}}` |
| `SESSION_DRIVER` | `cookie` |
| `LOG_LEVEL` | `info` |
| `DB_HOST` | `db.xxxxx.supabase.co` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | (de Supabase) |
| `DB_DATABASE` | `postgres` |
| `GOOGLE_CLIENT_ID` | (de Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | (de Google Cloud Console) |
| `FRONTEND_URL` | (URL del frontend en Railway, se actualiza después) |
| `GOOGLE_CALLBACK_URL` | `${{Railway.PUBLIC_URL}}/api/v1/auth/google/callback` |

### Generar dominio
1. Settings > Networking > "Generate Domain"
2. Copia la URL generada (ej: `https://internships-back.up.railway.app`)

## 3. Frontend - Railway

### Desplegar
1. En el mismo proyecto de Railway, agrega otro servicio desde el mismo repo
2. Configura **Root Directory**: `packages/front`

### Variables de entorno
En Settings > Environment del servicio frontend:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PUBLIC_API_URL` | `https://internships-back.up.railway.app/api/v1` |

### Generar dominio
1. Settings > Networking > "Generate Domain"
2. Copia la URL generada (ej: `https://internships-front.up.railway.app`)

## 4. Google OAuth

### Configurar en Google Cloud Console
1. Ve a [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Selecciona tu proyecto OAuth
3. En **Authorized redirect URIs**, agrega:
   ```
   https://internships-back.up.railway.app/api/v1/auth/google/callback
   ```
4. En **Authorized JavaScript origins**, agrega:
   ```
   https://internships-front.up.railway.app
   ```

### Actualizar variables cruzadas
1. En Railway (backend), actualiza `FRONTEND_URL` con la URL del frontend
2. En Railway (backend), actualiza `GOOGLE_CALLBACK_URL` con la URL del backend
3. Redeploy en Railway para aplicar cambios

## 5. Verificar despliegue

1. **Backend**: visita `https://internships-back.up.railway.app/` → debe responder `{ "hello": "world" }`
2. **Frontend**: visita `https://internships-front.up.railway.app/` → debe cargar la landing page
3. **Login**: prueba iniciar sesión con Google
4. **Dashboard**: prueba crear/editar/eliminar actividades

## Notas

- **Auto-deploy**: Railway despliega automáticamente al hacer push a main
- **Logs**: Railway → Deployments > View Logs
- **BD**: Supabase te permite ver/editar datos en el dashboard (Table Editor)
- **Costo**: Supabase (gratis 500MB), Railway (~$1-2/mes con $5 crédito gratis para ambos servicios)
- **Alternativa Vercel**: Si prefieres Vercel para el frontend, habría que bajar Astro a v6 o esperar compatibilidad con `@astrojs/vercel`
