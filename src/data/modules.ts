import type { ProductModule } from '../types';

export type ModuleCategory = 'diagnostico' | 'inventario' | 'kpis-procesos' | 'planificacion';

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  diagnostico: 'Diagnóstico',
  inventario: 'Inventario',
  'kpis-procesos': 'KPIs y Procesos',
  planificacion: 'Planificación y BI',
};

export const MODULES: (ProductModule & { category: ModuleCategory })[] = [
  {
    id: 'operations-score',
    name: 'Operations Score',
    description: 'Diagnóstico operativo completo en menos de 5 minutos. Score, madurez, riesgos y quick wins.',
    status: 'live',
    route: '/operations-score',
    icon: 'Gauge',
    category: 'diagnostico',
  },
  {
    id: 'inventory-analyzer',
    name: 'Inventory Analyzer',
    description: 'Análisis avanzado de inventario: ABC, rotación, cobertura y detección de excesos.',
    status: 'live',
    route: '/inventory-analyzer',
    icon: 'Package',
    category: 'inventario',
  },
  {
    id: 'dead-stock-manager',
    name: 'Dead Stock Manager',
    description: 'Identifica y gestiona el stock obsoleto antes de que erosione tu margen.',
    status: 'live',
    route: '/dead-stock-manager',
    icon: 'PackageX',
    category: 'inventario',
  },
  {
    id: 'smartslot-lite',
    name: 'SmartSlot Lite',
    description: 'Optimización ligera de slotting y ubicaciones de almacén.',
    status: 'live',
    route: '/smartslot-lite',
    icon: 'LayoutGrid',
    category: 'inventario',
  },
  {
    id: 'kpi-pulse',
    name: 'KPI Pulse',
    description: 'Dashboard en tiempo real de tus KPIs operativos clave.',
    status: 'live',
    route: '/kpi-pulse',
    icon: 'Activity',
    category: 'kpis-procesos',
  },
  {
    id: 'process-mapper',
    name: 'Process Mapper',
    description: 'Mapea y documenta tus procesos operativos de forma visual.',
    status: 'live',
    route: '/process-mapper',
    icon: 'GitBranch',
    category: 'kpis-procesos',
  },
  {
    id: 'capacity-planner',
    name: 'Capacity Planner',
    description: 'Calcula si tu plantilla cubre la demanda esperada, con picos por día de la semana.',
    status: 'live',
    route: '/capacity-planner',
    icon: 'Users',
    category: 'planificacion',
  },
  {
    id: 'operations-bi',
    name: 'Operations BI',
    description: 'Vista consolidada: histórico de Operations Score y estado de tus KPIs.',
    status: 'live',
    route: '/operations-bi',
    icon: 'BarChart3',
    category: 'planificacion',
  },
];

export function groupModulesByCategory(): { category: ModuleCategory; label: string; modules: typeof MODULES }[] {
  const order: ModuleCategory[] = ['diagnostico', 'inventario', 'kpis-procesos', 'planificacion'];
  return order
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      modules: MODULES.filter((m) => m.category === category),
    }))
    .filter((group) => group.modules.length > 0);
}
