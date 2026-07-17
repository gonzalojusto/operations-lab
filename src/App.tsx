import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { OperationsScore } from './pages/OperationsScore';
import { Dashboard } from './pages/Dashboard';
import { SharedResult } from './pages/SharedResult';
import { InventoryAnalyzer } from './pages/InventoryAnalyzer';
import { DeadStockManager } from './pages/DeadStockManager';
import { KPIPulse } from './pages/KPIPulse';
import { SmartSlotLite } from './pages/SmartSlotLite';
import { ProcessMapper } from './pages/ProcessMapper';
import { CapacityPlanner } from './pages/CapacityPlanner';
import { OperationsBI } from './pages/OperationsBI';

// Usamos HashRouter porque el despliegue es en GitHub Pages (sin backend ni
// configuración de servidor para rutas), evitando 404s en recargas de página.
function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
