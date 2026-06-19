"use client";

import { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { CircleCheckBig, Loader2, ShieldCheck } from "lucide-react";
import { diagnosticService } from "@/features/company-area/services/diagnostic.service";
import { SectionHeading } from "../../components/section-heading";
import {
  EVIDENCE_ALLOWED_EXTENSIONS,
  EVIDENCE_STORAGE_BUCKET,
  EVIDENCE_UPLOAD_GROUPS,
  formatEvidenceFileSize,
  uploadEvidenceFiles,
  type EvidenceGroupCode,
  type StagedEvidenceFile,
  type UploadedEvidenceFile,
} from "../../../services/evidence-upload.service";
import { EvidenceGroupCard } from "./evidence-group-card";

type EvidenceGroup = Record<EvidenceGroupCode, StagedEvidenceFile[]>;
type UploadedGroup = Record<EvidenceGroupCode, UploadedEvidenceFile[]>;
type LoadingGroup = Record<EvidenceGroupCode, boolean>;

function createEmptyGroupMap<T>(factory: () => T): Record<EvidenceGroupCode, T> {
  return EVIDENCE_UPLOAD_GROUPS.reduce((acc, group) => {
    acc[group.code] = factory();
    return acc;
  }, {} as Record<EvidenceGroupCode, T>);
}

function mapEvidenceCategoryToGroupCode(category?: string | null): EvidenceGroupCode | null {
  switch (category) {
    case "REGULARIZATION":
      return "A";
    case "CONSERVATION":
      return "B";
    case "NATURAL_RESOURCES":
      return "C";
    case "SUSTAINABLE_PRODUCTION":
      return "D";
    case "PEOPLE_AND_SOCIAL":
      return "E";
    case "GOVERNANCE":
      return "F";
    case "TRACEABILITY_AND_QUALITY":
      return "G";
    case "PHOTOGRAPHIC":
      return "H";
    default:
      return null;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "Data não informada";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildFileId(groupCode: EvidenceGroupCode, fileName: string, index: number) {
  return `${groupCode}-${Date.now()}-${index}-${fileName}`;
}

export function EvidencesView() {
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [draftsByGroup, setDraftsByGroup] = useState<EvidenceGroup>(() => createEmptyGroupMap(() => []));
  const [persistedByGroup, setPersistedByGroup] = useState<UploadedGroup>(() => createEmptyGroupMap(() => []));
  const [sendingByGroup, setSendingByGroup] = useState<LoadingGroup>(() => createEmptyGroupMap(() => false));
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentDiagnostic() {
      try {
        const token = getCookie("inoveesg_token") as string;
        if (!token) {
          setIsLoading(false);
          return;
        }

        const result = await diagnosticService.getCurrentDiagnostic(token);
        if (!result.hasDiagnostic || !result.diagnostic) {
          setIsLoading(false);
          return;
        }

        setDiagnosticId(result.diagnostic.id);

        const nextPersisted = createEmptyGroupMap<UploadedEvidenceFile[]>(() => []);
        for (const evidence of result.diagnostic.evidences ?? []) {
          const groupCode = mapEvidenceCategoryToGroupCode(evidence.evidenceCategory ?? null);
          if (!groupCode) continue;

          nextPersisted[groupCode].push({
            id: evidence.id,
            fileName: evidence.fileName ?? "arquivo",
            filePath: evidence.filePath ?? "",
            fileUrl: evidence.fileUrl ?? null,
            storageBucket: evidence.storageBucket ?? EVIDENCE_STORAGE_BUCKET,
            evidenceCategory: evidence.evidenceCategory ?? "PHOTOGRAPHIC",
            uploadedAt: evidence.uploadedAt ?? new Date().toISOString(),
            fileSizeBytes: evidence.fileSizeBytes ?? 0,
            mimeType: evidence.mimeType ?? "application/octet-stream",
            uploadStatus: evidence.uploadStatus ?? "COMPLETED",
            verificationStatus: evidence.verificationStatus,
          });
        }

        setPersistedByGroup(nextPersisted);
      } catch (error) {
        console.error("[evidences.view.loadCurrentDiagnostic] Failed", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentDiagnostic();
  }, []);

  const totalDraftFiles = useMemo(
    () => Object.values(draftsByGroup).reduce((acc, files) => acc + files.length, 0),
    [draftsByGroup]
  );

  const totalPersistedFiles = useMemo(
    () => Object.values(persistedByGroup).reduce((acc, files) => acc + files.length, 0),
    [persistedByGroup]
  );

  const totalCompletedGroups = useMemo(
    () => Object.values(persistedByGroup).filter((files) => files.length > 0).length,
    [persistedByGroup]
  );

  const pendingGroups = EVIDENCE_UPLOAD_GROUPS.length - totalCompletedGroups;

  const handleAddFiles = (groupCode: EvidenceGroupCode, documentType: string, files: FileList) => {
    const accepted = Array.from(files).filter((file) =>
      EVIDENCE_ALLOWED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension))
    );

    if (accepted.length === 0) {
      setStatusMessage("Escolha arquivos PDF, imagens ou planilhas.");
      return;
    }

    setDraftsByGroup((current) => {
      const nextFiles = accepted.map((file, index) => ({
        id: buildFileId(groupCode, file.name, index),
        name: file.name,
        documentType,
        sizeBytes: file.size,
        sizeLabel: formatEvidenceFileSize(file.size),
        mimeType: file.type || "application/octet-stream",
        uploadedAt: "Agora",
        rawFile: file,
      }));

      return {
        ...current,
        [groupCode]: [...current[groupCode], ...nextFiles],
      };
    });

    setStatusMessage(`${accepted.length} arquivo(s) adicionados para ${documentType}.`);
  };

  const handleRemoveFile = (groupCode: EvidenceGroupCode, fileId: string) => {
    setDraftsByGroup((current) => ({
      ...current,
      [groupCode]: current[groupCode].filter((file) => file.id !== fileId),
    }));
  };

  const handleClearGroup = (groupCode: EvidenceGroupCode) => {
    setDraftsByGroup((current) => ({
      ...current,
      [groupCode]: [],
    }));
  };

  const handleSendGroup = async (groupCode: EvidenceGroupCode) => {
    if (sendingByGroup[groupCode]) {
      return;
    }

    const token = getCookie("inoveesg_token") as string;
    if (!token) {
      setStatusMessage("Você precisa estar autenticado para enviar evidências.");
      return;
    }

    if (!diagnosticId) {
      setStatusMessage("Não foi possível localizar o diagnóstico atual.");
      return;
    }

    const draftFiles = draftsByGroup[groupCode];
    const rawFiles = draftFiles.map((file) => file.rawFile).filter(Boolean) as File[];
    if (rawFiles.length === 0) {
      setStatusMessage("Adicione arquivos antes de enviar.");
      return;
    }

    setSendingByGroup((current) => ({ ...current, [groupCode]: true }));
    const sendingLabel = draftFiles.map((file) => file.documentType).join(", ");
    setStatusMessage(`Enviando ${draftFiles.length} documento(s): ${sendingLabel}.`);

    try {
      const result = await uploadEvidenceFiles(token, diagnosticId, groupCode, rawFiles);

      setPersistedByGroup((current) => ({
        ...current,
        [groupCode]: [
          ...current[groupCode],
          ...(result.evidences ?? []).map((evidence) => ({
            id: evidence.id,
            fileName: evidence.fileName,
            filePath: evidence.filePath,
            fileUrl: evidence.fileUrl ?? null,
            storageBucket: evidence.storageBucket,
            evidenceCategory: evidence.evidenceCategory,
            uploadedAt: evidence.uploadedAt,
            fileSizeBytes: evidence.fileSizeBytes,
            mimeType: evidence.mimeType,
            uploadStatus: evidence.uploadStatus,
            verificationStatus: evidence.verificationStatus,
          })),
        ],
      }));

      setDraftsByGroup((current) => ({ ...current, [groupCode]: [] }));
      setStatusMessage(`${result.uploadedCount} arquivo(s) enviados em ${formatDateTime(result.uploadedAt)}.`);
    } catch (error) {
      console.error("[evidences.view.handleSendGroup] Upload failed", error);
      setStatusMessage(error instanceof Error ? error.message : "Falha ao enviar os arquivos.");
    } finally {
      setSendingByGroup((current) => ({ ...current, [groupCode]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Documentação"
        title="Evidências complementares"
        description="Anexe documentos, imagens e planilhas que complementam o diagnóstico. Cada categoria pode ser enviada uma vez."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Arquivos enviados</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalPersistedFiles}</p>
          <p className="mt-1 text-sm text-slate-600">Documentos já salvos com data e hora.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Categorias concluídas</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalCompletedGroups}</p>
          <p className="mt-1 text-sm text-slate-600">Grupos finalizados e travados.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Arquivos em rascunho</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalDraftFiles}</p>
          <p className="mt-1 text-sm text-slate-600">Prontos para envio.</p>
        </article>
      </section>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="grid gap-4">
            {EVIDENCE_UPLOAD_GROUPS.map((group) => {
              const draftFiles = draftsByGroup[group.code];
              const persistedFiles = persistedByGroup[group.code];
              return (
                <EvidenceGroupCard
                  key={group.code}
                  group={group}
                  draftFiles={draftFiles}
                  persistedFiles={persistedFiles}
                  onAddFiles={handleAddFiles}
                  onRemoveFile={handleRemoveFile}
                  onClearGroup={handleClearGroup}
                  onSendGroup={handleSendGroup}
                  sending={sendingByGroup[group.code]}
                />
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Como funciona</p>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
              Escolha o tipo, anexe e envie
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>• Cada grupo tem tipos de documento clicáveis.</li>
              <li>• Você pode anexar vários documentos antes de enviar.</li>
              <li>• Os arquivos enviados ficam só para consulta, com data e hora.</li>
          </ul>
        </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Formatos aceitos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EVIDENCE_ALLOWED_EXTENSIONS.map((extension) => (
                <span
                  key={extension}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {extension.replace(".", "").toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4 text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Resumo</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Categorias com envio</span>
                <span className="font-semibold text-slate-900">{totalCompletedGroups}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Categorias em aberto</span>
                <span className="font-semibold text-slate-900">{pendingGroups}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Arquivos enviados</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            O que foi enviado fica salvo para consulta
          </h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EVIDENCE_UPLOAD_GROUPS.filter((group) => persistedByGroup[group.code].length > 0).map((group) => (
            <article key={group.code} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{group.title}</p>
              <p className="mt-2 text-sm text-slate-600">{persistedByGroup[group.code].length} arquivo(s) enviados.</p>
              <div className="mt-3 space-y-2">
                {persistedByGroup[group.code].map((file) => (
                  <div key={file.id} className="rounded-xl border border-emerald-200 bg-white px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{file.fileName}</p>
                    <p className="text-xs text-slate-500">Enviado em {formatDateTime(file.uploadedAt)}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
