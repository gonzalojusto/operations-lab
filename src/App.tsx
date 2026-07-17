import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { OperationsScore } from './pages/OperationsScore';
import { Dashboard } from './pages/Dashboard';

// Usamos HashRouter porque el despliegue es en GitHub Pages (sin backend ni
// configuración de servidor para rutas), evitando 404s en recargas de página.
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/operations-score" element={<OperationsScore />} />
        <Route path="/operations-score/results" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
