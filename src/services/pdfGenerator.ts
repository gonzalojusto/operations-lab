import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CATEGORY_LABELS } from '../types';
import type { CompanyInfo, ScoreResult } from '../types';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const BRAND = '#3d63e0';
const DARK = '#111318';
const GRAY = '#6b6f7a';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    value
  );
}

function addHeader(doc: jsPDF, title: string, pageLabel: string) {
  doc.setFillColor(BRAND);
  doc.rect(0, 0, PAGE_W, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  doc.text('OPERATIONS LAB · Operations Score', MARGIN, 14);
  doc.text(pageLabel, PAGE_W - MARGIN, 14, { align: 'right' });
  doc.setDrawColor(230, 230, 230);
  doc.line(MARGIN, 18, PAGE_W - MARGIN, 18);
  doc.setFontSize(20);
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(title, MARGIN, 32);
  doc.setFont('helvetica', 'normal');
}

function addFooter(doc: jsPDF, pageNumber: number) {
  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text(`Página ${pageNumber} de 8`, PAGE_W / 2, PAGE_H - 10, { align: 'center' });
  doc.text('Generado por Operations Lab — Estimaciones orientativas, no auditoría financiera formal.', MARGIN, PAGE_H - 10);
}

export async function generatePDFReport(
  company: CompanyInfo,
  result: ScoreResult,
  radarElement?: HTMLElement | null
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let page = 1;

  // Captura opcional del radar chart real renderizado en pantalla (html2canvas),
  // para que la página 3 refleje exactamente lo que el usuario ve en el dashboard.
  let radarImage: string | null = null;
  if (radarElement) {
    try {
      const canvas = await html2canvas(radarElement, {
        backgroundColor: '#16181d',
        scale: 2,
      });
      radarImage = canvas.toDataURL('image/png');
    } catch {
      radarImage = null;
    }
  }

  // ---------- Página 1: Executive Summary ----------
  addHeader(doc, 'Executive Summary', company.name || 'Empresa');
  doc.setFontSize(11);
  doc.setTextColor(DARK);
  const summaryLines = doc.splitTextToSize(
    `${company.name || 'La empresa'} obtiene un Operations Score de ${result.globalScore}/100, ` +
      `situándose en el nivel de madurez "${result.maturityLevel}". El diagnóstico se ha calculado con un ` +
      `nivel de confianza ${result.confidenceLabel.toLowerCase()} (${result.confidenceScore}/100), en base a las ` +
      `respuestas del cuestionario operativo${Object.keys(result).length ? ' y los datos aportados' : ''}.`,
    170
  );
  doc.text(summaryLines, MARGIN, 48);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos de la empresa', MARGIN, 78);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const infoRows = [
    ['Sector', company.sector || '—'],
    ['Empleados', company.employees],
    ['País', company.country],
    ['Almacén', company.hasWarehouse ? 'Sí' : 'No'],
    ['ERP', company.usesERP ? 'Sí' : 'No'],
  ];
  let y = 86;
  for (const [label, value] of infoRows) {
    doc.setTextColor(GRAY);
    doc.text(label, MARGIN, y);
    doc.setTextColor(DARK);
    doc.text(value, MARGIN + 40, y);
    y += 7;
  }

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Ahorro potencial estimado', MARGIN, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(BRAND);
  doc.text(`${formatEUR(result.savings.totalEstimated)} / año`, MARGIN, y + 22);
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  doc.text(doc.splitTextToSize('Estimación orientativa basada en benchmarks sectoriales.', 170), MARGIN, y + 29);
  addFooter(doc, page);

  // ---------- Página 2: Score ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Operations Score', company.name || 'Empresa');
  doc.setFontSize(48);
  doc.setTextColor(BRAND);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.globalScore}`, MARGIN, 70);
  doc.setFontSize(14);
  doc.setTextColor(GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('/ 100', MARGIN + 38, 70);
  doc.setFontSize(13);
  doc.setTextColor(DARK);
  doc.text(`Nivel de madurez: ${result.maturityLevel}`, MARGIN, 82);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Score por categoría', MARGIN, 100);
  doc.setFont('helvetica', 'normal');
  y = 110;
  for (const cs of result.categoryScores) {
    doc.setFontSize(10);
    doc.setTextColor(DARK);
    doc.text(CATEGORY_LABELS[cs.category], MARGIN, y);
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(MARGIN + 55, y - 4, 100, 4, 2, 2, 'F');
    doc.setFillColor(BRAND);
    doc.roundedRect(MARGIN + 55, y - 4, Math.max(2, cs.score), 4, 2, 2, 'F');
    doc.text(`${cs.score}`, MARGIN + 160, y);
    y += 12;
  }
  addFooter(doc, page);

  // ---------- Página 3: Radar (descripción textual, sin canvas para evitar dependencias de render) ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Radar de Madurez Operativa', company.name || 'Empresa');
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  doc.text(
    doc.splitTextToSize(
      'El siguiente radar resume visualmente el desempeño relativo de cada categoría operativa evaluada. ' +
        'Las categorías más cercanas al centro representan mayores oportunidades de mejora.',
      170
    ),
    MARGIN,
    45
  );
  let barStartY = 65;
  if (radarImage) {
    const imgProps = doc.getImageProperties(radarImage);
    const imgW = 95;
    const imgH = (imgProps.height / imgProps.width) * imgW;
    doc.addImage(radarImage, 'PNG', (PAGE_W - imgW) / 2, 60, imgW, imgH);
    barStartY = 60 + imgH + 14;
  }
  y = barStartY;
  const maxBar = 120;
  for (const cs of result.categoryScores) {
    doc.setFontSize(11);
    doc.setTextColor(DARK);
    doc.text(CATEGORY_LABELS[cs.category], MARGIN, y);
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(MARGIN, y + 3, maxBar, 6, 2, 2, 'F');
    doc.setFillColor(BRAND);
    doc.roundedRect(MARGIN, y + 3, (cs.score / 100) * maxBar, 6, 2, 2, 'F');
    doc.setFontSize(10);
    doc.text(`${cs.score}/100`, MARGIN + maxBar + 6, y + 8);
    y += 18;
  }
  addFooter(doc, page);

  // ---------- Página 4: Riesgos ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Riesgos Detectados', company.name || 'Empresa');
  y = 45;
  if (result.risks.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(GRAY);
    doc.text('No se detectaron riesgos significativos con la información disponible.', MARGIN, y);
  } else {
    result.risks.forEach((risk, i) => {
      doc.setFontSize(11);
      doc.setTextColor(DARK);
      const severityColor = risk.severity === 'high' ? '#f2555a' : risk.severity === 'medium' ? '#f5b83d' : GRAY;
      doc.setFillColor(severityColor);
      doc.circle(MARGIN + 2, y - 1.5, 1.5, 'F');
      const lines = doc.splitTextToSize(`${i + 1}. ${risk.title}`, 165);
      doc.text(lines, MARGIN + 8, y);
      y += lines.length * 6 + 6;
    });
  }
  addFooter(doc, page);

  // ---------- Página 5: Quick Wins ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Top 5 Quick Wins', company.name || 'Empresa');
  y = 45;
  result.quickWins.forEach((win, i) => {
    doc.setFontSize(12);
    doc.setTextColor(BRAND);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DARK);
    const lines = doc.splitTextToSize(win.title, 160);
    doc.text(lines, MARGIN + 8, y);
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text(`Impacto: ${win.impact} · Esfuerzo: ${win.effort}`, MARGIN + 8, y + lines.length * 6 + 4);
    y += lines.length * 6 + 14;
  });
  addFooter(doc, page);

  // ---------- Página 6: Savings ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Ahorro Potencial', company.name || 'Empresa');
  doc.setFontSize(28);
  doc.setTextColor(BRAND);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatEUR(result.savings.totalEstimated)} / año`, MARGIN, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(DARK);
  doc.text('Desglose de la estimación:', MARGIN, 72);
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  const breakdown = [
    ['Base según score', formatEUR(result.savings.baseAmount)],
    ['Multiplicador por tamaño de empresa', `x${result.savings.employeeMultiplier}`],
    ['Multiplicador por existencia de almacén', `x${result.savings.warehouseMultiplier}`],
    ['Multiplicador por madurez operativa', `x${result.savings.maturityMultiplier}`],
  ];
  y = 82;
  for (const [label, value] of breakdown) {
    doc.text(label, MARGIN, y);
    doc.text(value, MARGIN + 130, y);
    y += 8;
  }
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  doc.text(
    doc.splitTextToSize(
      'Nota: esta cifra es una estimación orientativa basada en benchmarks sectoriales generales. No sustituye ' +
        'una auditoría financiera detallada ni constituye un compromiso de ahorro garantizado.',
      170
    ),
    MARGIN,
    y + 14
  );
  addFooter(doc, page);

  // ---------- Página 7: Roadmap ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Roadmap de Implementación', company.name || 'Empresa');
  y = 45;
  const roadmapSections: [string, { title: string; description: string }[]][] = [
    ['30 días', result.roadmap.days30],
    ['90 días', result.roadmap.days90],
    ['180 días', result.roadmap.days180],
  ];
  for (const [label, items] of roadmapSections) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(BRAND);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    if (items.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(GRAY);
      doc.text('Sin acciones específicas en este horizonte.', MARGIN + 4, y);
      y += 8;
    } else {
      for (const item of items) {
        doc.setFontSize(10);
        doc.setTextColor(DARK);
        const lines = doc.splitTextToSize(`• ${item.title}`, 165);
        doc.text(lines, MARGIN + 4, y);
        y += lines.length * 5 + 6;
      }
    }
    y += 4;
  }
  addFooter(doc, page);

  // ---------- Página 8: Methodology ----------
  doc.addPage();
  page += 1;
  addHeader(doc, 'Metodología', company.name || 'Empresa');
  doc.setFontSize(10);
  doc.setTextColor(DARK);
  const methodology = [
    'El Operations Score evalúa 6 categorías operativas (Procesos, KPIs, Inventario, Tecnología, Gestión ' +
      'Operativa y Mejora Continua) mediante 15 preguntas ponderadas, respondidas en una escala de 0 a 5.',
    'Cada categoría se pondera según su impacto relativo en la madurez operativa global: Procesos (20%), ' +
      'KPIs (20%), Inventario (20%), Tecnología (15%), Gestión Operativa (15%) y Mejora Continua (10%).',
    'El Confidence Score refleja cuántos datos operativos reales (archivos CSV de inventario, pedidos e ' +
      'incidencias) se aportaron y su calidad, penalizando valores faltantes e inconsistencias.',
    'El ahorro potencial es una estimación orientativa basada en benchmarks por score, ajustada por tamaño ' +
      'de empresa, existencia de almacén y nivel de madurez. No constituye una auditoría financiera.',
    'Todo el análisis se ejecuta localmente en el navegador: ningún dato de la empresa se envía a servidores ' +
      'externos.',
  ];
  y = 45;
  for (const paragraph of methodology) {
    const lines = doc.splitTextToSize(paragraph, 170);
    doc.text(lines, MARGIN, y);
    y += lines.length * 6 + 8;
  }
  addFooter(doc, page);

  doc.save(`operations-score-${(company.name || 'reporte').toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
