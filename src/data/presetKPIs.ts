import type { KPIDefinition } from '../types';

// ============================================================================
// KPIs operativos preconfigurados — el usuario puede añadir los suyos propios
// además de estos. Los targets son valores de referencia sectoriales
// razonables, no exactos para cada negocio.
// ============================================================================
export const PRESET_KPIS: KPIDefinition[] = [
  {
    id: 'preset-otif',
    name: 'OTIF (On Time In Full)',
    unit: '%',
    target: 95,
    direction: 'higher-is-better',
    isPreset: true,
  },
  {
    id: 'preset-inventory-accuracy',
    name: 'Exactitud de Inventario',
    unit: '%',
    target: 98,
    direction: 'higher-is-better',
    isPreset: true,
  },
  {
    id: 'preset-inventory-turnover',
    name: 'Rotación de Inventario',
    unit: 'veces/año',
    target: 8,
    direction: 'higher-is-better',
    isPreset: true,
  },
  {
    id: 'preset-cost-per-order',
    name: 'Coste por Pedido',
    unit: '€',
    target: 6,
    direction: 'lower-is-better',
    isPreset: true,
  },
  {
    id: 'preset-picking-time',
    name: 'Tiempo Medio de Picking',
    unit: 'min/pedido',
    target: 4,
    direction: 'lower-is-better',
    isPreset: true,
  },
];
