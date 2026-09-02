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
    id: "bioeconomy-circular",
    title: "Bioeconomia circular e cadeia de valor",
    axis: "B",
    status: "em_andamento",
    answered: 6,
    total: 12,
    updatedAt: "14 abr 2026",
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
    category: "Ambiental",
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
    category: "Ambiental",
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
    category: "Social",
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
    category: "Governança",
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

// Eixos e Questionários Específicos por Segmento
export const civilSections: DiagnosticSection[] = [
  {
    id: "environmental-civil",
    title: "Gestão de Resíduos e Recursos Hídricos",
    axis: "E",
    status: "nao_iniciado",
    answered: 0,
    total: 2,
    updatedAt: "-",
  },
  {
    id: "social-civil",
    title: "Saúde e Segurança Ocupacional (NRs)",
    axis: "S",
    status: "nao_iniciado",
    answered: 0,
    total: 1,
    updatedAt: "-",
  },
  {
    id: "governance-civil",
    title: "Homologação de Cadeia e Conformidade",
    axis: "G",
    status: "nao_iniciado",
    answered: 0,
    total: 1,
    updatedAt: "-",
  },
];

export const civilQuestions: DiagnosticQuestion[] = [
  {
    id: "q-civil-1",
    sectionId: "environmental-civil",
    axis: "E",
    category: "Ambiental",
    prompt: "A empresa possui um Plano de Gerenciamento de Resíduos da Construção Civil (PGRCC) ativo?",
    hint: "Informe se há PGRCC nos canteiros com destinação adequada de rejeitos.",
    answer: "",
    hasEvidence: false,
    options: [
      "Não possui PGRCC.",
      "Possui PGRCC apenas em formato de rascunho.",
      "Possui PGRCC implementado e atende às exigências básicas da legislação.",
      "Possui PGRCC implementado e recicla/reutiliza mais de 50% dos resíduos gerados.",
      "PGRCC avançado com certificação de descarte zero de rejeitos e rastreabilidade total."
    ]
  },
  {
    id: "q-civil-2",
    sectionId: "environmental-civil",
    axis: "E",
    category: "Ambiental",
    prompt: "Como é controlado e otimizado o consumo de água nos canteiros de obras?",
    hint: "Informe a presença de sistemas de medição e captação/reuso.",
    answer: "",
    hasEvidence: false,
    options: [
      "Não monitora o consumo de água nos canteiros.",
      "Medição simples por fatura mensal de concessionária, sem controle interno.",
      "Monitoramento mensal detalhado com plano básico de redução por m².",
      "Metas formais de consumo por m² e uso de redutores de vazão/tecnologias economizadoras.",
      "100% de captação e reuso de água da chuva/processos industriais nas obras."
    ]
  },
  {
    id: "q-civil-3",
    sectionId: "social-civil",
    axis: "S",
    category: "Social",
    prompt: "Como a empresa garante a saúde e a segurança do trabalho frente às normas regulamentadoras (ex: NR-18 e NR-35)?",
    hint: "Descreva auditorias, equipamentos de proteção e gestão de riscos operacionais.",
    answer: "",
    hasEvidence: false,
    options: [
      "Cumpre apenas o mínimo obrigatório de fornecimento de EPIs básico.",
      "Possui equipe interna e promove treinamentos eventuais de segurança.",
      "Auditorias mensais e controle diário de EPI/EPC integrados nos canteiros.",
      "Programa de acidentes zero com metas auditadas externamente e bonificação atrelada.",
      "Certificação internacional ativa (ex: ISO 45001) estendida a todos os terceiros."
    ]
  },
  {
    id: "q-civil-4",
    sectionId: "governance-civil",
    axis: "G",
    category: "Governança",
    prompt: "Há auditoria e seleção de subempreiteiros baseada em conformidade trabalhista?",
    hint: "Aponte como a empresa evita riscos de precarização trabalhista e corrupção na cadeia.",
    answer: "",
    hasEvidence: false,
    options: [
      "Não possui controle sobre as práticas trabalhistas de subcontratados.",
      "Exige apenas certidões negativas básicas no momento da contratação.",
      "Auditorias periódicas e acompanhamento mensal das guias de recolhimento de terceiros.",
      "SLA com monitoramento contínuo em tempo real e bloqueio automático de parceiros irregulares.",
      "Canal de compliance integrado com monitoramento completo e homologação automatizada da cadeia."
    ]
  }
];

export const oilAndGasSections: DiagnosticSection[] = [
  {
    id: "environmental-oil",
    title: "Eixo 1 — Ambiental e Climático",
    axis: "E",
    status: "nao_iniciado",
    answered: 0,
    total: 21,
    updatedAt: "-",
  },
  {
    id: "social-oil",
    title: "Eixo 2 — Social",
    axis: "S",
    status: "nao_iniciado",
    answered: 0,
    total: 17,
    updatedAt: "-",
  },
  {
    id: "governance-oil",
    title: "Eixo 3 — Governança, Ética e Gestão ESG",
    axis: "G",
    status: "nao_iniciado",
    answered: 0,
    total: 23,
    updatedAt: "-",
  },
  {
    id: "bioeconomy-oil",
    title: "Eixo 4 — Bioeconomia Circular e Inovação",
    axis: "B",
    status: "nao_iniciado",
    answered: 0,
    total: 14,
    updatedAt: "-",
  },
];

export const oilAndGasQuestions: DiagnosticQuestion[] = [
  {
    id: "q-oil-a1",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A1. A empresa possui todas as licenças, autorizações e requisitos ambientais aplicáveis às suas atividades?",
    hint: "Conformidade ambiental e licenças operacionais.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a2",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A2. A empresa possui um sistema ou procedimento para identificar, controlar e monitorar seus principais impactos ambientais?",
    hint: "Sistemas de gestão ambiental e controle de impactos.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a3",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A3. A empresa monitora o consumo de água, energia, combustíveis e outros recursos naturais utilizados em suas operações?",
    hint: "Medição do consumo de recursos naturais.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a4",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A4. A empresa possui metas ou iniciativas para reduzir o consumo de água em suas operações?",
    hint: "Gestão e eficiência hídrica.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a5",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A5. A empresa adota tecnologias ou práticas de reuso, tratamento ou reciclagem da água?",
    hint: "Reuso e tratamento de efluentes hídricos.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a6",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A6. A empresa avalia riscos relacionados à disponibilidade, escassez ou contaminação da água em suas operações?",
    hint: "Avaliação de riscos hídricos operacionais.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a7",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A7. A empresa identifica e monitora as fontes de energia e combustíveis utilizadas em suas operações?",
    hint: "Monitoramento da matriz energética.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a8",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A8. A empresa possui iniciativas ou metas para aumentar a eficiência energética e reduzir o consumo de combustíveis fósseis?",
    hint: "Eficiência energética e redução de fósseis.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a9",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A9. A empresa utiliza ou avalia a utilização de fontes de energia renovável ou de menor impacto ambiental?",
    hint: "Energias renováveis e transição limpa.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a10",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A10. A empresa realiza a segregação, armazenamento, transporte e destinação adequada dos resíduos gerados, especialmente resíduos perigosos?",
    hint: "Gestão de resíduos perigosos e destinação.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a11",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A11. A empresa possui um plano ou procedimento formal de gestão e redução de resíduos?",
    hint: "Plano formal de gestão de resíduos (PGRS).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a12",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A12. A empresa estabelece metas ou indicadores para redução, reutilização, reciclagem ou reaproveitamento de materiais?",
    hint: "Metas de reciclagem e reaproveitamento.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a13",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A13. A empresa possui programas de treinamento ou orientação ambiental para colaboradores e terceiros relacionados à gestão de resíduos e prevenção da poluição?",
    hint: "Treinamentos ambientais e prevenção da poluição.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a14",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A14. A empresa identifica os potenciais impactos de suas atividades sobre biodiversidade, ecossistemas ou áreas ambientalmente sensíveis?",
    hint: "Preservação da biodiversidade e ecossistemas.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a15",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A15. A empresa adota medidas de prevenção, mitigação, recuperação ou compensação de impactos ambientais quando aplicável?",
    hint: "Mitigação e recuperação ambiental.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a16",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A16. A empresa considera critérios ambientais na seleção e contratação de seus próprios fornecedores e prestadores de serviços?",
    hint: "Critérios ambientais na cadeia de fornecedores.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a17",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A17. A empresa realiza ou possui capacidade de realizar o inventário de suas emissões de Gases de Efeito Estufa?",
    hint: "Inventário de GEE (Escopo 1 e 2).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a18",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A18. A empresa possui dados sobre consumo de combustíveis, energia elétrica, transporte ou outras fontes relevantes para o cálculo de emissões?",
    hint: "Rastreabilidade de dados de emissões.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a19",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A19. A empresa possui metas, iniciativas ou planos para redução de suas emissões de GEE?",
    hint: "Metas de descarbonização e redução de emissões.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a20",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A20. A empresa identifica quais de suas atividades, produtos ou serviços podem contribuir para as emissões da cadeia de valor de seus clientes?",
    hint: "Mapeamento de contribuição para o Escopo 3.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-a21",
    sectionId: "environmental-oil",
    axis: "E",
    category: "Ambiental",
    prompt: "A21. A empresa possui capacidade de fornecer periodicamente dados ambientais e climáticos necessários para que seus clientes calculem e monitorem as emissões indiretas de Escopo 3?",
    hint: "Reporte de dados climáticos para clientes (Escopo 3).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s1",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S1. Todos os trabalhadores e colaboradores da empresa atuam de acordo com as exigências legais e trabalhistas aplicáveis?",
    hint: "Conformidade trabalhista e legalidade das contratações.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s2",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S2. A empresa possui mecanismos para garantir condições justas de trabalho, remuneração e benefícios?",
    hint: "Condições justas, remuneração e benefícios.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s3",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S3. A empresa possui código de conduta, política ou diretrizes relacionadas a direitos humanos, trabalho digno e não discriminação?",
    hint: "Políticas de direitos humanos e não discriminação.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s4",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S4. A empresa avalia ou monitora riscos relacionados a direitos humanos em sua própria operação e cadeia de fornecedores?",
    hint: "Monitoramento de riscos em direitos humanos.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s5",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S5. A empresa fornece os Equipamentos de Proteção Individual e Coletiva necessários às atividades desenvolvidas?",
    hint: "Fornecimento e gestão de EPIs e EPCs.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s6",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S6. A empresa realiza treinamentos periódicos de saúde, segurança e prevenção de acidentes?",
    hint: "Capacitação periódica em SST.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s7",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S7. A empresa possui procedimentos para identificar, avaliar e controlar riscos ocupacionais?",
    hint: "Gestão de riscos ocupacionais (PGR / PCMSO).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s8",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S8. A empresa monitora acidentes, incidentes, quase acidentes e outros indicadores de saúde e segurança?",
    hint: "Indicadores de taxa de frequência e gravidade de acidentes.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s9",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S9. A empresa possui ações voltadas à promoção da saúde física e prevenção de doenças relacionadas ao trabalho?",
    hint: "Promoção da saúde e bem-estar corporativo.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s10",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S10. A empresa considera riscos ergonômicos e psicossociais em suas práticas de gestão de pessoas?",
    hint: "Ergonomia e saúde mental dos colaboradores.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s11",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S11. A empresa promove diversidade e inclusão em seu quadro de colaboradores e em posições de liderança?",
    hint: "Diversidade e inclusão na liderança e equipes.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s12",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S12. A empresa possui políticas ou práticas para prevenir discriminação, assédio e outras formas de violência no ambiente de trabalho?",
    hint: "Prevenção ao assédio e canal de apoio.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s13",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S13. A empresa estabelece ações, metas ou indicadores relacionados à inclusão de grupos sub-representados?",
    hint: "Metas de diversidade e inclusão.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s14",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S14. A empresa investe em capacitação e desenvolvimento profissional de seus colaboradores?",
    hint: "Investimento em treinamento e capacitação.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s15",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S15. A empresa possui mecanismos para estimular inovação, compartilhamento de conhecimento e desenvolvimento de novas competências?",
    hint: "Cultura de inovação e aprendizagem contínua.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s16",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S16. A empresa possui práticas de sucessão, mentoria ou transferência de conhecimento entre profissionais mais experientes e novas gerações?",
    hint: "Gestão do conhecimento e mentoria.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-s17",
    sectionId: "social-oil",
    axis: "S",
    category: "Social",
    prompt: "S17. A empresa identifica e acompanha os impactos sociais de suas operações sobre comunidades, territórios e demais partes interessadas, adotando ações para gerar impactos positivos ou mitigar impactos negativos?",
    hint: "Relacionamento e impacto comunitário local.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g1",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G1. A empresa mantém sua documentação societária, fiscal, trabalhista, regulatória e operacional atualizada?",
    hint: "Conformidade documental e regularidade fiscal/societária.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g2",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G2. Existem papéis, responsabilidades e níveis de decisão claramente definidos entre sócios, gestores e colaboradores?",
    hint: "Estrutura organizacional e alçadas de decisão.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g3",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G3. A empresa possui processos organizados para gestão de contratos, documentos e obrigações com clientes e fornecedores?",
    hint: "Gestão formal de contratos e obrigações.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g4",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G4. A empresa possui controles contábeis e financeiros adequados ao porte e à complexidade de suas operações?",
    hint: "Controles contábeis e gestão financeira.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g5",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G5. A empresa possui código de ética, código de conduta ou política equivalente?",
    hint: "Código de Ética e Conduta.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g6",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G6. A empresa possui diretrizes ou controles para prevenção de corrupção, fraude, conflito de interesses e outras práticas ilícitas?",
    hint: "Prevenção à corrupção, fraudes e suborno.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g7",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G7. A empresa possui um canal ou mecanismo para comunicação e tratamento de denúncias, irregularidades ou comportamentos antiéticos?",
    hint: "Canal de denúncias independente e sigiloso.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g8",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G8. A empresa realiza treinamentos ou ações de conscientização sobre ética, integridade e conduta?",
    hint: "Treinamentos de compliance e integridade.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g9",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G9. A empresa possui uma pessoa, equipe ou responsável definido para acompanhar questões ESG, sustentabilidade ou conformidade?",
    hint: "Liderança e responsável pela pauta ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g10",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G10. A alta liderança participa ou acompanha decisões relacionadas à sustentabilidade, riscos e desempenho ESG?",
    hint: "Envolvimento da alta administração em ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g11",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G11. A empresa possui indicadores ou metas para acompanhar seu desempenho ambiental, social e de governança?",
    hint: "Indicadores e metas ESG consolidados.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g12",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G12. A empresa realiza reuniões ou processos periódicos para analisar resultados, riscos e oportunidades relacionados à sustentabilidade?",
    hint: "Análise periódica de riscos e oportunidades ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g13",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G13. A empresa comunica informações relevantes sobre suas práticas ESG aos clientes, colaboradores ou demais partes interessadas?",
    hint: "Comunicação e transparência ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g14",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G14. A empresa possui processos para coletar, armazenar e atualizar dados ESG de forma organizada e verificável?",
    hint: "Governança e auditoria de dados ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g15",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G15. A empresa consegue disponibilizar evidências e documentos que comprovem as informações ESG declaradas?",
    hint: "Auditabilidade e evidências de sustentabilidade.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g16",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G16. A empresa realiza auditorias, verificações internas ou avaliações externas relacionadas à conformidade e sustentabilidade?",
    hint: "Auditorias de conformidade e ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g17",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G17. A empresa possui critérios para avaliar riscos e requisitos ESG de seus próprios fornecedores e parceiros?",
    hint: "Homologação ESG da cadeia de fornecimento.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g18",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G18. A empresa realiza algum tipo de due diligence ou verificação de conformidade antes de contratar fornecedores ou parceiros críticos?",
    hint: "Due diligence de integridade de parceiros.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g19",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G19. A empresa consegue identificar riscos ESG relevantes associados aos produtos, serviços ou matérias-primas adquiridos de terceiros?",
    hint: "Mapeamento de riscos na cadeia de suprimentos.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g20",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G20. A empresa identifica os temas ESG mais relevantes para seu negócio, seus clientes e demais partes interessadas?",
    hint: "Matriz de materialidade ESG.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g21",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G21. A empresa possui mecanismos para receber, analisar e responder às demandas, reclamações ou expectativas de clientes, comunidades, trabalhadores e outros stakeholders?",
    hint: "Engajamento com partes interessadas (stakeholders).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g22",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G22. A empresa possui políticas ou procedimentos para proteção de dados pessoais e informações confidenciais?",
    hint: "Adequação à LGPD e proteção de dados.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-g23",
    sectionId: "governance-oil",
    axis: "G",
    category: "Governança",
    prompt: "G23. A empresa possui responsáveis e controles para identificar, avaliar e reduzir riscos relacionados à segurança da informação e à proteção de dados?",
    hint: "Segurança da informação e biossegurança digital.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b1",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B1. A empresa avalia os impactos ambientais de seus produtos ou serviços ao longo de seu ciclo de vida?",
    hint: "Avaliação de Ciclo de Vida (ACV).",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b2",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B2. A empresa utiliza informações sobre ciclo de vida para identificar oportunidades de redução de impactos ambientais ou emissões?",
    hint: "Ecodesign e redução de pegada ambiental.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b3",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B3. A empresa considera critérios de durabilidade, manutenção, reparabilidade, reutilização ou reciclabilidade no desenvolvimento ou aquisição de produtos e materiais?",
    hint: "Durabilidade, manutenção e reuso de produtos.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b4",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B4. A empresa possui iniciativas para reduzir o consumo de matérias-primas virgens por meio de reutilização, recuperação ou uso de materiais reciclados?",
    hint: "Redução no consumo de matéria-prima virgem.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b5",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B5. A empresa possui práticas para reaproveitamento, recuperação ou valorização de resíduos e subprodutos gerados em suas operações?",
    hint: "Valorização de subprodutos e coprodutos industriais.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b6",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B6. A empresa possui parcerias com outras empresas ou organizações para reaproveitamento de materiais, resíduos ou subprodutos?",
    hint: "Simbioise industrial e parcerias circulares.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b7",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B7. A empresa possui sistemas ou iniciativas de logística reversa, retorno, recolhimento ou recuperação de produtos e materiais?",
    hint: "Logística reversa e pós-consumo.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b8",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B8. A empresa utiliza ou avalia o uso de matérias-primas renováveis, de origem biológica sustentável ou provenientes de fontes circulares?",
    hint: "Uso de insumos renováveis e de base biológica.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b9",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B9. A empresa investe ou participa de iniciativas para substituir materiais, insumos ou processos de maior impacto por alternativas de menor carbono ou origem renovável?",
    hint: "Substituição de materiais de alta pegada por de baixo carbono.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b10",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B10. A empresa desenvolve, utiliza ou comercializa soluções que contribuam para redução da dependência de recursos não renováveis?",
    hint: "Soluções para transição energética e descarbonização.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b11",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B11. A empresa investe ou participa de projetos de pesquisa, desenvolvimento e inovação voltados à sustentabilidade, descarbonização ou eficiência de recursos?",
    hint: "Investimento em P&D sustentável.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b12",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B12. A empresa possui parcerias com universidades, centros de pesquisa, startups ou outras organizações para desenvolver soluções sustentáveis?",
    hint: "Inovação aberta com ecossistema sustentável.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b13",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B13. A empresa avalia ou mensura os benefícios ambientais, sociais ou econômicos das soluções inovadoras que desenvolve ou utiliza?",
    hint: "Mensuração de impacto das inovações sustentáveis.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  },
  {
    id: "q-oil-b14",
    sectionId: "bioeconomy-oil",
    axis: "B",
    category: "Bioeconomia",
    prompt: "B14. A empresa consegue demonstrar como seus produtos, serviços ou soluções contribuem para redução de emissões, resíduos, consumo de recursos ou outros impactos ao longo da cadeia de valor de seus clientes?",
    hint: "Geração de valor sustentável para o Escopo 3 do cliente.",
    answer: "",
    hasEvidence: false,
    options: [
      "1 — Inexistente: Não possui nenhum processo ou controle.",
      "2 — Inicial: Realiza ações ou levantamentos pontuais, sem processo definido.",
      "3 — Parcialmente Implementado: Possui algumas práticas implementadas, mas ainda sem cobertura, regularidade ou systematização completa.",
      "4 — Estruturado: Possui processo formal, responsável definido e monitoramento periódico.",
      "5 — Avançado / Estratégico: O processo é integrado à gestão estratégica, possui metas, indicadores, acompanhamento contínuo e ações de melhoria."
    ]
  }
];

export const agroSections: DiagnosticSection[] = [
  {
    id: "environmental-agro",
    title: "Gestão do Solo, Carbono e Rastreabilidade",
    axis: "E",
    status: "nao_iniciado",
    answered: 0,
    total: 2,
    updatedAt: "-",
  },
  {
    id: "social-agro",
    title: "Condições do Trabalho no Campo",
    axis: "S",
    status: "nao_iniciado",
    answered: 0,
    total: 1,
    updatedAt: "-",
  },
  {
    id: "governance-agro",
    title: "Homologação de Cadeias Agrícolas",
    axis: "G",
    status: "nao_iniciado",
    answered: 0,
    total: 1,
    updatedAt: "-",
  },
];

export const agroQuestions: DiagnosticQuestion[] = [
  {
    id: "q-agro-1",
    sectionId: "environmental-agro",
    axis: "E",
    category: "Ambiental",
    prompt: "Como é feita a gestão do uso da terra e o controle do desmatamento (tanto legal quanto ilegal)?",
    hint: "Informe o uso de georreferenciamento e o Cadastro Ambiental Rural (CAR).",
    answer: "",
    hasEvidence: false,
    options: [
      "Não monitora o desmatamento ou a conformidade ambiental das terras.",
      "Possui apenas registro básico no CAR, sem monitoramento regular.",
      "CAR ativo e monitoramento periódico de imagens de satélite nas áreas de produção.",
      "Monitoramento contínuo por satélite de desmatamento zero, inclusive em áreas legais permitidas.",
      "Certificação de Carbono Neutro ativa e conservação de reservas além do mínimo exigido por lei."
    ]
  },
  {
    id: "q-agro-2",
    sectionId: "environmental-agro",
    axis: "E",
    category: "Ambiental",
    prompt: "Qual o nível de adoção de insumos e defensivos agrícolas biológicos versus químicos na produção?",
    hint: "Descreva o manejo integrado de pragas e práticas de agricultura regenerativa.",
    answer: "",
    hasEvidence: false,
    options: [
      "Uso intensivo de defensivos químicos sintéticos sem metas ou controle de redução.",
      "Uso de defensivos com orientação agronômica básica, buscando evitar excessos.",
      "Manejo Integrado de Pragas (MIP) ativo com medição e redução anual de químicos.",
      "Priorização do uso de biológicos, aplicação direcionada por drones e agricultura de precisão.",
      "Manejo 100% biológico e regenerativo certificado com comprovação de enriquecimento do solo."
    ]
  },
  {
    id: "q-agro-3",
    sectionId: "social-agro",
    axis: "S",
    category: "Social",
    prompt: "Como a empresa monitora e assegura condições dignas de trabalho aos trabalhadores temporários e sazonais no campo?",
    hint: "Explicite o controle de alojamentos, EPIs rurais e jornada de trabalho no campo.",
    answer: "",
    hasEvidence: false,
    options: [
      "Sem monitoramento diferenciado para trabalhadores sazonais ou de safra.",
      "Exige contratos formais e de acordo com a legislação trabalhista, sem auditorias práticas.",
      "Fiscalização interna mensal de alojamentos, transporte e fornecimento obrigatório de EPIs.",
      "Auditorias externas frequentes, programas de capacitação e inclusão social dos temporários.",
      "Selo ou certificação de comércio justo (Fair Trade) atestando direitos humanos de alto padrão no campo."
    ]
  },
  {
    id: "q-agro-4",
    sectionId: "governance-agro",
    axis: "G",
    category: "Governança",
    prompt: "Como é estruturada a rastreabilidade socioambiental da cadeia de suprimentos de grãos ou insumos agrícolas?",
    hint: "Indique como a empresa evita comprar de terras desmatadas ilegalmente ou em áreas indígenas.",
    answer: "",
    hasEvidence: false,
    options: [
      "Não possui controle sobre a procedência socioambiental das matérias-primas e grãos comprados.",
      "Rastreamento parcial baseado apenas em notas fiscais e declarações simples de produtores.",
      "Rastreamento completo de todos os fornecedores diretos até a fazenda produtora de origem.",
      "Rastreamento em tempo real auditado por terceiros contra embargos ambientais e terras indígenas.",
      "Rastreabilidade automatizada via Blockchain integrada a bancos de dados públicos de infrações socioambientais."
    ]
  }
];

export const segmentQuestionsMap: Record<string, DiagnosticQuestion[]> = {
  "Construção Civil": civilQuestions,
  "Óleo e Gás": oilAndGasQuestions,
  "Óleo & Gás": oilAndGasQuestions,
  "OLEO_E_GAS": oilAndGasQuestions,
  "Agronegócio": agroQuestions,
};

export const segmentSectionsMap: Record<string, DiagnosticSection[]> = {
  "Construção Civil": civilSections,
  "Óleo e Gás": oilAndGasSections,
  "Óleo & Gás": oilAndGasSections,
  "OLEO_E_GAS": oilAndGasSections,
  "Agronegócio": agroSections,
};


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
    axis: "B",
    score: 74,
    interpretation: "Bioeconomia circular em evolução, com práticas já adotadas na cadeia e espaço para escalonamento.",
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
    id: "pkg-15-30",
    name: "Pacote Bronze",
    minInvites: 15,
    maxInvites: 30,
    pricePerInvite: 50,
  },
  {
    id: "pkg-31-50",
    name: "Pacote Prata",
    minInvites: 31,
    maxInvites: 50,
    pricePerInvite: 50,
    highlight: true,
  },
  {
    id: "pkg-51-70",
    name: "Pacote Ouro",
    minInvites: 51,
    maxInvites: 70,
    pricePerInvite: 50,
  },
  {
    id: "pkg-71-90",
    name: "Pacote Platina",
    minInvites: 71,
    maxInvites: 90,
    pricePerInvite: 50,
  },
  {
    id: "pkg-100",
    name: "Pacote Diamante",
    minInvites: 100,
    maxInvites: 100,
    pricePerInvite: 50,
  },
];

export const reportSummary: ReportSummary = {
  generatedAt: "15 abr 2026",
  maturity: "Nível 3 - Estruturado",
  strengths: [
    "Governança de saúde e segurança com rituais trimestrais",
    "Monitoramento de consumo energético por unidade operacional",
    "Iniciativas de bioeconomia circular com reaproveitamento de insumos",
    "Engajamento inicial da cadeia de fornecedores acima de 60%",
  ],
  gaps: [
    "Ausência de meta formal e aprovada de emissões",
    "Formalização insuficiente do pilar de bioeconomia circular",
    "Canal de denúncias sem SLA público",
    "Padronização incompleta de evidências por resposta",
  ],
  nextCycleDate: "15 ago 2026",
};
