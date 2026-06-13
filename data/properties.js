/**
 * data/properties.js — Consorcio Activo
 * Única fuente de datos de propiedades (ES module).
 *
 * Convención de imágenes:
 *   - Carpeta: public/properties/id{n}/
 *   - Primera imagen del array = portada de la card
 *   - El resto aparece en el carrusel
 *
 * Para agregar/editar/quitar propiedades ver GUIA-PROPIEDADES.md
 */

const properties = [
  {
    "id": 1,
    "titulo": "Departamento 2 ambientes",
    "tipo": "residencial",
    "ubicacion": "Leloir 542, Neuquén",
    "precio": 0,
    "superficie": 42,
    "ambientes": 2,
    "dormitorios": 1,
    "banos": 1,
    "features": ["Terraza", "Balcón", "Sin mascotas", "Piso 6"],
    "estado": "disponible",
    "activa": true,
    "imagenes": [
      "public/properties/id1/portada propiedad 2.png",
      "public/properties/id1/balcon propiedad 2.jpg",
      "public/properties/id1/baño propiedad 2 (1).jpg",
      "public/properties/id1/baño propiedad 2.jpg",
      "public/properties/id1/cocina propiedad 2.jpg",
      "public/properties/id1/habitacion principal propiedad 2 (1).jpg",
      "public/properties/id1/habitacion principal propiedad 2.jpg",
      "public/properties/id1/ingreso propiedad 2.jpg"
    ],
    "descripcion": "Departamento de 2 ambientes con 1 dormitorio, terraza y balcón en living y habitación. Piso 6. Sin mascotas."
  },
  {
    "id": 2,
    "titulo": "Departamento 3 ambientes",
    "tipo": "residencial",
    "ubicacion": "Leloir 430, Neuquén",
    "precio": 0,
    "superficie": 68,
    "ambientes": 3,
    "dormitorios": 2,
    "banos": 1,
    "features": ["Terraza", "Balcón", "Baño con bañera", "Sin mascotas", "Piso 2"],
    "estado": "disponible",
    "activa": true,
    "imagenes": [
      "public/properties/id2/Portada - propiedad 1.png",
      "public/properties/id2/baño propiedad 1 (1).jpg",
      "public/properties/id2/baño propiedad 1.jpg",
      "public/properties/id2/cocina propiedad 1.jpg",
      "public/properties/id2/habitacion dos propiedad 1 (1).jpg",
      "public/properties/id2/habitacion dos propiedad 1.jpg",
      "public/properties/id2/habitacion principal propiedad 1 (1).jpg",
      "public/properties/id2/habitacion principal propiedad 1.jpg",
      "public/properties/id2/ingreso propiedad 1.jpg",
      "public/properties/id2/living comedor propiedad 1.jpg"
    ],
    "descripcion": "Departamento de 3 ambientes con 2 dormitorios, baño con bañera, terraza y balcón. Piso 2. Sin mascotas."
  },
  {
    "id": 3,
    "titulo": "Departamento 3 ambientes",
    "tipo": "residencial",
    "ubicacion": "Av. Argentina 840, Neuquén",
    "precio": 0,
    "superficie": 72,
    "ambientes": 3,
    "dormitorios": 2,
    "banos": 1,
    "features": ["Terraza", "Balcón", "Baño con bañera", "Sin mascotas", "Piso 8"],
    "estado": "disponible",
    "activa": true,
    "imagenes": [
      "public/properties/id3/portada propiedad 3.png",
      "public/properties/id3/balcon propiedad 3.jpg",
      "public/properties/id3/baño propiedad 3.jpg",
      "public/properties/id3/cocina propiedad 3.jpg",
      "public/properties/id3/detalle comedor propiedad 3.jpg",
      "public/properties/id3/habitacion 2 propiedad 3.jpg",
      "public/properties/id3/habitacion principal propiedad 3 (1).jpg",
      "public/properties/id3/habitacion principal propiedad 3 (2).jpg",
      "public/properties/id3/habitacion principal propiedad 3.jpg",
      "public/properties/id3/living comedor propiedad 3.jpg"
    ],
    "descripcion": "Departamento de 3 ambientes con 2 dormitorios, baño con bañera, terraza y balcón. Piso 8 con excelente vista. Sin mascotas."
  },
  {
    "id": 4,
    "titulo": "Departamento 1 ambiente",
    "tipo": "residencial",
    "ubicacion": "Leloir 541, Neuquén",
    "precio": 720000,
    "superficie": 35,
    "ambientes": 1,
    "banos": 1,
    "features": ["Terraza", "Pet Friendly"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-4.png"],
    "descripcion": "Departamento de 1 ambiente con balcón. Ideal para profesionales o estudiantes. Excelente ubicación en el centro."
  },
  {
    "id": 5,
    "titulo": "Departamento 3 ambientes",
    "tipo": "residencial",
    "ubicacion": "Leloir 541, Neuquén",
    "precio": 1260000,
    "superficie": 110,
    "ambientes": 3,
    "banos": 2,
    "features": ["Terraza", "Pet Friendly"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-5.png"],
    "descripcion": "Gran departamento de 3 ambientes con 2 baños y terraza propia. Ideal para familias. Edificio con seguridad 24hs."
  },
  {
    "id": 6,
    "titulo": "Departamento 2 ambientes",
    "tipo": "residencial",
    "ubicacion": "42HG, Neuquén",
    "precio": 910000,
    "superficie": 40,
    "ambientes": 2,
    "banos": 1,
    "features": ["Terraza", "Pet Friendly"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-6.png"],
    "descripcion": "Departamento de 2 ambientes en barrio tranquilo. Diseño moderno, excelente terminación. Terraza con parrilla."
  },
  {
    "id": 7,
    "titulo": "Oficina Estándar",
    "tipo": "oficina",
    "ubicacion": "Centro, Neuquén",
    "precio": 680000,
    "superficie": 40,
    "ambientes": 1,
    "banos": 1,
    "features": ["Internet", "Sala reuniones"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-7.jpg"],
    "descripcion": "Oficina equipada en el centro de Neuquén. Incluye internet de alta velocidad y acceso a sala de reuniones."
  },
  {
    "id": 8,
    "titulo": "Suite Ejecutiva",
    "tipo": "oficina",
    "ubicacion": "Centro, Neuquén",
    "precio": 1100000,
    "superficie": 80,
    "ambientes": 2,
    "banos": 1,
    "features": ["Internet", "Sala privada", "Recepción"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-8.jpg"],
    "descripcion": "Suite ejecutiva con sala privada de reuniones, recepción y vista panorámica al centro."
  },
  {
    "id": 9,
    "titulo": "Coworking",
    "tipo": "oficina",
    "ubicacion": "Centro, Neuquén",
    "precio": 180000,
    "superficie": 0,
    "ambientes": 1,
    "banos": 1,
    "features": ["Internet", "Networking"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-9.jpg"],
    "descripcion": "Espacio de coworking con puesto fijo, internet, sala de reuniones y comunidad de profesionales."
  },
  {
    "id": 10,
    "titulo": "Local Pequeño",
    "tipo": "comercial",
    "ubicacion": "Av. Argentina, Neuquén",
    "precio": 750000,
    "superficie": 35,
    "ambientes": 1,
    "banos": 1,
    "features": ["Vidriera", "Contrafrente"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-10.jpg"],
    "descripcion": "Local comercial con vidriera sobre calle de alto tránsito. Contrafrente para depósito. Ideal para retail o servicios."
  },
  {
    "id": 11,
    "titulo": "Local Amplio",
    "tipo": "comercial",
    "ubicacion": "Av. Principal, Neuquén",
    "precio": 1800000,
    "superficie": 120,
    "ambientes": 1,
    "banos": 2,
    "features": ["Depósito", "Alta circulación"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-11.jpg"],
    "descripcion": "Local amplio sobre avenida principal con depósito incluido. Alta circulación de público. 2 baños."
  },
  {
    "id": 12,
    "titulo": "Galería Comercial",
    "tipo": "comercial",
    "ubicacion": "Centro, Neuquén",
    "precio": 420000,
    "superficie": 20,
    "ambientes": 1,
    "banos": 1,
    "features": ["Seguridad", "Estacionamiento"],
    "estado": "alquilada",
    "activa": true,
    "imagenes": ["public/images/prop-12.jpg"],
    "descripcion": "Local en galería comercial del centro. Seguridad 24hs y estacionamiento disponible para clientes."
  }
];

export default properties;
