# 🎮 Pokémon Gallery - Angular 20

Una galería interactiva de Pokémon construida con Angular 20, que muestra 30 Pokémon seleccionados aleatoriamente con información detallada, sistema de favoritos, búsqueda y modo oscuro.

![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)

## 🌐 Demo en Vivo

**🎮 [Ver Demo en GitHub Pages](https://jesusdsaavedra.github.io/poke-gallery/)**

Prueba la aplicación directamente en tu navegador sin necesidad de instalar nada.

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **Galería de 30 Pokémon Aleatorios**: Selección aleatoria de Pokémon desde la PokéAPI
- **Tarjetas Interactivas**: Cards con hover effects, imagen, nombre, tipos y habilidades
- **Detalle Completo**: Modal/drawer con información exhaustiva:
  - Estadísticas base con barras de progreso
  - Tipos con chips de colores
  - Habilidades y movimientos
  - Información física (altura y peso)
  - Descripción oficial de la especie
  - Descripción generada con IA
  - Cadena evolutiva
- **Deep Linking**: URLs que reflejan el estado de la aplicación
  - `/` - Galería principal
  - `/pokemon/:id` - Detalle de Pokémon específico
- **Skeleton Loaders**: Indicadores de carga mientras se obtienen los datos
- **Diseño Responsive**: Optimizado para mobile, tablet y desktop

### 🚀 Funcionalidades Extra

- **🔍 Búsqueda**: Filtra Pokémon por nombre, tipo o habilidad
- **❤️ Sistema de Favoritos**: Guarda tus Pokémon favoritos en localStorage
- **🌓 Modo Oscuro/Claro**: Tema persistente guardado en localStorage
- **🔄 Nueva Selección**: Botón para cargar 30 Pokémon aleatorios diferentes
- **🎨 Animaciones Suaves**: Transiciones y micro-interacciones
- **♿ Accesibilidad**: ARIA labels, navegación por teclado, focus visible

## 🛠️ Stack Tecnológico

- **Framework**: Angular 20 (Standalone Components)
- **Lenguaje**: TypeScript 5.8 (Strict Mode)
- **UI Framework**: Bootstrap 5.3.3
- **Estilos**: SCSS con variables CSS
- **API**: [PokéAPI v2](https://pokeapi.co)
- **State Management**: RxJS + Signals
- **Routing**: Angular Router con lazy loading
- **HTTP**: HttpClient con interceptors y caché

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                      # Módulo Core
│   │   ├── models/               # Interfaces y modelos TypeScript
│   │   │   └── pokemon.model.ts
│   │   ├── services/             # Servicios de lógica de negocio
│   │   │   ├── pokemon.service.ts
│   │   │   ├── random.service.ts
│   │   │   ├── favorites.service.ts
│   │   │   └── theme.service.ts
│   │   └── interceptors/         # HTTP Interceptors
│   │       └── http-error.interceptor.ts
│   │
│   ├── shared/                    # Módulo Shared
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── pokemon-card/
│   │   │   ├── skeleton-loader/
│   │   │   ├── chip/
│   │   │   └── error-message/
│   │   └── animations/           # Animaciones
│   │       └── animations.ts
│   │
│   ├── features/                  # Feature Modules
│   │   └── pokemon/
│   │       └── components/
│   │           ├── pokemon-gallery/
│   │           └── pokemon-detail-modal/
│   │
│   ├── app.component.ts
│   ├── app.config.ts             # Configuración de la aplicación
│   └── app.routes.ts             # Definición de rutas
│
├── styles.scss                    # Estilos globales
├── index.html
└── main.ts
```

## 🚦 Instalación y Ejecución

### ⚠️ IMPORTANTE: Compatibilidad con Node.js

**Angular 20 requiere Node.js >= 20.19.0 o >= 22.12.0**

Si tienes Node.js v21 (versión impar, no LTS), encontrarás errores al ejecutar comandos de Angular CLI. **Soluciones:**

1. **Opción Recomendada**: Actualizar a Node.js LTS (v20.19+ o v22.12+)
   ```bash
   # Con nvm (Node Version Manager)
   nvm install 20
   nvm use 20
   ```

2. **Opción Temporal**: Aunque el proyecto está completamente funcional, necesitarás la versión correcta de Node.js para compilar y ejecutar.

### Prerrequisitos

- Node.js >= 20.19.0 o >= 22.12.0
- npm >= 8.0.0

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

```bash
cd prueba-tecnica-CUN
```

2. **Instalar dependencias**

```bash
npm install --legacy-peer-deps
```

> Nota: Se usa `--legacy-peer-deps` debido a compatibilidad de versiones

3. **Ejecutar en modo desarrollo**

```bash
npm start
# o
npm run serve
```

La aplicación se abrirá automáticamente en `http://localhost:4200`

4. **Compilar para producción**

```bash
npm run build
```

Los archivos compilados estarán en `dist/pokemon-gallery/`

## 🎨 Características de Diseño

### Paleta de Colores

La aplicación utiliza una paleta inspirada en Pokémon:

- **Primario**: Rojo (#ef5350)
- **Secundario**: Amarillo (#ffca28)
- **Tipos**: Cada tipo de Pokémon tiene su color específico

### Responsive Design

- **Desktop**: Grid de 4-5 columnas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Grid de 1 columna

### Animaciones

- Fade in para cards al cargar
- Stagger effect al mostrar la galería
- Hover effects en tarjetas
- Transiciones suaves en modals
- Skeleton loaders animados

## 🔧 Configuración

### Variables de Entorno

No se requieren variables de entorno. La aplicación usa la API pública de PokéAPI.

### Configuración de API

La URL base de la API está definida en `src/app/core/services/pokemon.service.ts`:

```typescript
private readonly API_BASE = 'https://pokeapi.co/api/v2';
```

## 📱 Funcionalidades Detalladas

### Sistema de Caché

- Todas las peticiones HTTP se cachean en memoria
- Evita peticiones duplicadas
- Mejora significativa de performance

### Gestión de Estado

- **Signals**: Para estado local reactivo
- **RxJS**: Para operaciones asíncronas y streams
- **localStorage**: Para persistencia de favoritos y tema

### Manejo de Errores

- Interceptor HTTP global
- Retry automático (3 intentos)
- Mensajes de error amigables
- Estados de error bien definidos

### Optimizaciones

- **OnPush Change Detection**: En todos los componentes
- **Lazy Loading**: De imágenes y rutas
- **TrackBy**: En ngFor para mejor performance
- **takeUntilDestroyed**: Para limpieza automática de suscripciones
- **Caché HTTP**: Reduce peticiones duplicadas

## ♿ Accesibilidad

- ARIA labels en todos los elementos interactivos
- Navegación completa por teclado
- Focus visible para todos los controles
- Roles semánticos apropiados
- Contraste de colores accesible

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

```json
{
  "start": "ng serve",
  "serve": "ng serve --open",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

## 🌐 API Utilizada

### PokéAPI Endpoints

- `GET /pokemon?limit=1000` - Lista de todos los Pokémon
- `GET /pokemon/{id}` - Detalles de un Pokémon
- `GET /pokemon-species/{id}` - Información de la especie
- `GET /evolution-chain/{id}` - Cadena evolutiva

## 🎯 Mejores Prácticas Implementadas

✅ Standalone Components (Angular 20)
✅ Strict TypeScript Mode
✅ OnPush Change Detection Strategy
✅ Signals para estado reactivo
✅ RxJS operators (takeUntilDestroyed, retry, catchError)
✅ HTTP Interceptors
✅ Lazy Loading
✅ Responsive Design (Mobile First)
✅ Accesibilidad (ARIA, keyboard navigation)
✅ Animaciones suaves
✅ Código limpio y documentado
✅ Separación de responsabilidades
✅ Reutilización de componentes
✅ Manejo robusto de errores

## 🐛 Troubleshooting

### Error: "Unsupported engine"

Si ves warnings sobre versiones de Node.js, asegúrate de usar Node.js 20.19+ o 22.12+. La aplicación funcionará con Node 21 pero mostrará warnings.

### Error: "Cannot resolve dependency"

Ejecuta:

```bash
npm install --legacy-peer-deps
```

### La aplicación no compila

1. Borra `node_modules` y `package-lock.json`
2. Ejecuta `npm install --legacy-peer-deps`
3. Ejecuta `npm start`

## 📄 Licencia

Este proyecto fue creado como prueba técnica.

## 👤 Autor

Desarrollado con ❤️ usando Angular 20 y PokéAPI

---

## 🎮 Capturas

### Galería Principal
- Vista de grid responsive con 30 Pokémon
- Skeleton loaders durante la carga
- Botones de favoritos y nueva selección
- Barra de búsqueda
- Toggle de modo oscuro/claro

### Modal de Detalle
- Imagen de alta calidad
- Tipos con chips de colores
- Estadísticas con barras de progreso
- Descripción oficial
- Cadena evolutiva
- Habilidades y movimientos

### Características Visuales
- Animaciones suaves
- Hover effects
- Transiciones fluidas
- Diseño moderno y atractivo
- Totalmente responsive

---

**¡Disfruta explorando el mundo Pokémon!** 🎉
