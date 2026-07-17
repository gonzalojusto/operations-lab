import type { CapacityInputs, CapacityResult } from '../types';

const WEEKDAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export { WEEKDAY_LABELS };

/**
 * Calcula la capacidad operativa necesaria (en horas y personas) a partir de
 * un volumen medio de pedidos/día, el tiempo de proceso por pedido y las
 * horas disponibles por empleado. Aplica multiplicadores de demanda por día
 * de la semana para reflejar picos (p.ej. viernes/sábado en ecommerce).
 */
export function computeCapacity(inputs: CapacityInputs): CapacityResult {
  const { ordersPerDay, minutesPerOrder, hoursPerEmployeePerDay, currentEmployees, weeklyDemandMultipliers } =
    inputs;

  const baseRequiredHours = (ordersPerDay * minutesPerOrder) / 60;
  const availableHoursPerEmployee = hoursPerEmployeePerDay;
  const availableHours = currentEmployees * availableHoursPerEmployee;

  const dailyRequiredHours = weeklyDemandMultipliers.map((m) => Math.round(baseRequiredHours * m * 10) / 10);
  const dailyAvailableHours = weeklyDemandMultipliers.map(() => availableHours);

  const avgRequiredHours = dailyRequiredHours.reduce((a, b) => a + b, 0) / dailyRequiredHours.length;
  const requiredEmployees = availableHoursPerEmployee > 0 ? Math.ceil(avgRequiredHours / availableHoursPerEmployee) : 0;

  const utilization = availableHours > 0 ? Math.round((avgRequiredHours / availableHours) * 1000) / 10 : 0;
  const gap = requiredEmployees - currentEmployees;

  return {
    requiredEmployees,
    utilization,
    gap,
    dailyRequiredHours,
    dailyAvailableHours,
  };
}
