# Guía de Configuración — Universidad Latino · Test Vocacional EVA

Este documento describe los puntos de configuración que pueden necesitar actualizarse sin conocimientos técnicos avanzados.

### URL de producción (referencia)

Sitio publicado en VPS con **Easypanel** (build desde **GitHub**):

**https://testunilatino.algorithmus.io/**

Úsala para comprobar cambios después de cada deploy. Si el dominio o el subdominio cambian en el panel, actualiza esta línea para que el equipo tenga la referencia correcta.

---

## 1. Número de WhatsApp y Teléfono

El número actual es **+52 999 152 5583**.
Aparece en **3 archivos**. Si el número cambia, actualiza los 3:

### Archivo 1 — Widget flotante de WhatsApp (ícono verde en toda la app)
**Ruta:** `src/components/WhatsAppWidget.tsx`

```ts
const phoneNumber = "529996442662";  // ← Cambia aquí
const message = "Hola! Me gustaría recibir más información sobre las carreras de la Universidad Latino.";
```

> El formato es: código de país (52) + número sin guiones ni espacios.
> Ejemplo para 999-123-4567 → `529991234567`

---

### Archivo 2 — Botones de CTA en la página de resultados (WhatsApp, Agendar Cita, Llamar Ahora)
**Ruta:** `src/app/resultados/[id]/page.tsx`

Busca las líneas que contienen `wa.me/529996442662` (aparece 2 veces) y `tel:+529996442662` (aparece 1 vez):

```ts
// Botón WhatsApp
window.open(`https://wa.me/529996442662?text=${msg}`, "_blank");

// Botón Agendar Cita
window.open(`https://wa.me/529996442662?text=${msg}`, "_blank");

// Botón Llamar Ahora
href="tel:+529996442662"
```

Reemplaza `529996442662` por el nuevo número (sin `+`, sin espacios).
Para el `tel:` mantén el `+52` al inicio.

---

### Archivo 3 — Botón "Hablar con un asesor AHORA" al finalizar el test
**Ruta:** `src/components/TypebotChat.tsx`

```ts
case "CALL":
  window.open("https://wa.me/529996442662", "_blank");
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
México: `52` + 10 dígitos = 12 dígitos totales. Ejemplo: `529996442662`

---

## 9. Variables de entorno (Supabase / Base de datos / integraciones)

En **desarrollo local**, estas variables van en el archivo `.env` en la raíz del proyecto. **No subas `.env` a GitHub** ni lo compartas.

En **producción (Easypanel / Docker)**, configura las mismas claves en **Variables de entorno** del servicio. Nixpacks construye la imagen con `npm run build` y arranca con `next start`.

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (visible en el navegador) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública); usada en el cliente para `/resultados`, etc. |
| `SUPABASE_URL` | *(Recomendado en servidor)* Misma URL que `NEXT_PUBLIC_SUPABASE_URL`. En Docker, ayuda a que la API lea la URL en **runtime** aunque el build no haya incrustado bien las `NEXT_PUBLIC_*`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave **service_role** (solo servidor). La ruta `/api/test/submit` la usa para guardar leads; **nunca** debe ser `NEXT_PUBLIC_`. |
| `SUPABASE_ANON_KEY` | *(Opcional en servidor)* Misma clave que `NEXT_PUBLIC_SUPABASE_ANON_KEY` si quieres definirla solo en runtime sin prefijo público. |
| `DATABASE_URL` | Conexión PostgreSQL (p. ej. herramientas externas o migraciones) |
| `NEXT_PUBLIC_BASE_URL` | *(Opcional)* URL pública del sitio, p. ej. `https://testunilatino.algorithmus.io` — se usa en payloads del webhook (enlace al dictamen). |
| `GHL_WEBHOOK_URL` | *(Opcional)* URL del webhook de GoHighLevel / CRM si está activo |

**Nota técnica (Next.js + Docker):** las variables `NEXT_PUBLIC_*` se **incrustan en el build**. Si en el momento de `npm run build` faltan, el cliente puede quedar sin URL/clave correctas. Por eso en Easypanel conviene: (1) pasar `NEXT_PUBLIC_*` también como **build args** si el panel lo permite, o (2) usar `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` en runtime para la API, y mantener las `NEXT_PUBLIC_*` correctas en el build para el resto de la app.

Si cambia el proyecto de Supabase, actualiza **URL y las tres claves** (anon, service role, y `DATABASE_URL` si aplica) en `.env` local y en Easypanel, luego redeploy.

---

## 10. Cómo aplicar los cambios (Deploy)

> **Importante:** Editar el código **no actualiza la web en producción** hasta que el código esté en **GitHub** y **Easypanel** haya construido y desplegado de nuevo la imagen.

### Flujo de trabajo (GitHub → Easypanel en VPS)

```
1. Editar y guardar archivos en el proyecto
2. Commit + push a la rama conectada (p. ej. main)
3. En Easypanel: redeploy del servicio (o deploy automático si está enlazado al repo)
4. Verificar en https://testunilatino.algorithmus.io/
```

### Opción A — Deploy con Git + Easypanel (flujo actual)

1. Repositorio en GitHub (origen del código).
2. En **Easypanel**, el servicio de la landing apunta a ese repo y rama; Nixpacks ejecuta `npm install` y `npm run build` dentro del contenedor.
3. Tras cada cambio relevante:
   ```bash
   git add .
   git commit -m "descripción del cambio"
   git push origin main
   ```
4. Dispara un **nuevo deploy** en Easypanel si no está el autodeploy al push.
5. Revisa logs de build y del contenedor si algo falla (puerto **3000**, health check, variables de entorno).

### Opción B — Probar en local antes de publicar

```bash
npm run dev
```

Abre **http://localhost:3000**. Con Turbopack, los cambios suelen verse al guardar.

### Opción C — Vercel (alternativa)

Si en el futuro conectas el mismo repo a [Vercel](https://vercel.com): haz push a GitHub y configura **Settings → Environment Variables** allí. El flujo principal documentado aquí sigue siendo **Easypanel en VPS**.

### Variables de entorno en producción (Easypanel)

1. Entra al proyecto y al **servicio** de la landing.
2. Abre **Environment** / **Variables de entorno**.
3. Añade o edita las variables de la tabla de la **sección 9** (incl. `HOST=0.0.0.0`, `PORT=3000`, `NODE_ENV=production` si el panel no las define solo).
4. Guarda y **vuelve a desplegar** para que el nuevo build o el contenedor en marcha usen los valores correctos.

> **Seguridad:** Evita exponer `SUPABASE_SERVICE_ROLE_KEY` en build args públicos si el panel lo permite; preferible como variable solo en **runtime** del contenedor.

---

*Última actualización: marzo 2026*
