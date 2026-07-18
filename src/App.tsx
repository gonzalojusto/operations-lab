import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RouteLoadingFallback } from './components/layout/RouteLoadingFallback';

// Cada módulo se carga bajo demanda (code-splitting por ruta). La Home se
// mantiene en el bundle principal porque es la primera pantalla que ve
// cualquier visitante; el resto de módulos solo se descargan cuando el
// usuario navega a ellos. Esto es clave para que el bundle no crezca sin
// límite a medida que se añaden más herramientas a la suite.
const OperationsScore = lazy(() => import('./pages/OperationsScore').then((m) => ({ default: m.OperationsScore })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const SharedResult = lazy(() => import('./pages/SharedResult').then((m) => ({ default: m.SharedResult })));
const InventoryAnalyzer = lazy(() =>
  import('./pages/InventoryAnalyzer').then((m) => ({ default: m.InventoryAnalyzer }))
);
const DeadStockManager = lazy(() =>
  import('./pages/DeadStockManager').then((m) => ({ default: m.DeadStockManager }))
);
const KPIPulse = lazy(() => import('./pages/KPIPulse').then((m) => ({ default: m.KPIPulse })));
const SmartSlotLite = lazy(() => import('./pages/SmartSlotLite').then((m) => ({ default: m.SmartSlotLite })));
const ProcessMapper = lazy(() => import('./pages/ProcessMapper').then((m) => ({ default: m.ProcessMapper })));
const CapacityPlanner = lazy(() =>
  import('./pages/CapacityPlanner').then((m) => ({ default: m.CapacityPlanner }))
);
const OperationsBI = lazy(() => import('./pages/OperationsBI').then((m) => ({ default: m.OperationsBI })));

// Usamos HashRouter porque el despliegue es en GitHub Pages (sin backend ni
// configuración de servidor para rutas), evitando 404s en recargas de página.
function App() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/operations-score" element={<OperationsScore />} />
          <Route path="/operations-score/results" element={<Dashboard />} />
          <Route path="/share" element={<SharedResult />} />
          <Route path="/inventory-analyzer" element={<InventoryAnalyzer />} />
          <Route path="/dead-stock-manager" element={<DeadStockManager />} />
          <Route path="/kpi-pulse" element={<KPIPulse />} />
          <Route path="/smartslot-lite" element={<SmartSlotLite />} />
          <Route path="/process-mapper" element={<ProcessMapper />} />
          <Route path="/capacity-planner" element={<CapacityPlanner />} />
          <Route path="/operations-bi" element={<OperationsBI />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
