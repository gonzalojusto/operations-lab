# Operations Lab

> **Build Better Operations**

📖 [Manual de usuario](./docs/MANUAL.md) — cómo usar los 8 módulos, paso a paso.

Operations Lab es una suite de herramientas frontend-only para PYMEs (10–500
empleados) enfocada en operaciones, logística, inventario y KPIs. Todo el
análisis se ejecuta **100% en el navegador**: sin backend, sin base de datos,
sin login, sin APIs externas. Los datos de la empresa nunca salen del
dispositivo del usuario.

Este repositorio contiene el primer módulo del producto: **Operations
Score**, un *Operational Health Check* que se completa en menos de 5 minutos
y entrega un diagnóstico operativo completo con score, madurez, riesgos,
quick wins, ahorro potencial estimado y un informe PDF exportable.

---

## ✨ Demo

- App en vivo: `https://<tu-usuario>.github.io/operations-lab/`
- Stack: React + TypeScript + Vite + Tailwind CSS v4 + Zustand + Chart.js

---

## 🧱 Stack técnico

| Categoría        | Tecnología                         |
|-------------------|-------------------------------------|
| Framework         | React 19 + TypeScript               |
| Build tool        | Vite                                |
| Estilos           | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Estado global     | Zustand                             |
| Gráficos          | Chart.js + react-chartjs-2          |
| CSV parsing       | PapaParse                           |
| Generación de PDF | jsPDF + html2canvas                 |
| Iconos            | Lucide React                        |
| Routing           | React Router (HashRouter)           |

No hay backend, base de datos ni autenticación: es una **SPA estática**
desplegable en GitHub Pages.

---

## 📂 Estructura del proyecto

```
src/
├── assets/
├── components/
│   ├── layout/       # AppLayout, Sidebar, Navbar
│   ├── ui/           # ModuleCard, ProgressBar
│   ├── forms/        # CompanyForm, QuestionCard, CSVUploader
│   ├── charts/        # RadarChart
│   └── dashboard/     # ScoreCard, ConfidenceCard, RisksCard,
│                      # QuickWinsCard, SavingsCard, RoadmapCard, PDFButton
├── pages/             # Home, OperationsScore, Dashboard
├── services/          # scoring.ts, csvAnalysis.ts, pdfGenerator.ts
├── store/             # useOperationsStore (Zustand)
├── hooks/
├── types/             # Tipos de dominio compartidos
└── data/              # questions.ts, modules.ts
```

---

## 🚀 Instalación

Requisitos: Node.js ≥ 18.

```bash
git clone https://github.com/<tu-usuario>/operations-lab.git
cd operations-lab
npm install
```

## 🧑‍💻 Scripts

```bash
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # type-check (tsc -b) + build de producción a /dist
npm run preview   # sirve /dist localmente para verificar el build
npm run lint      # oxlint sobre src/
npm run test      # vitest — tests unitarios del motor de scoring
npm run deploy    # build + publicación manual en GitHub Pages (rama gh-pages)
```

---

## 🧮 Cómo funciona Operations Score

1. **Datos de la empresa** — nombre, sector, nº empleados, almacén, ERP, Excel, país.
2. **15 preguntas** ponderadas en 6 categorías (Procesos, KPIs, Inventario,
   Tecnología, Gestión Operativa, Mejora Continua), escala 0–5.
3. **Carga opcional de 3 CSVs** (`inventario.csv`, `pedidos.csv`,
   `incidencias.csv`) — se parsean y analizan enteramente en el cliente con
   PapaParse.
4. **Resultado**: score global (0–100), score por categoría, nivel de
   madurez, Confidence Score, radar chart, riesgos, top 5 quick wins, ahorro
   potencial estimado, roadmap a 30/90/180 días, e informe PDF descargable.

### Pesos por categoría

| Categoría | Peso |
|---|---|
| Procesos | 20% |
| KPIs | 20% |
| Inventario | 20% |
| Tecnología | 15% |
| Gestión Operativa | 15% |
| Mejora Continua | 10% |

### Niveles de madurez

| Score | Nivel |
|---|---|
| 0–24 | Reactive |
| 25–49 | Developing |
| 50–74 | Structured |
| 75–100 | Operational Excellence |

Toda la lógica de cálculo vive en `src/services/scoring.ts`
(`calculateCategoryScore`, `calculateGlobalScore`, `calculateConfidenceScore`,
`calculatePotentialSavings`, `generateRecommendations`, `generateQuickWins`,
`generateRiskAssessment`, `generateRoadmap`, `generateMaturityLevel`).

> **Nota**: el ahorro potencial estimado es siempre una aproximación
> orientativa basada en benchmarks sectoriales — nunca se presenta como un
> compromiso ni una auditoría financiera formal.

---

## 🔗 Estrategia de producto implementada

Más allá del cálculo del score, esta versión materializa la estrategia de
negocio descrita en el resumen ejecutivo del proyecto:

- **Cross-sell contextual** (`src/data/crossSell.ts`): el dashboard identifica
  la categoría más débil del diagnóstico y, si existe un módulo futuro de la
  suite que la resuelve (Inventory Analyzer, KPI Pulse, Process Mapper), lo
  sugiere explícitamente. Si no hay un módulo relevante para esa categoría,
  deliberadamente no se sugiere nada — se prioriza no ser intrusivo sobre
  forzar una recomendación genérica. Esto materializa el pipeline
  *"Score → detecta problema → sugiere herramienta"* del plan de producto.
- **Contacto / lead generation**: un botón "Contactar" en el dashboard abre
  un `mailto:` con el resumen del diagnóstico ya redactado (empresa, score,
  categoría más débil), y el PDF cierra con los mismos datos de contacto.
  Sin backend, sin formularios: todo se genera en el cliente.
- **Resultado compartible** (`src/utils/shareState.ts` + página `/share`):
  el botón "Compartir resultado" codifica la empresa y las 15 respuestas en
  un parámetro de la URL (base64 URL-safe, sin datos de CSV). Quien abre el
  enlace ve el diagnóstico recalculado localmente en su propio navegador —
  ningún dato pasa por un servidor — y termina con una llamada a la acción
  para hacer su propio Operations Score, cerrando el bucle viral del lead
  magnet.

---

## ✅ Calidad y robustez

- **Tests unitarios** (Vitest, `npm run test`): motor de scoring, round-trip
  de resultados compartibles, estado/tendencia de KPIs, algoritmo de
  slotting y cálculo de capacidad — 34 tests en total.
- **`ErrorBoundary`** global evita pantallas en blanco ante errores
  inesperados en producción.
- **`oxlint`** sobre todo `src/` sin warnings ni errores.
- Revisión manual de las 15 preguntas: se corrigió `tec-02` (dependencia de
  Excel), cuya redacción original invertía la semántica de la escala 0–5
  frente al resto del cuestionario.

---

## 🗺️ Roadmap del producto

| Versión | Módulo | Estado |
|---|---|---|
| V1 | Operations Score | ✅ Live |
| V2 | Inventory Analyzer, Dead Stock Manager | ✅ Live |
| V3 | KPI Pulse, SmartSlot Lite | ✅ Live |
| V4 (este repo) | Process Mapper, Capacity Planner, Operations BI | ✅ Live |

Los 8 módulos del roadmap original están implementados y funcionando. KPI
Pulse, Process Mapper, Capacity Planner y el historial que alimenta
Operations BI persisten sus datos en `localStorage` (por navegador, sin
sincronización entre dispositivos ni backend) usando el middleware `persist`
de Zustand.

---

## 🧱 Arquitectura pensada para crecer

Con 8 módulos ya en producción, esta versión resuelve dos problemas de
escala antes de que se convirtieran en deuda técnica real:

- **Code-splitting por ruta** (`React.lazy` + `Suspense` en `App.tsx`): cada
  módulo se descarga solo cuando el usuario navega a él. El bundle inicial
  bajó de ~1.1 MB a ~250 KB; los módulos más pesados (los que usan jsPDF,
  html2canvas o Chart.js) quedan aislados en su propio chunk y no penalizan
  a quien solo visita la Home o hace el diagnóstico.
- **Navegación por categorías** (`groupModulesByCategory()` en
  `src/data/modules.ts`): la Home y el Sidebar agrupan los módulos en
  *Diagnóstico*, *Inventario*, *KPIs y Procesos*, *Planificación y BI* en
  lugar de una rejilla plana. Añadir un módulo nuevo a una categoría
  existente no requiere tocar el layout.

### Cómo añadir un módulo nuevo

1. **Tipos**: añade las interfaces del dominio en `src/types/index.ts`.
2. **Lógica pura**: crea el servicio de cálculo en `src/services/` (sin
   dependencias de React) y su test en `*.test.ts` junto al archivo.
3. **Estado**: si el módulo necesita persistencia entre sesiones, crea un
   store en `src/store/` con `zustand` + `persist` (localStorage), siguiendo
   el patrón de `useKPIPulseStore.ts` o `useProcessMapperStore.ts`.
4. **Componentes**: componentes específicos del módulo van en su propia
   carpeta bajo `src/components/` (p.ej. `src/components/inventory/`).
5. **Página**: crea `src/pages/MiModulo.tsx` reutilizando `AppLayout`,
   `StatCard`, `Gauge` y demás componentes ya existentes en `ui/`.
6. **Registro**: añade la entrada en `src/data/modules.ts` (con su
   `category`) — esto la hace aparecer automáticamente en Home y Sidebar.
7. **Ruta**: añade el `React.lazy(...)` y la `<Route>` correspondiente en
   `src/App.tsx`.
8. **Verifica**: `npx tsc -b && npx oxlint src && npm run test && npm run build`
   deben pasar en verde antes de hacer commit.

---

## ☁️ Despliegue en GitHub Pages

El repo incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`)
que construye y publica automáticamente en cada push a `main`.

### Configuración inicial (una sola vez)

1. En GitHub → **Settings → Pages → Build and deployment → Source**, selecciona
   **GitHub Actions**.
2. Comprueba que `vite.config.ts` tiene `base: '/operations-lab/'` (debe
   coincidir con el nombre exacto del repositorio).
3. Haz push a `main`: el workflow construye el proyecto y lo publica.

### Despliegue manual (alternativa sin Actions)

```bash
npm run deploy
```

Esto ejecuta `npm run build` y publica el contenido de `/dist` en la rama
`gh-pages` usando el paquete `gh-pages`. En **Settings → Pages**, selecciona
entonces la rama `gh-pages` como fuente.

> Se usa `HashRouter` (no `BrowserRouter`) precisamente para evitar 404s en
> GitHub Pages al recargar rutas internas, ya que GitHub Pages no soporta
> rewrites de servidor.

---

## 🎨 Design system

Los tokens de diseño (color, tipografía, radios, sombras) están centralizados
en `src/index.css` mediante `@theme` de Tailwind v4 — inspirados en Stripe,
Linear y Vercel: modo oscuro, tipografía nítida, mucho aire, animaciones
sutiles (`fade-in`, `skeleton`).

---

## 🤝 Contribución

Este es actualmente un proyecto personal en fase MVP. Si quieres proponer
mejoras:

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/mi-mejora`).
3. Haz commit de tus cambios y abre un Pull Request.

---

## 📄 Licencia

MIT © 2026
