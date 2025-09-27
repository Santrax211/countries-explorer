# Explorador de Países 🌍

Una aplicación web moderna para explorar información de países del mundo, construida con Next.js y la API de REST Countries.

## Características Implementadas

### Requisitos Mínimos
- **Lista de países**: Muestra nombre, bandera, región y población
- **Búsqueda por nombre**: Búsqueda en tiempo real (case-insensitive)
- **Filtro por región**: Dropdown con todas las regiones disponibles
- **Filtro por población**: Slider interactivo para rango mínimo y máximo
- **Modal de detalles**: Popup con información completa del país

### Funcionalidad Opcional Elegida
**Persistir filtros en la URL**: Los filtros de búsqueda, región y población se mantienen en la URL, permitiendo compartir enlaces con filtros específicos y navegación con historial del navegador.

### Características Adicionales
- **Modo oscuro/claro**: Toggle para cambiar entre temas
- **Diseño responsive**: Optimizado para móviles, tablets y desktop
- **Animaciones suaves**: Transiciones y efectos hover elegantes
- **Estados de carga**: Loading states y empty states
- **Interfaz en español**: Completamente traducida al castellano

## Tecnologías Utilizadas

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Para type safety
- **Tailwind CSS v4**: Para estilos y diseño responsive
- **ShadCN UI**: Componentes de interfaz de usuario
- **Lucide React**: Iconos
- **API REST Countries**: Fuente de datos de países

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ instalado
- npm, yarn o pnpm

### Instalación de dependencias

# Con npm
\`\`\`
npm install

### Ejecución en desarrollo

# Con npm
\`\`\`
npm run dev

## Disponibilidad
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Funcionalidades Detalladas

### Búsqueda y Filtros
- **Búsqueda por nombre**: Busca en nombres comunes y oficiales
- **Filtro por región**: África, Américas, Asia, Europa, Oceanía
- **Filtro por población**: Rango de 0 a 1.5 mil millones de habitantes
- **Persistencia en URL**: Los filtros se guardan automáticamente en la URL

### Modal de Detalles
Al hacer clic en cualquier país se abre un modal con:
- Nombre oficial y común
- Capital
- Población formateada
- Región
- Bandera en alta resolución

### Diseño Responsive
- **Móvil**: 1 columna, controles apilados
- **Tablet**: 2-3 columnas, controles en línea
- **Desktop**: 4+ columnas, layout completo

## API Utilizada

\`\`\`
https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital
\`\`\`

## Autor

Desarrollado como prueba técnica para demostrar habilidades en Next.js, consumo de APIs, manejo de estado y diseño responsive.
