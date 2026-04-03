# Consorcio Activo — Landing Page

**Arquitectura técnica · v1.0**

| Campo | Valor |
|---|---|
| Producto | Landing page institucional para administración de consorcios |
| Enfoque | Vanilla Web · HTML5 semántico · CSS3 sin frameworks |
| Referencia técnica | *Vanilla Web* |
| Tipografía | Outfit 700/800 (títulos) · Manrope 400/500/600 (cuerpo) |
| Versión | 1.0 — Abril 2026 |

---

## Estructura del proyecto

```
consorcio-activo/
├── index.html            # Documento principal — HTML5 semántico
├── styles.css            # Estilos — CSS3 con @layer cascade
├── images/
│   └── hero.png          # Imagen de fondo sección hero (1920×1080)
└── icons/                
```

---

## Stack técnico

| Capa | Tecnología | Justificación |
|---|---|---|
| Markup | HTML5 semántico puro | `<header>` `<main>` `<nav>` `<section>` `<aside>` `<article>` `<blockquote>` · Sin div soup |
| Estilos | CSS3 · `@layer` cascade | 5 layers explícitos · Custom properties como design tokens · Sin preprocesadores |
| Layout | CSS Grid + Flexbox | Grid para secciones de dos columnas · Flex para nav, actions y listas |
| Tipografía | `clamp()` fluido | Escala tipográfica sin breakpoints arbitrarios |
| Scripts | Vanilla JS · DOM API | Nav scroll · Mobile burger · Form feedback · < 30 líneas |
| Fuentes | Google Fonts con `display=swap` | Sin bloqueo de render · Fallback a `system-ui` |
| Imágenes | `background-image` + overlay CSS | `::before` con gradiente oscuro sobre la imagen del hero |
| Metadata | Open Graph · Twitter Card · Canonical | SEO completo · Compartible en redes sociales |

---

## Arquitectura CSS — `@layer`

Cada layer tiene prioridad explícita: el último declarado gana sin necesidad de aumentar especificidad.

```
@layer reset, base, layout, components, responsive;
```

| Layer | Contenido | Responsabilidad |
|---|---|---|
| `reset` | Normalización del navegador | `box-sizing` · márgenes · `list-style` · `img` |
| `base` | Design tokens + escala tipográfica | Variables CSS (`:root`) · clases `.t-xl` `.t-lg` `.lead` `.eyebrow` |
| `layout` | Contenedores y estructura | `.container` · `.section` · `.sec-head` |
| `components` | Todos los componentes UI | Nav · Hero · Pilares · Cards · Form · Footer |
| `responsive` | Breakpoints + accesibilidad | `≤920px` · `≤600px` · `prefers-reduced-motion` |

---

## Estructura HTML — secciones

| Sección | Elemento | ID | Descripción |
|---|---|---|---|
| Navegación | `<nav>` | `#nav` | Sticky · Glassmorphism · Burger mobile |
| Hero | `<section>` | `#inicio` | Imagen de fondo · Overlay · Grid 2 col · Stats |
| Nosotros | `<section>` | `#nosotros` | Grid copia + cita institucional |
| Metodología | `<section>` | `#metodologia` | 4 pilares en grid |
| Diferenciales | `<section>` | `#diferenciales` | 4 cards 2×2 |
| Servicios | `<section>` | `#servicios` | Lista + aside sticky con CTA |
| Contacto | `<section>` | `#contacto` | Info de contacto + formulario |
| Footer | `<footer>` | — | Logo · Nav secundaria · Cierre institucional |

---

## Responsive

| Breakpoint | Cambios principales |
|---|---|
| `> 920px` | Layout completo · 2 columnas en hero, nosotros, servicios, contacto · 4 columnas en pilares |
| `≤ 920px` | Columna simple · Stats en grid 3 col · Pilares 2×2 |
| `≤ 600px` | Burger activo · Stats 2 col · Stats debajo del contenido del hero · Pilares y cards en columna |

---

## Accesibilidad

- `aria-label` en nav, aside, formulario y botón burger
- `aria-labelledby` en todas las secciones apuntando a su `<h2>`
- `aria-expanded` + `aria-controls` en el burger mobile
- `aria-hidden="true"` en elementos puramente decorativos
- `@media (prefers-reduced-motion: reduce)` desactiva todas las transiciones y el scroll suave

---

## Pendientes de producción

```
/icons/favicon.ico              # Generar desde el logo
/icons/favicon.svg
/icons/apple-touch-icon-180.png
/manifest.webmanifest           # Linkeado en el <head>, falta el archivo
/images/og-image.png            # Imagen 1200×630 para Open Graph
```

Actualizar en `index.html` la URL canónica real:
```html
<link rel="canonical" href="https://[dominio-real].com.ar/">
```

---

## Mejoras futuras

**Conversión a imágenes** — Reemplazar `hero.png` por `hero.webp` con fallback en `<picture>`. Reducción de peso estimada: 40–60%.

**PWA básica** — Agregar `manifest.webmanifest` + Service Worker mínimo para cache de assets estáticos. Permite instalación en home screen y carga offline.

**Animaciones de entrada** — `IntersectionObserver` para revelar secciones al hacer scroll. Sin dependencias, respetando `prefers-reduced-motion`.

**Formulario real** — Conectar el `<form>` a Formspree, Netlify Forms o un endpoint propio. El HTML ya tiene la estructura correcta con `name` attributes.

**Web Components** — Las stat cards, pilares y cards de diferenciales son candidatos naturales a `<custom-element>` según Cap. 7 de *Vanilla Web*. Encapsulación con Shadow DOM.

**Dark/Light mode explícito** — El `theme-color` ya tiene ambas variantes. Agregar toggle manual con `data-theme` en `<html>` y variantes de tokens en el CSS.

**Optimización de fuentes** — Auto-hospedar Outfit y Manrope para eliminar la dependencia de Google Fonts y garantizar disponibilidad offline.

---

*Flolustudio & Nous*
