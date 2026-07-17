import Papa from 'papaparse';
import type { IncidentsCSVResult, InventoryCSVResult, OrdersCSVResult } from '../types';

// ============================================================================
// Utilidades genéricas de parsing (100% cliente, sin backend)
// ============================================================================

function parseCSVFile(file: File): Promise<Papa.ParseResult<Record<string, string>>> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => resolve(results),
      error: (err) => reject(err),
    });
  });
}

function findColumn(fields: string[], candidates: string[]): string | undefined {
  const normalized = fields.map((f) => f.trim().toLowerCase());
  for (const candidate of candidates) {
    const idx = normalized.indexOf(candidate);
    if (idx !== -1) return fields[idx];
  }
  // fallback: contains match
  for (const candidate of candidates) {
    const idx = normalized.findIndex((f) => f.includes(candidate));
    if (idx !== -1) return fields[idx];
  }
  return undefined;
}

function toNumber(value: string | undefined): number {
  if (!value) return NaN;
  const cleaned = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? NaN : n;
}

// ============================================================================
// inventario.csv
// Columnas esperadas (flexibles): sku, stock/cantidad, ultima_venta/last_sale,
// coste/precio, categoria
// ============================================================================
export async function analyzeInventoryCSV(file: File): Promise<InventoryCSVResult> {
  const { data, meta, errors } = await parseCSVFile(file);
  const fields = meta.fields ?? [];
  const warnings: string[] = [];

  const skuCol = findColumn(fields, ['sku', 'referencia', 'codigo', 'código']);
  const stockCol = findColumn(fields, ['stock', 'cantidad', 'unidades', 'qty']);
  const lastSaleCol = findColumn(fields, ['ultima_venta', 'última_venta', 'last_sale', 'fecha_ultima_venta']);
  const valueCol = findColumn(fields, ['valor', 'coste', 'costo', 'precio', 'value']);

  if (!skuCol) warnings.push('No se detectó una columna de SKU/referencia clara.');
  if (!stockCol) warnings.push('No se detectó una columna de stock/cantidad clara.');

  const seen = new Set<string>();
  let duplicates = 0;
  let missingValues = 0;
  let deadStockCount = 0;
  let excessCount = 0;

  const valuedRows: { sku: string; value: number }[] = [];

  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

  for (const row of data) {
    const sku = skuCol ? row[skuCol]?.trim() : undefined;
    if (sku) {
      if (seen.has(sku)) duplicates += 1;
      seen.add(sku);
    }

    const stock = stockCol ? toNumber(row[stockCol]) : NaN;
    if (Number.isNaN(stock)) missingValues += 1;

    if (lastSaleCol) {
      const raw = row[lastSaleCol];
      const date = raw ? new Date(raw) : undefined;
      if (date && !Number.isNaN(date.getTime())) {
        if (now - date.getTime() > NINETY_DAYS) deadStockCount += 1;
      }
    }

    if (stockCol && !Number.isNaN(stock) && stock > 0) {
      const value = valueCol ? toNumber(row[valueCol]) : stock;
      valuedRows.push({ sku: sku ?? '', value: Number.isNaN(value) ? stock : value * stock });
      if (stock > 500) excessCount += 1; // heurística simple de exceso
    }
  }

  // ABC analysis (por valor, regla 80/15/5)
  valuedRows.sort((a, b) => b.value - a.value);
  const totalValue = valuedRows.reduce((acc, r) => acc + r.value, 0) || 1;
  let cumulative = 0;
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  for (const r of valuedRows) {
    cumulative += r.value;
    const pct = cumulative / totalValue;
    if (pct <= 0.8) aCount += 1;
    else if (pct <= 0.95) bCount += 1;
    else cCount += 1;
  }

  const rowCount = data.length;
  const deadStockPercentage = rowCount > 0 ? (deadStockCount / rowCount) * 100 : 0;

  if (errors.length > 0) warnings.push(`${errors.length} filas con errores de formato.`);
  if (!lastSaleCol) warnings.push('No se detectó columna de última venta: no se pudo calcular dead stock con precisión.');

  // Inventory health score simple: penaliza dead stock, duplicados y missing values
  let inventoryHealth = 100;
  inventoryHealth -= Math.min(40, deadStockPercentage);
  inventoryHealth -= Math.min(20, rowCount > 0 ? (duplicates / rowCount) * 100 : 0);
  inventoryHealth -= Math.min(20, rowCount > 0 ? (missingValues / rowCount) * 100 : 0);
  inventoryHealth = Math.max(0, Math.round(inventoryHealth));

  return {
    fileName: file.name,
    rowCount,
    skuCount: seen.size || rowCount,
    deadStockCount,
    deadStockPercentage: Math.round(deadStockPercentage * 10) / 10,
    abcAnalysis: { a: aCount, b: bCount, c: cCount },
    missingValues,
    duplicates,
    potentialExcessStock: excessCount,
    inventoryHealth,
    warnings,
  };
}

// ============================================================================
// pedidos.csv
// Columnas esperadas: fecha/date, pedido_id/order_id, cliente/customer, importe
// ============================================================================
export async function analyzeOrdersCSV(file: File): Promise<OrdersCSVResult> {
  const { data, meta, errors } = await parseCSVFile(file);
  const fields = meta.fields ?? [];
  const warnings: string[] = [];

  const dateCol = findColumn(fields, ['fecha', 'date', 'created_at']);
  const orderCol = findColumn(fields, ['pedido_id', 'order_id', 'id', 'pedido']);
  const customerCol = findColumn(fields, ['cliente', 'customer', 'cliente_id']);

  if (!dateCol) warnings.push('No se detectó columna de fecha: no se pudo analizar tendencia ni estacionalidad.');

  const monthlyMap = new Map<string, number>();
  const customerCounts = new Map<string, number>();

  for (const row of data) {
    if (dateCol) {
      const raw = row[dateCol];
      const date = raw ? new Date(raw) : undefined;
      if (date && !Number.isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
      }
    }
    if (customerCol) {
      const customer = row[customerCol]?.trim();
      if (customer) customerCounts.set(customer, (customerCounts.get(customer) ?? 0) + 1);
    }
  }

  const monthlyDistribution = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));

  let trend: 'up' | 'down' | 'stable' = 'stable';
  let trendPercentage = 0;
  if (monthlyDistribution.length >= 2) {
    const first = monthlyDistribution[0].value;
    const last = monthlyDistribution[monthlyDistribution.length - 1].value;
    if (first > 0) {
      trendPercentage = Math.round(((last - first) / first) * 1000) / 10;
      if (trendPercentage > 5) trend = 'up';
      else if (trendPercentage < -5) trend = 'down';
    }
  }

  // Concentración: % de pedidos que representa el top 20% de clientes
  let concentrationTop20Percentage = 0;
  if (customerCounts.size > 0) {
    const sorted = Array.from(customerCounts.values()).sort((a, b) => b - a);
    const top20Count = Math.max(1, Math.ceil(sorted.length * 0.2));
    const top20Sum = sorted.slice(0, top20Count).reduce((a, b) => a + b, 0);
    const total = sorted.reduce((a, b) => a + b, 0) || 1;
    concentrationTop20Percentage = Math.round((top20Sum / total) * 1000) / 10;
  } else {
    warnings.push('No se detectó columna de cliente: no se pudo calcular la concentración.');
  }

  const seasonalityDetected =
    monthlyDistribution.length >= 12 &&
    Math.max(...monthlyDistribution.map((m) => m.value)) >
      1.5 * (monthlyDistribution.reduce((a, m) => a + m.value, 0) / monthlyDistribution.length);

  if (errors.length > 0) warnings.push(`${errors.length} filas con errores de formato.`);
  if (!orderCol) warnings.push('No se detectó columna de identificador de pedido.');

  return {
    fileName: file.name,
    rowCount: data.length,
    totalOrders: data.length,
    trend,
    trendPercentage,
    concentrationTop20Percentage,
    monthlyDistribution,
    seasonalityDetected,
    warnings,
  };
}

// ============================================================================
// incidencias.csv
// Columnas esperadas: tipo/type, severidad/severity, fecha/date
// ============================================================================
export async function analyzeIncidentsCSV(file: File): Promise<IncidentsCSVResult> {
  const { data, meta, errors } = await parseCSVFile(file);
  const fields = meta.fields ?? [];
  const warnings: string[] = [];

  const typeCol = findColumn(fields, ['tipo', 'type', 'categoria', 'incidencia']);
  const severityCol = findColumn(fields, ['severidad', 'severity', 'prioridad', 'priority']);

  if (!typeCol) warnings.push('No se detectó columna de tipo de incidencia: no se pudo calcular Pareto.');

  const typeCounts = new Map<string, number>();
  const severityCounts = new Map<string, number>();

  for (const row of data) {
    if (typeCol) {
      const type = row[typeCol]?.trim() || 'Sin clasificar';
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    }
    if (severityCol) {
      const severity = row[severityCol]?.trim() || 'Sin clasificar';
      severityCounts.set(severity, (severityCounts.get(severity) ?? 0) + 1);
    }
  }

  const total = data.length || 1;
  const sortedTypes = Array.from(typeCounts.entries()).sort(([, a], [, b]) => b - a);

  let cumulative = 0;
  const pareto = sortedTypes.map(([label, count]) => {
    cumulative += count;
    return { label, count, cumulativePercentage: Math.round((cumulative / total) * 1000) / 10 };
  });

  const topIncidents = sortedTypes.slice(0, 5).map(([label, count]) => ({
    label,
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));

  const severityBreakdown = Array.from(severityCounts.entries()).map(([severity, count]) => ({
    severity,
    count,
  }));

  // Impacto estimado: si el top 20% de tipos concentra >70% de las incidencias, o
  // predominan severidades altas, el impacto es alto.
  const paretoTop20 = pareto.slice(0, Math.max(1, Math.ceil(pareto.length * 0.2)));
  const top20Concentration = paretoTop20.reduce((acc, p) => acc + p.count, 0) / total;

  const highSeverityCount = Array.from(severityCounts.entries())
    .filter(([sev]) => /alta|high|critic/i.test(sev))
    .reduce((acc, [, count]) => acc + count, 0);
  const highSeverityRatio = highSeverityCount / total;

  let estimatedImpact: 'low' | 'medium' | 'high' = 'low';
  if (top20Concentration > 0.7 || highSeverityRatio > 0.3) estimatedImpact = 'high';
  else if (top20Concentration > 0.5 || highSeverityRatio > 0.15) estimatedImpact = 'medium';

  if (errors.length > 0) warnings.push(`${errors.length} filas con errores de formato.`);
  if (!severityCol) warnings.push('No se detectó columna de severidad.');

  return {
    fileName: file.name,
    rowCount: data.length,
    totalIncidents: data.length,
    pareto,
    topIncidents,
    severityBreakdown,
    estimatedImpact,
    warnings,
  };
}
