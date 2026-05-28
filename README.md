# Consorcio Activo — Landing Page

**Arquitectura técnica · v1.0**

| Campo | Valor |
|---|---|
| Producto | Landing page institucional para administración de consorcios |
| Enfoque | Vanilla Web · HTML5 semántico · CSS3 sin frameworks |
| Referencia técnica | *Vanilla Web* |
| Tipografía | Manrope 400/500/600/700/800 |
| Versión | 1.0 — Mayo 2026 |

---

## Estructura del proyecto

```
consorcioactivo/
├── index.html
├── nosotros.html
├── propiedades.html
├── soporte.html
├── contacto.html
├── terminos.html
├── privacidad.html
├── styles.css
├── app.js
├── components/
│   ├── AppNav.js
│   ├── ContactForm.js
│   └── PropertyCard.js
├── icons/
│   ├── commitment-icons/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable.png
│   └── logoBLACK.png
├── public/
│   └── images/
│       ├── og-image.png
│       ├── screenshot-desktop.png
│       └── screenshot-mobile.png
├── manifest.webmanifest
└── sw.js
```

---

## Stack técnico

| Capa | Tecnología | Justificación |
|---|---|---|
| Markup | HTML5 semántico puro | `<header>` `<main>` `<nav>` `<section>` `<aside>` `<article>` `<blockquote>` · Sin div soup |
| Estilos | CSS3 · `@layer` cascade | 5 layers explícitos · Custom properties como design tokens · Sin preprocesadores |
| Layout | CSS Grid + Flexbox | Grid para secciones de dos columnas · Flex para nav, actions y listas |
| Tipografía | `clamp()` fluido | Escala tipográfica sin breakpoints arbitrarios |
| Scripts | Vanilla JS · Web Components · DOM API | Nav, cards, formulario y comportamiento progresivo |
| Fuentes | Google Fonts con `display=swap` | Sin bloqueo de render · Fallback a `system-ui` |
| Imágenes | `public/images` + CSS backgrounds | Assets reales por sección, OG y screenshots de PWA |
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

## Assets de producción

- Favicons e íconos PWA en `icons/`.
- Imágenes de secciones en `public/images/`.
- Open Graph: `public/images/og-image.png`.
- Manifest screenshots: `public/images/screenshot-desktop.png` y `public/images/screenshot-mobile.png`.

---

## Mejoras futuras

**Conversión a imágenes** — Reemplazar `hero.png` por `hero.webp` con fallback en `<picture>`. Reducción de peso estimada: 40–60%.

**PWA básica** — Agregar `manifest.webmanifest` + Service Worker mínimo para cache de assets estáticos. Permite instalación en home screen y carga offline.

**Animaciones de entrada** — `IntersectionObserver` para revelar secciones al hacer scroll. Sin dependencias, respetando `prefers-reduced-motion`.

---

## Notas de cambios

`Mon 6 April` — Aquí se cambió la sección `#nosotros` a una variante con colores invertidos: fondo blanco y letras negras, manteniendo el estilo general del sitio.

**Formulario real** — Conectar el `<form>` a Formspree, Netlify Forms o un endpoint propio. El HTML ya tiene la estructura correcta con `name` attributes.

**Web Components** — Las stat cards, pilares y cards de diferenciales son candidatos naturales a `<custom-element>` según Cap. 7 de *Vanilla Web*. Encapsulación con Shadow DOM.

**Dark/Light mode explícito** — El `theme-color` ya tiene ambas variantes. Agregar toggle manual con `data-theme` en `<html>` y variantes de tokens en el CSS.

**Optimización de fuentes** — Auto-hospedar Manrope para eliminar la dependencia de Google Fonts y garantizar disponibilidad offline.

---

*Flolustudio & Nous*
