# Mejores Prácticas: App de Bienes Raíces (Next.js)

Enfoque central: **Mobile-First y Responsividad** (Celular, Tablet, Escritorio/PC).

## 📱 Diseño Responsivo y UI/UX
*   **Mobile-First Obligatorio:** Diseña CSS primero para pantallas pequeñas (celulares) y escala hacia arriba usando utilidades o media queries (ej. `w-full md:w-1/2 lg:w-1/3`).
*   **Interacciones Táctiles:** Define áreas de "toque" grandes (min 44x44px) para botones y enlaces en la interfaz táctil.
*   **Manejo de Filtros Inteligente:** En móviles, usa un *Offcanvas* (Modal lateral o inferior) a pantalla completa para los filtros. En PC, despliégalos en una barra lateral fija.
*   **Navegación Adaptable:** Usa menús *Hamburguesa* o *Bottom Tabs* en celulares, y Barras de Navegación estándar en Escritorio.
*   **Galerías Deslizables (Swipe):** Integra carruseles de fotos que soporten el gesto natural de "arrastrar" (swipe) del dedo en móvil/tablet. 

## � Rendimiento y Arquitectura (Next.js)
*   **React Server Components (RSC):** Úsalos todo lo posible (`app/`) para no enviar JavaScript innecesario a redes móviles lentas. Ahorra batería y plan de datos.
*   **Imágenes Fluidas y Responsivas:** Usa el componente `<Image />` de Next.js acompañado del atributo `sizes`. Ej: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`. Solo se descargará la imagen necesaria para el tamaño de pantalla del usuario.
*   **Carga de Esqueletos (Skeleton Screens):** Usa `Suspense` para mostrar contenedores grises cargando de inmediato en pantallas móviles mientras viaja la información desde tu base de datos (Supabase).
*   **ISR (Incremental Static Regeneration):** Guarda una copia caché de los detalles de las propiedades y actualízalas asíncronamente para que el tiempo de espera del usuario sea de milisegundos en cualquier dispositivo.

## 🧭 Búsqueda y Manejo de Datos
*   **Estado de Filtros vía URL de Navegador:** Maneja la búsqueda, paginaciones y orden preestablecidos en los *Search Params* de la URL (`?precioMax=200000&tipo=casa`). Permite compartir el link tal cual en WhatsApp desde el celular.
*   **Botón "Cargar Más":** Es mucho más orgánico y fácil de usar en móviles ("Cargar Más" o "Scroll Infinito") frente a los botones diminutos de una grilla de Paginación clásica.
*   **Consultas Limitadas a la BD:** Exige de tu backend (Supabase) lotes pequeños (ej. 10 propiedades con `.range(0, 9)`). Las vistas responsivas no deben sobrecargar la memoria de un teléfono viejo renderizando 500 nudos a la vez.

## 🗺️ Mapas y Ubicaciones
*   **Toggle Mapa vs Lista:** En celulares, los mapas interactivos estorban el gesto de deslisar la página hacia abajo (scroll). Ofrece un botón obvio ("Ver Mapa" / "Ver Lista") para alternar la vista en móviles, en vez de ponerlos amontonados. En monitores de PC sí puedes usar disposición de dos columnas (Mapa y Lista lado a lado).

## 📈 SEO Especializado Inmobiliario
*   **Slugs Amigables y Descriptivos:** Crea URLs limpias para cada propiedad usando un *slug* que contenga ubicación y tipo de inmueble (ej. `midominio.com/propiedades/casa-venta-3-recamaras-zapopan-centro`). Esto ayuda enormemente al posicionamiento local en Google y da confianza al usuario al leer el link.
*   **Metadatos y Open Graph (Redes Sociales):** 
    *   Usa la API `generateMetadata` de Next.js en la página dinámica de la propiedad (`[slug]/page.tsx`).
    *   Configura las etiquetas `og:title`, `og:description` y `og:image`.
    *   Cuando un asesor o cliente comparta el link por WhatsApp, Facebook o Correo, debe aparecer una tarjeta prémium mostrando: La mejor foto de la casa, el precio exacto destacado y un título atrayente (ej: *Casa en Venta - $3M - Zapopan*).
*   **Sitemaps Automáticos:** Genera dinámicamente el archivo `sitemap.xml` integrándolo a tu base de datos (Supabase). Cada vez que publiques una nueva propiedad, el sitemap se actualiza y Google la indexa más rápido, sin intervención manual.
*   **Rich Snippets (Schema.org / JSON-LD):** 
    *   Inyecta código JSON-LD oculto en el HTML con el esquema tipo `RealEstateListing` o `SingleFamilyResidence`.
    *   Esto permite que en los resultados de Google (SERP) tu link destaque visualmente mostrando el precio, número de habitaciones y estatus de la propiedad directamente en el buscador, aumentando drásticamente el CTR (Click-Through Rate).
*   **SEO de Rendimiento (Móvil):** Google recompensa sitios por ser inmensamente rápidos en móviles. El LCP (Largest Contentful Paint) debe brillar. Jamás hagas *Lazy Load* de la foto principal destacada en el celular, cárgala con prioridad (`priority={true}` en Next/Image).
