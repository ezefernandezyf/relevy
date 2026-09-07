# Relevy — Brand Mark Design Brief

> Para generar el ícono/mark de **Relevy** con Gemini o cualquier generador de imágenes.
> Traé el resultado como SVG/código y lo integramos a `logo.tsx` + `icon.svg` + `og.png`.

---

## 1. Marca y concepto

**Nombre**: Relevy (de "relevancia" — el concepto central del producto)

**Qué hace**: plataforma que audita y mejora la **visibilidad de un sitio en motores de búsqueda con IA** (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews, Bing Copilot). Mide qué tan probable es que una IA **cite tu contenido** como fuente.

**Concepto emocional**: "Que te vean, que te citen, que emerjas en las respuestas de IA." La marca trata de **relevancia y presencia** — no de estar en Google, sino de **ser la fuente que la IA elige**.

**Palabras clave**: visibilidad · relevancia · cita · emerger · destacar · fuente confiable · presencia en IA

**Tono**: moderno, confiable, tecnológico pero cálido. No genérico, no "startup cliché", no corporativo frío.

---

## 2. Identidad visual existente (para consistencia)

| Token | Valor |
|---|---|
| Navy (fondo/primario) | `#0f172a` |
| Emerald (acento/positivo) | `#10b981` |
| Amber (acento/atención) | `#f59e0b` |
| Red (negativo/error) | `#ef4444` |
| Tipografía headings | **Instrument Serif** (serif con personalidad) |
| Tipografía body | **Work Sans** |
| Tipografía código | **JetBrains Mono** |
| Estilo general | Serio, data-driven, sin ruido decorativo, micro-interacciones mínimas |

---

## 3. El mark — especificación

### Formato
- **Ícono + wordmark** (el usuario eligió esta dirección: un símbolo + la palabra "Relevy")
- El ícono debe funcionar SOLO (favicon, 32×32) y CON wordmark (logo completo)

### Concepto del símbolo (direcciones a explorar)

El símbolo debe comunicar **visibilidad / citación / emerger** sin ser literal. Ideas de dirección:

1. **"Cita" o comillas**: unas comillas estilizadas que sugieren "que te citen" — el verbo central del producto. Podría ser un par de comillas tipográficas (") dentro de un contenedor geométrico, o dos formas que evocan comillas.
2. **"Emerger"**: una forma ascendente — un punto que sube/emerge de una línea, o una flecha diagonal que atraviesa un círculo (sugiere "aparecer en el radar").
3. **"Radiar/destacar"**: un nodo central con ondas/rayos sutiles (como un pulso de señales) — la marca emite señales que las IA captan.
4. **"Check de relevancia"**: una marca de check estilizada (aprobación/confianza — la IA te aprueba como fuente).

### Restricciones del símbolo
- **Geométrico y limpio**: funciona a 16×16 píxeles (favicon) sin perder forma
- **Sin gradientes ni sombras**: flat, vectorial, reproducible en SVG
- **Máximo 2 colores** (idealmente 1 sólido + 1 acento): navy `#0f172a` como base + emerald `#10b981` como acento (o inversa: emerald mark sobre navy)
- **Sin texto dentro del símbolo** (el wordmark aparte)
- **Sin iconos genéricos** (nada de lupa, globo, rayo, engranaje, gráfico de barras genérico)

### Wordmark
- "Relevy" en **Instrument Serif** (la tipografía de headings del producto)
- Case: **Relevy** (primera mayúscula, resto minúscula)
- Color: navy `#0f172a` sobre fondo claro; blanco sobre fondo navy
- Sin tagline, sin subtítulo

### Variantes necesarias
1. **Ícono solo** (para favicon, avatar, app) — 32×32 y 64×64
2. **Ícono + wordmark horizontal** (para navbar, footer, PDF) — proporción ~4:1
3. **Wordmark solo** (para contextos donde el ícono sobra)
4. **OG image** (1200×630, opcional): mark + nombre sobre fondo navy, opcional tagline

---

## 4. Anti-patrones (NO)

- ❌ Nada de "IA genérica": ni cerebro, ni chip, ni robot, ni red neuronal
- ❌ Nada de "SEO cliché": ni lupa, ni globo terráqueo, ni gráfico de ranking
- ❌ Nada de gradientes psicodélicos ni neón
- ❌ Nada de iconos de stock
- ❌ Nada de texto pequeño dentro del símbolo
- ❌ Nada de 3D ni sombras exageradas

---

## 5. Prompt sugerido para Gemini (copiar y pegar)

```
Diseñá un ícono de marca (logo mark) para "Relevy", una plataforma de
visibilidad en motores de búsqueda con IA. El concepto central: "que las IA
te citen como fuente", "emerger en las respuestas de IA". 

El ícono debe ser: geométrico, flat (sin gradientes ni sombras), vectorial,
mínimo 2 colores (navy #0f172a como base + emerald #10b981 como acento),
funcional a 16×16 píxeles, sin texto dentro del símbolo.

Direcciones a explorar (elegí una o combiná): 
(a) par de comillas estilizadas que evocan "ser citado", 
(b) una forma ascendente/emergente (punto que sube de una línea), 
(c) un nodo central con ondas de señal (como radar/pulso), 
(d) una check estilizada (aprobación/confianza).

NO usar: cerebro, chip, robot, red neuronal, lupa, globo, engranaje,
gráfico de barras, iconos de stock, gradientes, 3D.

Generá el ícono en SVG limpio (paths simples), y también una variante
del wordmark "Relevy" en Instrument Serif junto al ícono.
```

---

## 6. Cómo lo integramos (una vez que tengas el SVG)

1. **`src/app/icon.svg`** — el ícono solo (favicon, App Router lo sirve automático)
2. **`src/ui/logo.tsx`** — componente React: ícono + wordmark, con variante `markOnly`
3. **`public/og.png`** — OG image (1200×630, opcional si querés regenerarla)
4. **Tests** — `logo.test.tsx`, `navbar.test.tsx`, `footer.test.tsx` (textos de aria-label)

---

## 7. Nota

El diseño lo definís VOS — esto es el brief para que Gemini te genere candidatos. Cuando tengas el que te gusta, traé el SVG y lo integramos como parte del Sprint 11 (WU de rebrand). Si querés, generamos 2-3 variantes y elegís.