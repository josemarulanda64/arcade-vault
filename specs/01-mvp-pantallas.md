---
spec: 01-mvp-pantallas
state: Implemented
dependencies: none
date: 2026-06-29
---

**Objetivo:** Portar las 5 pantallas del template vanilla React a Next.js App Router con sistema de diseño neon fiel al original y auth funcional en localStorage.

---

## Scope

### En scope
- `app/globals.css` — sistema de diseño neon portado verbatim desde `styles.css`
  (+ mejora: animación de glow sutil en hover de los covers)
- `lib/data.ts` — módulo tipado con `GAMES`, `CATS`, `seededScores`
- `components/Nav.tsx` — barra de navegación + drawer móvil
- `app/page.tsx` — Biblioteca: hero, buscador, chips de categoría, grid de cards con tilt 3D
- `app/juegos/[id]/page.tsx` — Detalle: cover, strip de stats, mini-leaderboard
- `app/juegos/[id]/jugar/page.tsx` — Reproductor: HUD estático, pantalla CRT con
  animaciones CSS, toggle de pausa, modal de game-over con campo de nombre
- `app/auth/page.tsx` — Auth: tabs login/registro, form, sesión en localStorage
- `app/salon/page.tsx` — Salón de la Fama: tabs por juego, pódium top-3, tabla completa,
  fila del usuario logueado

### Fuera de scope
- Lógica de juego real (ningún juego se implementa)
- Score que sube automáticamente via `setInterval` en el reproductor
- Autenticación con backend real
- Tests
- Internacionalización
- Cualquier pantalla o componente no presente en `references/templates/`

---

## Modelo de datos

### `lib/data.ts`

```ts
export type Game = {
  id: string       // slug usado como segmento de ruta y seed de leaderboard
  title: string
  short: string    // descripción breve para la card
  long: string     // descripción completa para el detalle
  cat: string      // "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS"
  cover: string    // clase CSS: "cover-bricks", "cover-tetro", etc.
  color: string    // "cyan" | "magenta" | "yellow" | "green"
  best: number     // mejor puntuación global (mock)
  plays: string    // partidas totales formateadas: "12.4K"
}

export type ScoreRow = {
  rank: number
  name: string
  score: number
  date: string     // "DD/MM/YYYY"
}

export const GAMES: Game[]          // 8 juegos
export const CATS: string[]         // ["TODOS","ARCADE","PUZZLE","SHOOTER","VERSUS"]
export function seededScores(seed: number, count?: number): ScoreRow[]
```

### localStorage (cliente)

| Clave | Tipo | Uso |
|---|---|---|
| `av_user` | `{ name: string }` | Sesión activa; escrita en auth, leída en Nav y reproductor |
| `av_scores` | `ScoreRow[]` | Puntuaciones guardadas desde el modal de game-over |

---

## Plan de implementación

1. **Sistema de diseño** — Portar `styles.css` → `app/globals.css` verbatim;
   añadir animación de glow hover en `.cover-bg`. Actualizar `app/layout.tsx`
   con metadata base y font mono.

2. **Módulo de datos** — Crear `lib/data.ts` con `GAMES`, `CATS` y `seededScores`
   tipados en TypeScript. Eliminar referencias a `window.*`.

3. **Nav** — Crear `components/Nav.tsx` (`'use client'`) con logo, links, contador
   de créditos, botón de sesión y drawer móvil. Integrarlo en `app/layout.tsx`.
   La sesión (`av_user`) se lee con `useState` + `useEffect` para evitar
   errores de hidratación SSR.

4. **Biblioteca** — Implementar `app/page.tsx`: hero con flicker, buscador,
   chips de categoría y grid de `GameCard` con efecto tilt 3D en `onMouseMove`.

5. **Detalle** — Implementar `app/juegos/[id]/page.tsx`: cover grande, tags,
   descripción larga, strip de stats (partidas, mejor global, dificultad)
   y mini-leaderboard de 10 filas generado con `seededScores`.

6. **Auth** — Implementar `app/auth/page.tsx` (`'use client'`): tabs
   INICIAR SESIÓN / CREAR CUENTA, form con campo de email condicional,
   botones sociales stub. Submit escribe en `localStorage` y redirige a `/`.

7. **Salón de la Fama** — Implementar `app/salon/page.tsx`: tabs por juego,
   pódium top-3, tabla completa de 12 filas con delays de animación,
   fila del usuario logueado en amarillo (si hay sesión).

8. **Reproductor** — Implementar `app/juegos/[id]/jugar/page.tsx` (`'use client'`):
   HUD con nombre/score/vidas/nivel estáticos, pantalla CRT con game-arena
   animado en CSS, toggle de pausa (overlay "EN PAUSA"), botón FIN abre
   modal de game-over con campo de nombre y botón guardar puntuación
   (escribe en `av_scores`).

---

## Criterios de aceptación

- [ ] `npm run dev` arranca sin errores en consola
- [ ] `npm run lint` pasa sin errores ni warnings
- [ ] `/` muestra el hero con animación flicker, buscador funcional y grid de 8 cards
- [ ] Buscar "CAÍDA" en la biblioteca filtra y muestra solo ese juego
- [ ] Seleccionar chip "SHOOTER" muestra solo los 2 juegos de esa categoría
- [ ] El efecto tilt 3D se activa al mover el mouse sobre una card
- [ ] Los 8 covers se renderizan como CSS puro (sin imágenes externas rotas)
- [ ] `/juegos/bloque-buster` muestra el detalle correcto: título, descripción larga,
      strip de stats y leaderboard de 10 filas
- [ ] `/juegos/caida` muestra datos diferentes a `/juegos/bloque-buster` (rutas dinámicas
      resuelven correctamente)
- [ ] `/juegos/bloque-buster/jugar` muestra HUD, pantalla CRT con enemies animados
      y botones PAUSA / FIN / SALIR
- [ ] Botón PAUSA muestra overlay "EN PAUSA"; REANUDAR lo cierra
- [ ] Botón FIN muestra el modal con puntuación final y campo de nombre
- [ ] Botón GUARDAR PUNTUACIÓN en el modal muestra "PUNTUACIÓN GUARDADA_"
- [ ] `/auth` alterna entre tabs INICIAR SESIÓN y CREAR CUENTA (campo email aparece
      solo en registro)
- [ ] Enviar el formulario de auth guarda `av_user` en localStorage y redirige a `/`
- [ ] El nombre del usuario logueado aparece en el Nav; hacer clic cierra la sesión
- [ ] `/salon` muestra tabs de los 8 juegos, pódium top-3 y tabla de 12 filas
- [ ] Con sesión activa, el Salón muestra la fila del usuario en color amarillo
- [ ] El Nav colapsa en viewport <768 px y el drawer se abre / cierra correctamente
- [ ] El footer "© 2026 ARCADE VAULT" aparece en todas las páginas

---

## Decisiones tomadas y descartadas

| Decisión | Tomada | Descartada | Razón |
|---|---|---|---|
| Score en reproductor | HUD estático (score = 0) | `setInterval` simulando score creciente | El usuario confirmó "no incluye juegos"; el tick de score es lógica de juego, no UI |
| Pausa y modal de FIN | Funcionales (toggle de estado) | Estáticos sin interacción | Son toggles de UI pura, no dependen de lógica de juego |
| Estilos | `styles.css` portado verbatim a `globals.css` | Reescribir con utilidades Tailwind | El sistema neon ya está completo; mezclar Tailwind añadiría complejidad sin beneficio |
| Covers | CSS puro (gradientes + pseudo-elementos) | Imágenes externas | Los covers del template son 100% CSS; se añade glow hover como mejora |
| Auth | localStorage (`av_user`) | Sin estado / backend real | Necesario para que el nombre del usuario aparezca en Nav y Salón |
| Ubicación de datos | `lib/data.ts` | `app/data.ts` | Convención Next.js; `app/data.ts` crearía conflicto potencial de ruta |
| Renderizado de páginas con sesión | `'use client'` + `useEffect` | SSR directo con `cookies()` | `localStorage` no existe en servidor; `useEffect` evita errores de hidratación sin complejidad adicional |

---

## Riesgos identificados

- **Hidratación SSR con localStorage**: cualquier componente que lea `av_user`
  debe ser `'use client'` e inicializar el estado en `useEffect`, no en el
  estado inicial. Si se lee en SSR se obtiene `undefined` y React lanza error
  de hidratación. **Mitigación**: Nav, Auth y Salón marcados como `'use client'`.

- **Tilt 3D en móvil**: el efecto usa `onMouseMove`, que no se dispara en
  dispositivos táctiles. Las cards en móvil no tendrán efecto tilt.
  **Mitigación**: aceptable para MVP; las cards siguen siendo usables.

- **`seededScores` con seed incorrecto**: si el `id` del juego cambia, el
  leaderboard generado cambia también (el seed depende de `id.length`).
  **Mitigación**: los IDs están fijos en `GAMES` y no se modifican en este spec.
