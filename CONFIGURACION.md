# Guía de Configuración — Universidad Latino · Test Vocacional EVA

Este documento describe los puntos de configuración que pueden necesitar actualizarse sin conocimientos técnicos avanzados.

---

## 1. Número de WhatsApp y Teléfono

El número actual es **+52 999 152 5583**.
Aparece en **3 archivos**. Si el número cambia, actualiza los 3:

### Archivo 1 — Widget flotante de WhatsApp (ícono verde en toda la app)
**Ruta:** `src/components/WhatsAppWidget.tsx`

```ts
const phoneNumber = "529991525583";  // ← Cambia aquí
const message = "Hola! Me gustaría recibir más información sobre las carreras de la Universidad Latino.";
```

> El formato es: código de país (52) + número sin guiones ni espacios.
> Ejemplo para 999-123-4567 → `529991234567`

---

### Archivo 2 — Botones de CTA en la página de resultados (WhatsApp, Agendar Cita, Llamar Ahora)
**Ruta:** `src/app/resultados/[id]/page.tsx`

Busca las líneas que contienen `wa.me/529991525583` (aparece 2 veces) y `tel:+529991525583` (aparece 1 vez):

```ts
// Botón WhatsApp
window.open(`https://wa.me/529991525583?text=${msg}`, "_blank");

// Botón Agendar Cita
window.open(`https://wa.me/529991525583?text=${msg}`, "_blank");

// Botón Llamar Ahora
href="tel:+529991525583"
```

Reemplaza `529991525583` por el nuevo número (sin `+`, sin espacios).
Para el `tel:` mantén el `+52` al inicio.

---

### Archivo 3 — Botón "Hablar con un asesor AHORA" al finalizar el test
**Ruta:** `src/components/TypebotChat.tsx`

```ts
case "CALL":
  window.open("https://wa.me/529991525583", "_blank");
```

---

## 2. Mensaje de WhatsApp del widget flotante

Para cambiar el texto que aparece pre-escrito cuando el alumno abre WhatsApp desde el ícono flotante:

**Ruta:** `src/components/WhatsAppWidget.tsx`

```ts
const message = "Hola! Me gustaría recibir más información sobre las carreras de la Universidad Latino.";
```

---

## 3. Porcentaje de beca en la sección de beneficios (landing page)

El texto **"Beca de hasta 50%"** aparece en el panel izquierdo del formulario de registro, junto al ícono de birrete.

**Ruta:** `src/app/page.tsx`

Busca esta línea (aprox. línea 176):
```ts
{ icon: GraduationCap, title: "Beca de hasta 50%", desc: "Basado en tu desempeño" },
```

Cambia `"Beca de hasta 50%"` al nuevo porcentaje o texto. También puedes editar el subtítulo `"Basado en tu desempeño"` si cambia la condición.

---

## 4. Fecha límite del descuento de inscripción

La promoción "50% de descuento antes del 31 de agosto" aparece en dos lugares:

### En la página de resultados (web)
**Ruta:** `src/app/resultados/[id]/page.tsx`

Busca el texto:
```
"Inscríbete antes del 31 de agosto y obtén 50% de descuento en tu inscripción."
```
Aparece 2 veces (una en la tarjeta de carrera, otra en el PDF generado).

### En el PDF descargable
Está dentro de la misma función `handleDownloadPDF` en el mismo archivo. Busca:
```ts
"Inscríbete antes del 31 de agosto y obtén 50% de descuento en tu inscripción.",
```

---

## 5. Porcentaje del descuento de inscripción (página de resultados)

El descuento del **50%** se calcula automáticamente. Para cambiarlo:

**Ruta:** `src/app/resultados/[id]/page.tsx`

Busca `* 0.5` (hay 3 ocurrencias) y cámbialo por el nuevo porcentaje:
- 50% → `* 0.5`
- 40% → `* 0.4`
- 30% → `* 0.3`

---

## 6. Precios de colegiatura e inscripción por modalidad

**Ruta:** `src/app/resultados/[id]/page.tsx`

Los precios base están en el objeto `CAREER_DETAILS` (líneas ~62-113):

```ts
ingenieria_sistemas: { cost: 4650, inscription: 7000 },
derecho:             { cost: 4650, inscription: 7000 },
psicologia:          { cost: 4650, inscription: 7000 },
// ... etc
administracion:      { cost: 3960, inscription: 3600 },   // sabatina
administracion_desarrollo_empresarial: { cost: 1980, inscription: 3600 }, // online
```

- `cost` = colegiatura mensual en pesos
- `inscription` = costo de inscripción en pesos

---

## 7. Mensajes personalizados al enviar WhatsApp desde resultados

Los mensajes que se envían pre-escritos al asesor se pueden personalizar en:

**Ruta:** `src/app/resultados/[id]/page.tsx`

**Botón WhatsApp (consulta general):**
```ts
`Hola, acabo de completar el test vocacional. Soy ${lead.nombre} y me interesa conocer más sobre ${career}. ¿Pueden orientarme?`
```

**Botón Agendar Cita:**
```ts
`Hola, soy ${lead.nombre} y quiero agendar una visita al campus para conocer la carrera de ${career}. ¿Cuándo pueden atenderme?`
```

> `${lead.nombre}` y `${career}` se reemplazan automáticamente con el nombre del alumno y la carrera recomendada.

---

## 8. Resumen rápido — ¿Cambió el número de WhatsApp?

| Paso | Archivo | Qué cambiar |
|------|---------|-------------|
| 1 | `src/components/WhatsAppWidget.tsx` | `phoneNumber = "52XXXXXXXXXX"` |
| 2 | `src/app/resultados/[id]/page.tsx` | 2× `wa.me/52XXXXXXXXXX` y 1× `tel:+52XXXXXXXXXX` |
| 3 | `src/components/TypebotChat.tsx` | `wa.me/52XXXXXXXXXX` en `case "CALL"` |

**Formato del número:** código de país + número sin espacios ni guiones.
México: `52` + 10 dígitos = 12 dígitos totales. Ejemplo: `529991525583`

---

## 9. Variables de entorno (Supabase / Base de datos)

Estas variables están en el archivo `.env` en la raíz del proyecto. **No las compartas públicamente.**

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de acceso a Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada (solo servidor) |
| `DATABASE_URL` | Conexión directa a PostgreSQL |

Si cambia el proyecto de Supabase, actualiza las 4 variables en `.env` y reinicia el servidor de desarrollo.

---

---

## 10. Cómo aplicar los cambios (Deploy)

> **Importante:** Editar los archivos de código **no actualiza la página en línea automáticamente**. Para que los cambios sean visibles en producción hay que hacer un *deploy* (publicación).

---

### Flujo de trabajo

```
1. Editar el archivo de código
2. Guardar el archivo
3. Hacer deploy
4. Verificar en la URL de producción
```

---

### Opción A — Deploy automático con Vercel (recomendado)

Si el proyecto está conectado a Vercel y a un repositorio de GitHub:

1. Abre **GitHub Desktop** (o cualquier cliente Git) o usa la terminal.
2. Haz **commit** de los cambios:
   ```bash
   git add .
   git commit -m "descripción del cambio"
   ```
3. Haz **push** al repositorio:
   ```bash
   git push
   ```
4. Vercel detecta el push automáticamente y lanza el deploy.
5. En 1–2 minutos el cambio estará en vivo. Puedes ver el estado en [vercel.com/dashboard](https://vercel.com/dashboard).

> Si no está conectado a Vercel aún, ve a [vercel.com](https://vercel.com), crea una cuenta gratuita, importa el repositorio de GitHub y Vercel configura todo automáticamente.

---

### Opción B — Deploy manual con Vercel CLI

Si prefieres hacerlo desde la terminal sin Git:

```bash
# Instalar Vercel CLI (solo la primera vez)
npm install -g vercel

# Publicar
vercel --prod
```

---

### Opción C — Verificar cambios en local (antes de publicar)

Para probar los cambios en tu computadora antes de subirlos:

```bash
bun dev
```

Abre tu navegador en `http://localhost:3001`. Los cambios se reflejan en tiempo real al guardar el archivo (no requiere reiniciar).

---

### Variables de entorno en producción

Si modificas el archivo `.env`, **también debes actualizar las variables en el panel de Vercel**:

1. Entra a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto
3. Ve a **Settings → Environment Variables**
4. Agrega o edita las variables y guarda
5. Haz un nuevo deploy para que surtan efecto

---

*Última actualización: marzo 2026*
