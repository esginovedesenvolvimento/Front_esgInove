export type EvidenceGroupCode = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface EvidenceUploadGroup {
  code: EvidenceGroupCode;
  title: string;
  description: string;
  examples: string;
  badge: string;
  documentTypes: string[];
  tone: "emerald" | "amber" | "sky" | "violet" | "slate";
}

export interface StagedEvidenceFile {
  id: string;
  name: string;
  documentType: string;
  sizeBytes: number;
  sizeLabel: string;
  mimeType: string;
  uploadedAt: string;
  base64Data?: string;
  rawFile?: File;
}

export interface UploadedEvidenceFile {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl?: string | null;
  storageBucket: string;
  evidenceCategory: string;
  uploadedAt: string;
  fileSizeBytes: number;
  mimeType: string;
  uploadStatus: "PENDING" | "UPLOADING" | "COMPLETED" | "FAILED";
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

export const EVIDENCE_STORAGE_BUCKET = "diagnostic-evidences";

export const EVIDENCE_ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"] as const;

export const EVIDENCE_UPLOAD_GROUPS: EvidenceUploadGroup[] = [
  {
    code: "A",
    title: "Regularização da propriedade e da atividade",
    description: "Documentos que comprovam licenças, registros e autorizações da operação.",
    examples: "CAR, CCIR, CAF, licenças e outorgas.",
    badge: "Regularização",
    documentTypes: ["CAR", "CCIR", "CAF", "Licenças", "Outorgas", "Registros da atividade"],
    tone: "emerald",
  },
  {
    code: "B",
    title: "Conservação ambiental",
    description: "Evidências de preservação, recuperação e proteção de áreas sensíveis.",
    examples: "APP, Reserva Legal, nascentes, biodiversidade.",
    badge: "Conservação",
    documentTypes: ["APP", "Reserva Legal", "Nascentes", "Recuperação ambiental", "Biodiversidade"],
    tone: "sky",
  },
  {
    code: "C",
    title: "Gestão dos recursos naturais",
    description: "Controle de uso de solo, água, irrigação, energia e eficiência produtiva.",
    examples: "Consumo, manejo de água, energia e indicadores.",
    badge: "Recursos",
    documentTypes: ["Solo", "Água", "Irrigação", "Energia", "Eficiência produtiva"],
    tone: "amber",
  },
  {
    code: "D",
    title: "Produção sustentável e bioeconomia",
    description: "Práticas ligadas a inovação sustentável, circularidade e bioinsumos.",
    examples: "Bioinsumos, compostagem, regeneração, economia circular.",
    badge: "Bioeconomia",
    documentTypes: ["Bioinsumos", "Compostagem", "Economia circular", "Agricultura regenerativa", "Inovação sustentável"],
    tone: "violet",
  },
  {
    code: "E",
    title: "Pessoas e desenvolvimento social",
    description: "Treinamentos, segurança do trabalho e ações sociais documentadas.",
    examples: "SST, capacitações, iniciativas comunitárias.",
    badge: "Social",
    documentTypes: ["Treinamentos", "Segurança do trabalho", "Ações sociais", "Desenvolvimento comunitário"],
    tone: "emerald",
  },
  {
    code: "F",
    title: "Gestão e governança",
    description: "Políticas internas, organograma, planejamento e certificações.",
    examples: "Código de conduta, políticas e certificados.",
    badge: "Governança",
    documentTypes: ["Organograma", "Planejamento estratégico", "Políticas internas", "Certificações"],
    tone: "slate",
  },
  {
    code: "G",
    title: "Rastreabilidade e qualidade",
    description: "Rastreio de lotes, qualidade, fornecedores e origem dos insumos.",
    examples: "Controle de lotes, cadeia de fornecedores, certificações.",
    badge: "Rastreio",
    documentTypes: ["Controle de lotes", "Produção", "Fornecedores", "Qualidade", "Certificações de origem"],
    tone: "amber",
  },
  {
    code: "H",
    title: "Evidências fotográficas",
    description: "Imagens de áreas produtivas, estruturas e boas práticas implementadas.",
    examples: "Fotos de campo, estruturas, equipamentos e áreas preservadas.",
    badge: "Fotos",
    documentTypes: ["Áreas produtivas", "Estruturas", "Áreas preservadas", "Equipamentos", "Boas práticas"],
    tone: "sky",
  },
];

export function formatEvidenceFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401 && typeof window !== "undefined") {
    document.cookie = "inoveesg_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/?auth=true";
    return new Promise(() => {});
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.includes(",") ? result.split(",").pop() ?? "" : result);
    };
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export async function uploadEvidenceFiles(token: string, diagnosticId: string, groupCode: EvidenceGroupCode, files: File[]) {
  const payload = {
    groupCode,
    files: await Promise.all(
      files.map(async (file) => ({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        base64Data: await fileToBase64(file),
        sizeBytes: file.size,
      }))
    ),
  };

  return request<{
    success: boolean;
    diagnosticId: string;
    groupCode: EvidenceGroupCode;
    uploadedCount: number;
    uploadedAt: string;
    bucketName: string;
    evidences: UploadedEvidenceFile[];
  }>(`/diagnostic/${diagnosticId}/evidences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
