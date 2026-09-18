# Multimadera Web

Aplicación web desarrollada con React, TypeScript y Vite para gestionar procesos operativos y administrativos de una empresa de materiales de construcción. El sistema incluye autenticación, administración de empleados, clientes, materiales, pedidos, usuarios y reportería, además de integración con Supabase y una API backend para manejar los datos.

## ¿Qué incluye?

- Autenticación de usuarios con Supabase Auth
- Recuperación y restablecimiento de contraseña
- Administración de clientes, empleados y usuarios
- Gestión de materiales y pedidos
- Control de permisos por rol
- Reportes y consultas
- Interfaz moderna con React y Tailwind CSS
- Soporte PWA para uso cercano a una aplicación nativa

## Stack tecnológico

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Supabase JS
- Axios
- Recharts
- Vite PWA

## Estructura general

```text
src/
├── components/
├── features/
├── hooks/
├── pages/
├── routers/
├── services/
├── store/
├── supabase/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

## Requisitos previos

Antes de levantar el proyecto, asegúrate de tener instalado:

- Node.js 18 o superior
- npm o pnpm
- Un proyecto de Supabase configurado
- La API backend disponible

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/windows16/multimaderaWeb.git
cd multimaderaWeb
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_BASE_URL_API=http://localhost:3000
```

> Ajusta `VITE_BASE_URL_API` según la URL y el puerto donde se esté ejecutando tu backend.

## Levantar el proyecto en local

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Después abre la aplicación en tu navegador:

```text
http://localhost:5173
```

## Construcción para producción

Para generar la versión optimizada para producción:

```bash
npm run build
```

Para previsualizar la compilación localmente:

```bash
npm run preview
```

## Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila la aplicación para producción
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta ESLint
```

## Notas importantes

- La autenticación depende de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Las peticiones a la API utilizan `VITE_BASE_URL_API`.
- El cliente HTTP agrega automáticamente el token de sesión de Supabase a las peticiones autenticadas.
- El backend debe exponer los endpoints necesarios para clientes, empleados, materiales, pedidos, usuarios, permisos y reportes.
- No compartas claves privadas ni archivos `.env.local` en el repositorio.

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio.
3. Realiza y prueba tus modificaciones.
4. Ejecuta `npm run lint` y `npm run build`.
5. Abre un pull request con una descripción clara.

## Licencia

Este proyecto no especifica una licencia en el repositorio. Consulta con el propietario antes de reutilizarlo o distribuirlo.
