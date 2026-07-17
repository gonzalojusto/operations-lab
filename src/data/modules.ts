import type { ProductModule } from '../types';

export const MODULES: ProductModule[] = [
  {
    id: 'operations-score',
    name: 'Operations Score',
    description: 'Diagnóstico operativo completo en menos de 5 minutos. Score, madurez, riesgos y quick wins.',
    status: 'live',
    route: '/operations-score',
    icon: 'Gauge',
  },
  {
    id: 'inventory-analyzer',
    name: 'Inventory Analyzer',
    description: 'Análisis avanzado de inventario: ABC, rotación, cobertura y detección de excesos.',
    status: 'live',
    route: '/inventory-analyzer',
    icon: 'Package',
  },
  {
    id: 'dead-stock-manager',
    name: 'Dead Stock Manager',
    description: 'Identifica y gestiona el stock obsoleto antes de que erosione tu margen.',
    status: 'live',
    route: '/dead-stock-manager',
    icon: 'PackageX',
  },
  {
    id: 'kpi-pulse',
    name: 'KPI Pulse',
    description: 'Dashboard en tiempo real de tus KPIs operativos clave.',
    status: 'live',
    route: '/kpi-pulse',
    icon: 'Activity',
  },
  {
    id: 'smartslot-lite',
    name: 'SmartSlot Lite',
    description: 'Optimización ligera de slotting y ubicaciones de almacén.',
    status: 'live',
    route: '/smartslot-lite',
    icon: 'LayoutGrid',
  },
  {
    id: 'process-mapper',
    name: 'Process Mapper',
    description: 'Mapea y documenta tus procesos operativos de forma visual.',
    status: 'coming-soon',
    route: '/process-mapper',
    icon: 'GitBranch',
  },
];
