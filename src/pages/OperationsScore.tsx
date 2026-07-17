import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CompanyForm } from '../components/forms/CompanyForm';
import { QuestionCard } from '../components/forms/QuestionCard';
import { CSVUploader } from '../components/forms/CSVUploader';
import { QUESTIONS } from '../data/questions';
import { useOperationsStore } from '../store/useOperationsStore';
import { analyzeIncidentsCSV, analyzeInventoryCSV, analyzeOrdersCSV } from '../services/csvAnalysis';

const STEP_ORDER = ['company', 'questions', 'csv'] as const;

export function OperationsScore() {
  const navigate = useNavigate();
  const { company, setCompany, answers, setAnswer, csvResults, setCSVResult, computeScore } =
    useOperationsStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const step = STEP_ORDER[stepIndex];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const currentQuestion = QUESTIONS[questionIndex];

  const canLeaveCompany = company.name.trim().length > 0 && company.sector.trim().length > 0;

  const goNext = () => {
    if (step === 'company') {
      if (!canLeaveCompany) return;
      setStepIndex(1);
      return;
    }
    if (step === 'questions') {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setStepIndex(2);
      }
      return;
    }
    if (step === 'csv') {
      computeScore();
      navigate('/operations-score/results');
    }
  };

  const goBack = () => {
    if (step === 'questions' && questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      if (step === 'csv') setQuestionIndex(QUESTIONS.length - 1);
    }
  };

  const nextDisabled =
    (step === 'company' && !canLeaveCompany) ||
    (step === 'questions' && answers[currentQuestion.id] === undefined);

  return (
    <AppLayout title="Operations Score">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[var(--color-brand-500)]" />
            <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Operational Health Check
            </span>
          </div>
          <ProgressBar
            current={
              step === 'company' ? 0 : step === 'questions' ? questionIndex + 1 : QUESTIONS.length + 1
            }
            total={QUESTIONS.length + 2}
            label={
              step === 'company'
                ? 'Paso 1 de 4 · Datos de la empresa'
                : step === 'questions'
                ? `Paso 2 de 4 · Pregunta ${questionIndex + 1} de ${QUESTIONS.length}`
                : 'Paso 3 de 4 · Datos operativos (opcional)'
            }
          />
        </div>

        {step === 'company' && <CompanyForm company={company} onChange={setCompany} />}

        {step === 'questions' && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) => setAnswer(currentQuestion.id, value)}
          />
        )}

        {step === 'csv' && (
          <div className="space-y-4 fade-in">
            <div className="card p-5 bg-[var(--color-brand-500)]/5 border-[var(--color-brand-500)]/20">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Este paso es <strong className="text-[var(--color-text-primary)]">opcional</strong>. Subir tus
                datos reales aumenta la precisión del diagnóstico (Confidence Score), pero puedes continuar sin
                ellos.
              </p>
            </div>
            <CSVUploader
              label="inventario.csv"
              description="SKU, stock, última venta, valor — para ABC analysis y dead stock."
              fileName={csvResults.inventario?.fileName}
              onFile={async (file) => setCSVResult('inventario', await analyzeInventoryCSV(file))}
            />
            <CSVUploader
              label="pedidos.csv"
              description="Fecha, pedido, cliente — para tendencias y concentración."
              fileName={csvResults.pedidos?.fileName}
              onFile={async (file) => setCSVResult('pedidos', await analyzeOrdersCSV(file))}
            />
            <CSVUploader
              label="incidencias.csv"
              description="Tipo, severidad, fecha — para análisis de Pareto."
              fileName={csvResults.incidencias?.fileName}
              onFile={async (file) => setCSVResult('incidencias', await analyzeIncidentsCSV(file))}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={goBack}
            disabled={stepIndex === 0 && questionIndex === 0}
            className="btn-secondary flex items-center gap-2 px-5 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Atrás
          </button>
          <button
            onClick={goNext}
            disabled={nextDisabled}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 'csv' ? 'Ver mi Operations Score' : 'Continuar'}
            <ArrowRight size={16} />
          </button>
        </div>

        {step === 'questions' && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
            {answeredCount} de {QUESTIONS.length} preguntas respondidas
          </p>
        )}
      </div>
    </AppLayout>
  );
}
