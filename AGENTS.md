## Project Summary
Este proyecto es una landing page interactiva para la **Universidad Latino**, diseñada para captar prospectos a través de un test vocacional potenciado por Inteligencia Artificial. El flujo guía a los estudiantes desde el descubrimiento de su carrera ideal hasta la obtención de un dictamen personalizado y beneficios económicos (becas y descuentos).

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes:** Lucide React, Framer Motion
- **Base de Datos/Auth:** Supabase
- **Chatbot:** Typebot (Integración vía script)

## Architecture
- `src/app/page.tsx`: Landing page principal con Hero, Oferta Educativa y Formulario (Typebot).
- `src/app/resultados/[id]/page.tsx`: Página dinámica que muestra el dictamen de IA y beneficios personalizados basados en el Lead ID.
- `src/components/Header.tsx`: Encabezado institucional compartido.
- `src/components/TypebotChat.tsx`: Wrapper para el chatbot de registro.
- `src/lib/supabase.ts`: Configuración del cliente de base de datos.

## User Preferences
- **Estilo:** Institucional, profesional y dinámico.
- **Tipografía:** Sans-serif moderna (Inter/System).
- **Interacciones:** Uso moderado de Framer Motion para entradas suaves y micro-interacciones.

## Project Guidelines
- **Branding:**
  - Azul Marino: `#002D62` (Fondos principales, iconos, acentos).
  - Dorado/Amarillo: `#E6B400` (CTAs, resaltados, beneficios).
  - Gris Claro/Fondo: `#F4F4F4` (Secciones de contenido, formularios).
- **Componentes:** Mantener un diseño de "tarjetas" con bordes redondeados amplios (`rounded-[2rem]` o `rounded-3xl`) y sombras suaves.
- **Logos:** En fondos oscuros (`#002D62`), usar el logo con filtro `brightness-0 invert` para apariencia blanca limpia.
- **CTAs:** Los botones principales deben usar el color Dorado con texto Azul Marino para máximo contraste y legibilidad.

## Common Patterns
- **Secciones:** Alternar entre fondos blancos y `#F4F4F4` para separar contenido.
- **Iconografía:** Usar iconos de `lucide-react` en color Azul Marino dentro de contenedores con fondo suave o circular.
- **Becas:** La lógica de becas se basa en el promedio reportado por el alumno, dividiéndose en Academic Benefits (becas de colegiatura) y Enrollment Support (descuentos en inscripción).
