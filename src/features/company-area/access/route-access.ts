export function canAccessEvidenceRoute({ hasEvidenceAccess }: { hasEvidenceAccess: boolean; hasPreDiagnosticAccess?: boolean }) {
  return hasEvidenceAccess;
}
