import test from "node:test";
import assert from "node:assert/strict";
import { canAccessEvidenceRoute } from "./route-access";

test("evidence route requires evidence access", () => {
  assert.equal(canAccessEvidenceRoute({ hasEvidenceAccess: false, hasPreDiagnosticAccess: true }), false);
  assert.equal(canAccessEvidenceRoute({ hasEvidenceAccess: true, hasPreDiagnosticAccess: false }), true);
});
