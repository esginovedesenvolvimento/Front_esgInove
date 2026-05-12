import { diagnosticQuestions, diagnosticSections } from "../models/mock-data";

export function getDiagnosticOverviewViewModel() {
  const answered = diagnosticSections.reduce((acc, section) => acc + section.answered, 0);
  const total = diagnosticSections.reduce((acc, section) => acc + section.total, 0);

  return {
    sections: diagnosticSections,
    progress: total > 0 ? Math.round((answered / total) * 100) : 0,
    answered,
    total,
  };
}

export function getDiagnosticRunViewModel() {
  return {
    questions: diagnosticQuestions,
    total: diagnosticQuestions.length,
    answered: diagnosticQuestions.filter((question) => question.answer.trim().length > 0).length,
  };
}

export function getDiagnosticReviewViewModel() {
  const missingAnswers = diagnosticQuestions.filter((question) => question.answer.trim().length === 0);
  const missingEvidence = diagnosticQuestions.filter(
    (question) => question.answer.trim().length > 0 && !question.hasEvidence
  );

  return {
    totalQuestions: diagnosticQuestions.length,
    missingAnswers,
    missingEvidence,
  };
}
