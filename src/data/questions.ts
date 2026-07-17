import type { Question } from '../types';

// ============================================================================
// 15 preguntas — Operational Health Check
// Diseñadas para ser cortas, accionables y basadas en buenas prácticas
// operativas reales (Lean, TOC, WMS, Six Sigma, S&OP).
// ============================================================================

export const QUESTIONS: Question[] = [
  // ---- Procesos (20%) ----
  {
    id: 'proc-01',
    category: 'procesos',
    question: '¿Tenéis SOPs (procedimientos escritos) para las operaciones clave?',
    description: 'Documentos que cualquier persona nueva podría seguir sin depender de "conocimiento tribal".',
    weight: 1.2,
  },
  {
    id: 'proc-02',
    category: 'procesos',
    question: '¿Los procesos están estandarizados entre turnos, equipos o sedes?',
    description: 'Misma tarea, mismo resultado, sin importar quién la ejecute o cuándo.',
    weight: 1,
  },
  {
    id: 'proc-03',
    category: 'procesos',
    question: '¿Existe un responsable claro (owner) para cada proceso crítico?',
    description: 'Ante un fallo, se sabe exactamente quién decide y quién actúa.',
    weight: 0.9,
  },
  // ---- KPIs (20%) ----
  {
    id: 'kpi-01',
    category: 'kpis',
    question: '¿Medís OTIF (On Time In Full) de forma sistemática?',
    description: 'Porcentaje de pedidos entregados completos y a tiempo, revisado con regularidad.',
    weight: 1.3,
  },
  {
    id: 'kpi-02',
    category: 'kpis',
    question: '¿Existe un dashboard de KPIs operativos visible para el equipo?',
    description: 'Métricas centralizadas y actualizadas, no dispersas en emails o memoria.',
    weight: 1.1,
  },
  {
    id: 'kpi-03',
    category: 'kpis',
    question: '¿Se revisan los KPIs en reuniones periódicas con acciones derivadas?',
    description: 'Los datos generan decisiones, no solo se archivan.',
    weight: 1,
  },
  // ---- Inventario (20%) ----
  {
    id: 'inv-01',
    category: 'inventario',
    question: '¿Realizáis cycle counts o conteos cíclicos de inventario?',
    description: 'Conteos parciales frecuentes en lugar de un único inventario anual.',
    weight: 1.2,
  },
  {
    id: 'inv-02',
    category: 'inventario',
    question: '¿Aplicáis clasificación ABC a vuestro inventario?',
    description: 'Priorización de referencias según su impacto en valor o rotación.',
    weight: 1.1,
  },
  {
    id: 'inv-03',
    category: 'inventario',
    question: '¿Tenéis visibilidad clara del stock obsoleto o de lento movimiento?',
    description: 'Sabéis qué referencias llevan meses sin rotar y su coste asociado.',
    weight: 1,
  },
  // ---- Tecnología (15%) ----
  {
    id: 'tec-01',
    category: 'tecnologia',
    question: '¿Vuestro ERP/WMS cubre las necesidades operativas actuales?',
    description: 'El sistema soporta el volumen y la complejidad real del negocio.',
    weight: 1.1,
  },
  {
    id: 'tec-02',
    category: 'tecnologia',
    question: '¿Habéis reducido la dependencia de Excel automatizando procesos críticos?',
    description: '5 = procesos críticos ya fuera de Excel; 0 = todo depende de hojas de cálculo.',
    weight: 1,
  },
  {
    id: 'tec-03',
    category: 'tecnologia',
    question: '¿Los sistemas están integrados entre sí (ventas, almacén, finanzas)?',
    description: 'Los datos fluyen automáticamente sin reintroducción manual.',
    weight: 0.9,
  },
  // ---- Gestión Operativa (15%) ----
  {
    id: 'ges-01',
    category: 'gestion',
    question: '¿Existe planificación de capacidad (personal, almacén, transporte)?',
    description: 'Se anticipan picos de demanda en lugar de reaccionar sobre la marcha.',
    weight: 1.1,
  },
  {
    id: 'ges-02',
    category: 'gestion',
    question: '¿Hay un proceso formal de gestión de incidencias operativas?',
    description: 'Registro, priorización y seguimiento de incidencias hasta su cierre.',
    weight: 1,
  },
  // ---- Mejora Continua (10%) ----
  {
    id: 'mej-01',
    category: 'mejora',
    question: '¿Existe un proceso estructurado de mejora continua (Kaizen, retros, etc.)?',
    description: 'Espacio recurrente para identificar e implementar mejoras.',
    weight: 1,
  },
];
