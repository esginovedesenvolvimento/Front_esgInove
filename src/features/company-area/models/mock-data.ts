import {
  type CompanyProfile,
  type DashboardKpi,
  type DiagnosticQuestion,
  type DiagnosticSection,
  type EvidenceItem,
  type ImprovementAction,
  type InviteBalance,
  type InvitePackage,
  type ReportSummary,
  type ScoreAxis,
  type Supplier,
  type WorkspaceStage,
  type WorkspaceTask,
} from "./types";

export const companyProfile: CompanyProfile = {
  name: "Inove Alimentos S.A.",
  sector: "Indústria de alimentos",
  cycle: "2026.1",
  plan: "Growth ESG",
  diagnosticStatus: "contratado",
  roles: ["avaliada", "assinante"],
};

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "diag-progress",
    label: "Progresso do diagnóstico",
    value: "68%",
    detail: "34 de 50 respostas concluídas",
  },
  {
    id: "evidence-pending",
    label: "Evidências pendentes",
    value: "7",
    detail: "Itens sem documento anexado",
  },
  {
    id: "supplier-response",
    label: "Fornecedores respondidos",
    value: "11/18",
    detail: "61% da base convidada",
  },
  {
    id: "current-score",
    label: "Score ESG parcial",
    value: "72",
    detail: "Atualizado com base nas respostas atuais",
  },
];

export const diagnosticSections: DiagnosticSection[] = [
  {
    id: "environmental-governance",
    title: "Gestão ambiental e emissões",
    axis: "E",
    status: "em_andamento",
    answered: 8,
    total: 12,
    updatedAt: "15 abr 2026",
  },
  {
    id: "social-people",
    title: "Capital humano e impacto social",
    axis: "S",
    status: "concluido",
    answered: 14,
    total: 14,
    updatedAt: "13 abr 2026",
  },
  {
    id: "governance-compliance",
    title: "Governança, ética e conformidade",
    axis: "G",
    status: "nao_iniciado",
    answered: 0,
    total: 10,
    updatedAt: "-",
  },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "q1",
    sectionId: "environmental-governance",
    axis: "E",
    prompt: "A empresa monitora consumo energético mensal por unidade?",
    hint: "Informe se existe medição sistemática e periodicidade.",
    answer: "Monitora mensalmente com relatório consolidado por unidade.",
    hasEvidence: true,
    options: [
      "Não monitora o consumo energético.",
      "Monitora esporadicamente sem registro formal.",
      "Monitora mensalmente, mas não consolida os dados.",
      "Monitora mensalmente com relatório consolidado por unidade.",
      "Monitora em tempo real com metas de redução atreladas."
    ]
  },
  {
    id: "q2",
    sectionId: "environmental-governance",
    axis: "E",
    prompt: "Existe meta formal de redução de emissões para os próximos 24 meses?",
    hint: "Descreva meta, baseline e indicador de acompanhamento.",
    answer: "Meta em validação pelo comitê, ainda sem baseline fechado.",
    hasEvidence: false,
    options: [
      "Não possui metas de redução de emissões.",
      "Possui intenção de reduzir, mas sem metas formais.",
      "Meta em validação pelo comitê, ainda sem baseline fechado.",
      "Possui meta formal aprovada, mas sem acompanhamento público.",
      "Possui meta formal e publica relatórios de acompanhamento."
    ]
  },
  {
    id: "q3",
    sectionId: "social-people",
    axis: "S",
    prompt: "A empresa possui política ativa de segurança e saúde ocupacional?",
    hint: "Cite treinamentos, indicadores e responsáveis.",
    answer: "Política aprovada e treinamentos trimestrais implementados.",
    hasEvidence: true,
    options: [
      "Não possui política de segurança e saúde.",
      "Possui apenas as normas básicas obrigatórias por lei.",
      "Possui política interna, mas sem treinamentos regulares.",
      "Política aprovada e treinamentos trimestrais implementados.",
      "Política integrada com certificação internacional (ex: ISO 45001)."
    ]
  },
  {
    id: "q4",
    sectionId: "governance-compliance",
    axis: "G",
    prompt: "Há canal de denúncias com tratamento formal e SLA definido?",
    hint: "Indique governança de tratamento e monitoramento.",
    answer: "",
    hasEvidence: false,
    options: [
      "Não possui canal de denúncias.",
      "Possui canal (ex: e-mail), mas sem processo formal de apuração.",
      "Possui canal estruturado, mas sem SLA definido.",
      "Possui canal com tratamento formal e SLA definido.",
      "Possui canal independente (terceirizado) com auditoria dos casos."
    ]
  },
];

export const evidences: EvidenceItem[] = [
  {
    id: "ev-1",
    questionId: "q1",
    title: "Relatório de consumo energético",
    fileName: "energia_q1_2026.pdf",
    axis: "E",
    uploadedAt: "15 abr 2026",
    owner: "Ana Pires",
    status: "validado",
  },
  {
    id: "ev-2",
    questionId: "q3",
    title: "Política de SST",
    fileName: "politica_sst_v3.pdf",
    axis: "S",
    uploadedAt: "13 abr 2026",
    owner: "Carlos Mota",
    status: "validado",
  },
  {
    id: "ev-3",
    questionId: "q2",
    title: "Plano preliminar de emissões",
    fileName: "plano_emissoes_draft.docx",
    axis: "E",
    uploadedAt: "14 abr 2026",
    owner: "Ana Pires",
    status: "pendente",
  },
];

export const scoreByAxis: ScoreAxis[] = [
  {
    axis: "E",
    score: 69,
    interpretation: "Estrutura inicial sólida, faltam metas formais de longo prazo.",
  },
  {
    axis: "S",
    score: 81,
    interpretation: "Boas práticas já consolidadas em saúde e desenvolvimento humano.",
  },
  {
    axis: "G",
    score: 58,
    interpretation: "Governança em estágio inicial, com oportunidades em compliance.",
  },
];

export const priorityActions: ImprovementAction[] = [
  {
    id: "a1",
    title: "Definir meta de redução de emissões com baseline aprovado",
    owner: "Operações + Sustentabilidade",
    priority: "alta",
    dueDate: "30 mai 2026",
  },
  {
    id: "a2",
    title: "Formalizar SLA e comitê de tratamento para canal de denúncias",
    owner: "Jurídico e Compliance",
    priority: "alta",
    dueDate: "20 jun 2026",
  },
  {
    id: "a3",
    title: "Padronizar evidências por pergunta para auditoria futura",
    owner: "PMO ESG",
    priority: "media",
    dueDate: "10 jun 2026",
  },
];

export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    companyName: "EcoPack Embalagens Ltda",
    contactEmail: "contato@ecopack.com.br",
    status: "respondido",
    progress: 100,
    invitedAt: "02 abr 2026",
    lastUpdate: "11 abr 2026",
  },
  {
    id: "sup-2",
    companyName: "TransLog Verde",
    contactEmail: "esg@translogverde.com",
    status: "em_andamento",
    progress: 64,
    invitedAt: "05 abr 2026",
    lastUpdate: "14 abr 2026",
  },
  {
    id: "sup-3",
    companyName: "BioInsumos Nordeste",
    contactEmail: "time@bioinsumos.com",
    status: "pendente",
    progress: 0,
    invitedAt: "09 abr 2026",
    lastUpdate: "09 abr 2026",
  },
  {
    id: "sup-4",
    companyName: "Químicos Delta",
    contactEmail: "compliance@deltaq.com",
    status: "expirado",
    progress: 0,
    invitedAt: "20 mar 2026",
    lastUpdate: "03 abr 2026",
  },
];

export const inviteBalance: InviteBalance = {
  acquired: 30,
  used: 24,
  available: 6,
};

export const workspaceStages: WorkspaceStage[] = [
  {
    id: "diagnostic",
    title: "Diagnóstico ESG",
    description: "Responder o formulário, fechar pendências e preparar envio do ciclo atual.",
    status: "em_andamento",
    metric: "34 de 50 respostas concluídas",
    href: "/app/diagnostico",
  },
  {
    id: "evidences",
    title: "Evidências e documentos",
    description: "Garantir comprovação das respostas para auditoria, clientes e investidores.",
    status: "critico",
    metric: "7 pendências sem documento anexado",
    href: "/app/evidencias",
  },
  {
    id: "suppliers",
    title: "Cadeia de fornecedores",
    description: "Acompanhar adesão da rede convidada e cobrar preenchimentos em atraso.",
    status: "em_andamento",
    metric: "11 de 18 fornecedores responderam",
    href: "/app/fornecedores",
  },
  {
    id: "monetization",
    title: "Convites e monetização",
    description: "Controlar saldo de convites e manter a operação da cadeia sem bloqueio.",
    status: "bloqueado",
    metric: "Saldo de 6 convites antes da próxima compra",
    href: "/app/convites/comprar",
  },
];

export const workspaceTasks: WorkspaceTask[] = [
  {
    id: "task-evidence",
    title: "Anexar evidências das respostas já preenchidas",
    description: "Existem perguntas respondidas sem comprovação documental, o que reduz rastreabilidade e confiança no score.",
    href: "/app/evidencias",
    tone: "warning",
  },
  {
    id: "task-governance",
    title: "Iniciar o eixo de governança e compliance",
    description: "O eixo G ainda não começou e tende a limitar maturidade e leitura executiva do diagnóstico.",
    href: "/app/diagnostico/preencher",
    tone: "default",
  },
  {
    id: "task-suppliers",
    title: "Retomar fornecedores pendentes ou expirados",
    description: "Sua cadeia já tem adesão inicial, mas ainda há fornecedores sem resposta ou com convite vencido.",
    href: "/app/fornecedores",
    tone: "default",
  },
  {
    id: "task-invites",
    title: "Reforçar o saldo de convites para não travar expansão",
    description: "O volume disponível está perto do limite operacional para novas ondas de convite.",
    href: "/app/convites/comprar",
    tone: "warning",
  },
];

export const invitePackages: InvitePackage[] = [
  {
    id: "pkg-10",
    name: "Pacote Essencial",
    invites: 10,
    price: 590,
  },
  {
    id: "pkg-25",
    name: "Pacote Cadeia Ativa",
    invites: 25,
    price: 1290,
    highlight: true,
  },
  {
    id: "pkg-50",
    name: "Pacote Escala",
    invites: 50,
    price: 2290,
  },
];

export const reportSummary: ReportSummary = {
  generatedAt: "15 abr 2026",
  maturity: "Nível 3 - Estruturado",
  strengths: [
    "Governança de saúde e segurança com rituais trimestrais",
    "Monitoramento de consumo energético por unidade operacional",
    "Engajamento inicial da cadeia de fornecedores acima de 60%",
  ],
  gaps: [
    "Ausência de meta formal e aprovada de emissões",
    "Canal de denúncias sem SLA público",
    "Padronização incompleta de evidências por resposta",
  ],
  nextCycleDate: "15 ago 2026",
};
