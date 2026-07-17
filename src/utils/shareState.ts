import { QUESTIONS } from '../data/questions';
import type { Answers, CompanyInfo } from '../types';

// ============================================================================
// Codifica el estado mínimo necesario para reconstruir un diagnóstico
// completo (empresa + respuestas) en un parámetro de URL, sin backend ni
// almacenamiento externo. El resultado se recalcula siempre en destino con
// computeScoreResult, por lo que este payload es deliberadamente pequeño:
// solo 15 números (0-5) + 4 campos de empresa.
// ============================================================================

interface SharePayload {
  c: {
    n: string; // name
    s: string; // sector
    e: string; // employees
    w: boolean; // hasWarehouse
    p: boolean; // usesERP
    x: boolean; // usesExcel
    co: string; // country
  };
  a: number[]; // answers, en el mismo orden que QUESTIONS
}

export function encodeShareState(company: CompanyInfo, answers: Answers): string {
  const payload: SharePayload = {
    c: {
      n: company.name,
      s: company.sector,
      e: company.employees,
      w: company.hasWarehouse,
      p: company.usesERP,
      x: company.usesExcel,
      co: company.country,
    },
    a: QUESTIONS.map((q) => answers[q.id] ?? 0),
  };

  const json = JSON.stringify(payload);
  // btoa no soporta UTF-8 directamente: pasamos por encodeURIComponent primero.
  const base64 = btoa(unescape(encodeURIComponent(json)));
  // URL-safe base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShareState(encoded: string): { company: CompanyInfo; answers: Answers } | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(base64)));
    const payload = JSON.parse(json) as SharePayload;

    const company: CompanyInfo = {
      name: payload.c.n,
      sector: payload.c.s,
      employees: payload.c.e,
      hasWarehouse: payload.c.w,
      usesERP: payload.c.p,
      usesExcel: payload.c.x,
      country: payload.c.co,
    };

    const answers: Answers = {};
    QUESTIONS.forEach((q, i) => {
      const value = payload.a[i];
      if (typeof value === 'number' && value >= 0 && value <= 5) {
        answers[q.id] = value as Answers[string];
      }
    });

    return { company, answers };
  } catch {
    return null;
  }
}

export function buildShareUrl(company: CompanyInfo, answers: Answers): string {
  const encoded = encodeShareState(company, answers);
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/share?d=${encoded}`;
}
