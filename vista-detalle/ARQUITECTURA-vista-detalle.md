# Arquitectura: Vista Detalle de Propiedad

Guía para crear o modificar páginas de detalle (`idN.html`) en esta carpeta.

---

## Estructura de archivos

```
vista-detalle/
  id1.html                      ← propiedad id=1 (referencia)
  id2.html                      ← propiedad id=2
  id3.html                      ← propiedad id=3
  id4.html                      ← propiedad id=4
  ARQUITECTURA-vista-detalle.md ← este archivo
```

---

## Cómo crear un nuevo idN.html

1. **Copiar** `id1.html` y renombrar a `idN.html`
2. **Actualizar los datos** de la propiedad (ver secciones abajo)
3. **Registrar en `propiedades.html`** (ver paso 4)
4. **Agregar cursor pointer en `styles.css`** ya está resuelto globalmente (ver paso 5)

---

## Datos a actualizar en el HTML

### Metadatos `<head>`
```html
<title>Departamento X ambientes · Dirección · Consorcio Activo</title>
<meta name="description" content="...descripción SEO...">
<link rel="preload" href="../public/properties/idN/portada.png" as="image">
```

### Título galería
```html
<h1 class="detalle-galeria-titulo">Departamento X ambientes · Dirección</h1>
```

### Imágenes (galería + lightbox)
```html
<!-- Foto principal -->
<img class="detalle-galeria-main" src="../public/properties/idN/portada.png" data-index="0">

<!-- 4 thumbs — elegir las más representativas -->
<img src="../public/properties/idN/foto2.jpg" data-index="1">
<img src="../public/properties/idN/foto3.jpg" data-index="2">
<img src="../public/properties/idN/foto4.jpg" data-index="3">
<img src="../public/properties/idN/foto5.jpg" data-index="4">
```

```js
// Array IMAGES en el <script> al final — todas las fotos en orden
const IMAGES = [
  '../public/properties/idN/portada.png',
  '../public/properties/idN/foto2.jpg',
  // ...
];
```

### Contenido principal
```html
<h2 class="detalle-h1">Descripción libre de la propiedad.</h2>
<p class="detalle-ubicacion">📍 Dirección, Neuquén capital</p>
```

> **Nota:** `<p class="detalle-descripcion">` fue eliminado de id1.html — no incluir en nuevas vistas.

### Stats (una por feature)
```html
<div class="detalle-stats">
  <div class="detalle-stat"><!-- SVG --> X Habitaciones con placard</div>
  <div class="detalle-stat"><!-- SVG --> X Baño/s</div>
  <div class="detalle-stat"><!-- SVG --> Balcón / Terraza</div>
  <div class="detalle-stat"><!-- SVG --> Piso X</div>
  <div class="detalle-stat"><!-- SVG --> Sin/Con mascotas</div>
  <div class="detalle-stat"><!-- SVG --> Sin/Con cochera</div>
</div>
```

### Requisitos (fijo, sin toggle)
```html
<!-- Requisitos -->
<div class="req-card">
  <div class="req-header">
    <span class="req-title" id="req-title">Requisitos para alquilar</span>
  </div>
  <div class="req-body" id="req-body" role="region" aria-labelledby="req-title">
    <p>Recibo de sueldo o constancia de ingresos, según corresponda.</p>
    <p><strong>Garantes</strong></p>
    <p>2 Garantes recibo de sueldo, constancia de ingresos según corresponda.<br>
       También es posible presentar un seguro de caución.</p>
    <p><strong>Importes habituales al ingresar:</strong></p>
    <p>
      Mes de alquiler inicial.<br>
      Mes de depósito en garantía. (se puede abonar en 2 cuotas)<br>
      Honorarios inmobiliarios (se puede abonar en 2 cuotas)
    </p>
  </div>
</div>
```

### Sidebar — precio
```html
<!-- Convención actual (id1–id4): ningún detalle muestra monto. -->
<p class="detalle-precio-valor">Consultar<span> precio</span></p>

<!-- Si en el futuro se define un precio real, usar: -->
<p class="detalle-precio-label">Desde</p>
<p class="detalle-precio-valor">$X.XXX.XXX<span>/mes</span></p>
```

---

## Paso 4 — Registrar en propiedades.html

En el bloque JS donde se crean las cards (buscar `card.dataset.id = p.id`):

```js
if (p.id === N) card.dataset.detalle = 'vista-detalle/idN.html';
```

Esto hace que:
- La card del id=N muestre solo la portada (sin carrusel)
- El click en **cualquier parte** de la card navegue a `vista-detalle/idN.html`

---

## Paso 5 — Cursor pointer (ya resuelto globalmente en styles.css)

El cursor pointer en toda la card está resuelto **una vez para siempre** en `styles.css`:

```css
property-card[data-detalle],
property-card[data-detalle] * { cursor: pointer !important; }
```

**Por qué existe:** `property-card` es `display: inline` por defecto, y `.property-card-img` tiene `cursor: zoom-in` que pisaba el pointer. Con este selector de atributo, cualquier card que tenga `data-detalle` (id1, id2, idN…) muestra cursor pointer en imagen, título, precio y body sin necesidad de tocar nada más.

**No hay que hacer nada** para los futuros ids — al agregar `card.dataset.detalle = 'vista-detalle/idN.html'` en propiedades.html, el CSS se aplica automáticamente.

---

## Notas críticas

| Tema | Regla |
|------|-------|
| Rutas | Siempre `../` para CSS, JS, imágenes y nav links |
| Nav | `<app-nav current="propiedades">` en todas las vistas detalle |
| Lightbox | `.detalle-lightbox:not([open]) { display: none }` — no borrar, evita que el dialog se solape al cargar la página |
| Imágenes | Las rutas con espacios funcionan en HTML/JS sin encode |
| CSS | Está inline en `<style>` dentro del HTML, no en styles.css |
| Requisitos | El bloque `.req-card` es fijo (no acordeón), copiar tal cual |
| Requisitos JS | **No** agregar listeners de acordeón: el bloque es fijo, sin toggle. Un listener sobre un id inexistente corta el resto del `<script>` y rompe el lightbox. |
| Descripción | `<p class="detalle-descripcion">` eliminado — no incluir |
| Precio | Ninguna vista muestra monto — usar siempre `Consultar precio` (ver sección Sidebar) |
| Cursor | Ya resuelto globalmente en styles.css — no requiere acción por id |
