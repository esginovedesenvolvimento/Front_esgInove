import { jsPDF } from "jspdf";

interface PDFGeneratorOptions {
  isSupplierOrg: boolean;
  model: any;
  companyName: string;
  cnpj: string;
  segment: string;
  invites?: any[];
}

interface MaturityDetails {
  name: string;
  description: string;
  recommendation: string;
}

const maturityLevels: Record<number, MaturityDetails> = {
  1: {
    name: "Nível 1 – Elementar",
    description: "O presente diagnóstico indica que a organização se encontra em estágio inicial de maturidade em sustentabilidade, apresentando práticas ainda incipientes relacionadas aos critérios ambientais, sociais, de governança e bioeconomia. Neste nível, observa-se predominância do atendimento a requisitos regulatórios mínimos, quando aplicáveis, ou ações pontuais ainda não estruturadas de forma sistêmica dentro do modelo de gestão organizacional. Embora os critérios ESG e bioeconômicos ainda não estejam plenamente incorporados às operações, este estágio representa uma fase estratégica de sensibilização e construção de bases institucionais para evolução sustentável do negócio. A organização demonstra potencial para iniciar processos estruturados de fortalecimento da governança, mitigação de riscos socioambientais e ampliação da capacidade adaptativa frente às transformações do mercado. Sob a perspectiva da bioeconomia, recomenda-se iniciar o reconhecimento dos principais impactos associados à cadeia produtiva, à origem de matérias-primas, ao uso de recursos naturais, aos resíduos gerados e às oportunidades de circularidade, rastreabilidade e eficiência operacional. Mesmo em modelos de negócio não diretamente vinculados ao setor biotecnológico, a incorporação gradual de princípios bioeconômicos pode contribuir para maior resiliência e inovação organizacional. Neste estágio, a organização poderá se beneficiar do desenvolvimento de um diagnóstico interno mais aprofundado, com identificação de lacunas, riscos e oportunidades materiais relacionadas aos critérios ESG e bioeconômicos. A definição inicial de prioridades, responsabilidades e metas progressivas tende a favorecer maior organização dos processos internos e melhor alinhamento às demandas emergentes de consumidores, investidores, cadeias produtivas e ambientes de inovação. À medida que a maturidade evolui, empresas neste perfil podem ampliar sua preparação para acessar novos mercados, programas de aceleração, editais de inovação, cadeias de fornecimento sustentáveis e mecanismos de financiamento voltados ao desenvolvimento de soluções de impacto socioambiental. Ressalta-se, contudo, que tais oportunidades dependem do nível de estruturação organizacional, aderência regulatória, setor de atuação e evolução consistente das práticas implementadas.",
    recommendation: "Priorizar a estruturação inicial de políticas, responsabilidades e mecanismos básicos de acompanhamento ESG, bem como iniciar o mapeamento dos impactos socioambientais e bioeconômicos relacionados ao modelo de negócio, cadeia de valor e relacionamento com stakeholders."
  },
  2: {
    name: "Nível 2 – Estruturante",
    description: "O presente diagnóstico indica que a organização se encontra em uma fase de estruturação inicial dos critérios ESG e bioeconômicos, apresentando iniciativas relevantes, porém ainda fragmentadas, sem integração sistêmica ao modelo de gestão e à estratégia organizacional. Neste estágio, observam-se ações pontuais relacionadas à sustentabilidade, conformidade regulatória, responsabilidade social ou melhoria operacional, mas ainda sem mecanismos consistentes de governança, monitoramento e mensuração de resultados. A organização demonstra avanço em relação ao estágio elementar, evidenciando maior conscientização sobre os impactos ambientais, sociais, econômicos e reputacionais associados às suas operações. Entretanto, as iniciativas existentes ainda tendem a ocorrer de forma descentralizada, muitas vezes dependentes de esforços isolados, sem definição clara de indicadores, metas estruturadas ou responsabilidades institucionais formalizadas. Sob a perspectiva da bioeconomia, este estágio representa uma oportunidade estratégica para aprofundar a compreensão sobre os fluxos de recursos utilizados no modelo de negócio, origem de matérias-primas, eficiência produtiva, geração de resíduos, potencial de circularidade e impactos territoriais relacionados às atividades da organização. Empresas que iniciam esse mapeamento tendem a desenvolver maior capacidade de adaptação às exigências emergentes relacionadas à rastreabilidade, sustentabilidade produtiva e inovação orientada à transição ecológica. A organização poderá se beneficiar da construção de mecanismos iniciais de gestão ESG, incluindo definição de responsabilidades, desenvolvimento de políticas internas, estabelecimento de objetivos progressivos e implementação de indicadores básicos de acompanhamento. O fortalecimento dessa estrutura tende a favorecer maior previsibilidade operacional, mitigação de riscos e melhor alinhamento às exigências de cadeias produtivas, programas de inovação, ambientes de aceleração e oportunidades associadas à economia sustentável. À medida que a maturidade evolui, organizações neste nível podem ampliar gradualmente sua competitividade em mercados que valorizam transparência, sustentabilidade e inovação responsável, fortalecendo sua elegibilidade para parcerias estratégicas, editais de fomento, investimentos orientados a impacto e mecanismos de financiamento vinculados à inovação sustentável, conforme setor de atuação e grau de maturidade alcançado.",
    recommendation: "Priorizar a integração das práticas ESG e bioeconômicas ao modelo de gestão, estabelecendo metas, indicadores e mecanismos de monitoramento contínuo, além de fortalecer processos internos relacionados à governança, gestão de riscos, cadeia de valor e tomada de decisão sustentável."
  },
  3: {
    name: "Nível 3 – Gerencial",
    description: "O presente diagnóstico indica que a organização apresenta um nível gerencial de maturidade ESG e bioeconômica, demonstrando integração progressiva dos princípios de sustentabilidade ao modelo de gestão e às operações organizacionais. Neste estágio, observam-se processos mais estruturados, mecanismos de controle definidos e uma compreensão ampliada sobre os impactos ambientais, sociais, econômicos e de governança relacionados ao negócio e à cadeia de valor. A organização evidencia maior capacidade de planejamento e execução de práticas sustentáveis, incorporando progressivamente critérios ESG nos processos de tomada de decisão, gestão de pessoas, relacionamento com stakeholders, cadeia produtiva e monitoramento de riscos e oportunidades. Este estágio representa um marco relevante de maturidade, uma vez que as ações deixam de ocorrer de forma isolada e passam a compor uma lógica organizacional mais integrada e orientada à melhoria contínua. Sob a perspectiva da bioeconomia, observa-se potencial para consolidação de estratégias voltadas ao uso mais eficiente de recursos, valorização de ativos biológicos, redução de desperdícios, rastreabilidade de processos e fortalecimento de práticas relacionadas à circularidade, regeneração e inovação sustentável. Empresas neste nível tendem a desenvolver maior capacidade de adaptação às demandas emergentes por modelos produtivos mais resilientes, eficientes e alinhados às transformações da economia verde. A organização poderá se beneficiar da ampliação de mecanismos de monitoramento e mensuração de desempenho ESG e bioeconômico, incluindo definição de indicadores-chave, estabelecimento de metas progressivas e fortalecimento de instrumentos de transparência, como relatórios internos ou demonstrações periódicas de resultados. A consolidação desses mecanismos favorece maior previsibilidade organizacional, mitigação de riscos operacionais e reputacionais, além de fortalecer a credibilidade institucional perante parceiros estratégicos. À medida que a maturidade evolui, empresas neste nível tendem a ampliar sua competitividade e capacidade de inserção em mercados que demandam maior conformidade socioambiental, rastreabilidade e inovação responsável. Esse avanço pode fortalecer o acesso a ambientes de aceleração, programas de inovação, cadeias produtivas sustentáveis, investimentos orientados à sustentabilidade e oportunidades vinculadas à transição para modelos econômicos de menor impacto socioambiental.",
    recommendation: "Fortalecer a integração dos critérios ESG e bioeconômicos à estratégia organizacional, ampliando a gestão de riscos e oportunidades, consolidando indicadores de desempenho e promovendo maior alinhamento entre sustentabilidade, inovação e geração de valor para stakeholders e cadeia de valor."
  },
  4: {
    name: "Nível 4 – Estratégico",
    description: "O presente diagnóstico indica que a organização apresenta um nível estratégico de maturidade ESG e bioeconômica, incorporando de maneira consistente princípios ambientais, sociais, de governança e sustentabilidade produtiva aos processos decisórios e ao direcionamento do negócio. Neste estágio, a sustentabilidade deixa de representar apenas um conjunto de práticas operacionais e passa a constituir um elemento estratégico relevante para geração de valor, mitigação de riscos e fortalecimento da competitividade organizacional. A organização demonstra capacidade de integrar critérios ESG à gestão de riscos e oportunidades, considerando impactos positivos e negativos associados às suas operações, cadeia de suprimentos, stakeholders e contexto territorial em que está inserida. Observa-se maior alinhamento entre propósito organizacional, desempenho econômico e responsabilidade socioambiental, favorecendo tomadas de decisão mais resilientes e orientadas ao longo prazo. Sob a perspectiva da bioeconomia, este estágio evidencia potencial para fortalecimento de estratégias relacionadas ao uso eficiente de recursos biológicos, valorização da biodiversidade, circularidade produtiva, rastreabilidade, inovação regenerativa e desenvolvimento de soluções alinhadas à transição para modelos econômicos de menor impacto ambiental. Organizações neste nível tendem a demonstrar maior capacidade de adaptação às exigências emergentes de mercados sustentáveis, especialmente aqueles vinculados à agricultura sustentável, biotecnologia, economia circular, carbono, bioinsumos e cadeias produtivas regenerativas. A consolidação de mecanismos de monitoramento, metas e indicadores permite maior previsibilidade sobre resultados socioambientais e econômicos, fortalecendo a governança organizacional, a transparência e a capacidade de resposta diante de transformações regulatórias e mercadológicas. Neste estágio, observa-se maior potencial para geração de inovação orientada à sustentabilidade, desenvolvimento de diferenciais competitivos e fortalecimento da reputação institucional perante clientes, investidores, parceiros e ecossistemas de inovação. À medida que a maturidade evolui, organizações neste nível tendem a ampliar sua inserção em mercados de maior valor agregado, cadeias globais mais exigentes e oportunidades associadas à inovação sustentável, incluindo programas de aceleração, investimentos de impacto, instrumentos financeiros voltados à transição verde, parcerias estratégicas e mecanismos de reconhecimento em sustentabilidade, conforme aderência setorial e evolução do modelo de gestão.",
    recommendation: "Consolidar a sustentabilidade como eixo estruturante do modelo de negócio, ampliando a influência positiva sobre stakeholders, cadeia de valor e ecossistemas de inovação, bem como fortalecer práticas regenerativas, métricas de impacto e mecanismos de colaboração interinstitucional para geração de valor compartilhado."
  },
  5: {
    name: "Nível 5 – Transformador",
    description: "O presente diagnóstico indica que a organização apresenta um nível transformador de maturidade ESG e bioeconômica, posicionando a sustentabilidade como elemento estruturante do modelo de negócio, da cultura organizacional e da estratégia de longo prazo. Neste estágio, os princípios ambientais, sociais, de governança e bioeconomia encontram-se amplamente integrados às operações, à tomada de decisão, à inovação e às relações estabelecidas ao longo da cadeia de valor. A organização demonstra elevada capacidade de antecipação frente a riscos emergentes, mudanças regulatórias, transformações climáticas e novas exigências de mercado, utilizando os critérios ESG não apenas como instrumento de conformidade, mas como mecanismo de geração de valor, diferenciação competitiva e fortalecimento da resiliência organizacional. Observa-se uma atuação orientada ao impacto positivo, com práticas estruturadas de monitoramento, transparência, governança e melhoria contínua, associadas à geração de benefícios compartilhados para stakeholders e territórios de atuação. Sob a perspectiva da bioeconomia, este estágio reflete uma integração avançada de princípios relacionados ao uso sustentável e regenerativo de recursos biológicos, inovação baseada em biodiversidade, circularidade, rastreabilidade, eficiência produtiva e valorização dos ativos naturais e territoriais. Organizações neste nível tendem a desenvolver soluções capazes de contribuir para novos modelos produtivos, promovendo não apenas redução de impactos negativos, mas também restauração, regeneração e fortalecimento de ecossistemas econômicos, sociais e ambientais. A organização apresenta potencial para exercer influência positiva sobre fornecedores, parceiros, clientes, comunidades, ambientes de inovação e demais atores do ecossistema, estimulando a adoption de práticas sustentáveis e ampliando a geração de valor compartilhado. Nesse estágio, a sustentabilidade tende a ser percebida como vantagem competitiva estratégica e elemento central para expansão organizacional, reputação institucional e consolidação de liderança em mercados emergentes associados à transição verde, economia circular, bioeconomia, agricultura regenerativa, biotecnologia e soluções climáticas. À medida que consolida sua maturidade, a organização pode ampliar sua capacidade de inserção em cadeias globais de maior valor agregado, programas internacionais de inovação, investimentos orientados à sustentabilidade, instrumentos financeiros vinculados a impacto, certificações avançadas e parcerias multissetoriais voltadas à transformação sistêmica. Ressalta-se que tais oportunidades variam conforme o setor de atuação, contexto regulatório, capacidade operacional e consistência das evidências relacionadas ao desempenho ESG e bioeconômico.",
    recommendation: "Fortalecer mecanismos de inovação regenerativa, mensuração de impacto e colaboração interinstitucional, ampliando a influência positiva sobre cadeias produtivas e ecossistemas de inovação, além de consolidar práticas que promovam não apenas sustentabilidade, mas regeneração socioambiental e criação de valor sistêmico no longo prazo."
  }
};

export function generateESGReportPDF({
  isSupplierOrg,
  model,
  companyName,
  cnpj,
  segment,
  invites,
}: PDFGeneratorOptions) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // Helper to add a new page and reset Y coordinate
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  // Helper to draw clean header and footer decoration
  const drawHeaderFooter = () => {
    // Header thin green line
    doc.setDrawColor(5, 150, 105); // emerald-600
    doc.setLineWidth(1);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Footer page number
    const pageCount = doc.internal.pages.length - 1;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `InoveESG - Relatório de Desempenho | Página ${pageCount}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      "Confidencial",
      pageWidth - margin - 20,
      pageHeight - 10
    );
  };

  // 1. Draw Cover or Top Banner
  const drawCover = () => {
    // Primary Header Background
    doc.setFillColor(5, 150, 105); // Emerald green
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    const title = isSupplierOrg
      ? "Relatório de Avaliação ESG do Fornecedor"
      : "Relatório de Sustentabilidade & Maturidade ESG — Empresa";
    doc.text(title, margin, 25);

    y = 55;

    // Organization details metadata box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(margin, y, contentWidth, 35, "FD");

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text(isSupplierOrg ? "Fornecedor:" : "Organização:", margin + 5, y + 8);
    doc.setFont("Helvetica", "normal");
    doc.text(companyName, margin + 55, y + 8);

    doc.setFont("Helvetica", "bold");
    doc.text("CNPJ:", margin + 5, y + 16);
    doc.setFont("Helvetica", "normal");
    doc.text(cnpj, margin + 55, y + 16);

    doc.setFont("Helvetica", "bold");
    doc.text("Segmento:", margin + 5, y + 24);
    doc.setFont("Helvetica", "normal");
    doc.text(segment, margin + 55, y + 24);

    doc.setFont("Helvetica", "bold");
    doc.text("Data de Geração:", margin + 5, y + 31);
    doc.setFont("Helvetica", "normal");
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(dateStr, margin + 55, y + 31);

    y += 45;
  };

  // Helper to draw sections
  const drawSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text(title, margin, y);
    
    // Line below section title
    doc.setDrawColor(209, 250, 229); // emerald-100
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 10;
  };

  // Start PDF Creation
  drawCover();
  drawHeaderFooter();

  const scoreGeral = model.globalScore ?? 0;
  const scoreComprovado = model.globalProvenScore ?? 0;

  // Maturity classification helper
  let classification = "";
  let levelIndex = 1;
  if (scoreGeral >= 90) {
    classification = "Nível 5 - Transformador";
    levelIndex = 5;
  } else if (scoreGeral >= 80) {
    classification = "Nível 4 - Estratégico";
    levelIndex = 4;
  } else if (scoreGeral >= 60) {
    classification = "Nível 3 - Gerencial";
    levelIndex = 3;
  } else if (scoreGeral >= 40) {
    classification = "Nível 2 - Estruturante";
    levelIndex = 2;
  } else {
    classification = "Nível 1 - Elementar";
    levelIndex = 1;
  }

  if (isSupplierOrg) {
    // ── Supplier flow ──
    drawSectionTitle("1. Classificação de Risco e Maturidade ESG");

    const rawStars = scoreGeral / 20;
    let starsStr = rawStars.toFixed(1);

    let riskClass = "";
    if (rawStars >= 2.0) riskClass = "Nível 2 — Avançado (Baixo risco)";
    else if (rawStars >= 1.5) riskClass = "Nível 1.5 — Estruturado (Risco moderado)";
    else if (rawStars >= 1.0) riskClass = "Nível 1 — Em evolução (Risco alto)";
    else if (rawStars >= 0.5) riskClass = "Nível 0.5 — Básico (Risco muito alto)";
    else riskClass = "Nível 0 — Inicial (Altíssimo risco)";

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    doc.text("Este relatório consolida as informações socioambientais do fornecedor para fins de homologação e análise de risco na cadeia de suprimentos.", margin, y, { maxWidth: contentWidth });
    y += 15;

    // Highlights Box
    doc.setFillColor(254, 243, 199); // amber-100
    doc.rect(margin, y, contentWidth, 22, "F");
    doc.setTextColor(146, 64, 14); // amber-800
    doc.setFont("Helvetica", "bold");
    doc.text(`Score de Conformidade Geral: ${scoreGeral}%`, margin + 5, y + 7);
    doc.text(`Estrelas ESG: ${starsStr} / 5.0`, margin + 5, y + 14);
    doc.text(`Nível de Risco / Classificação: ${riskClass}`, margin + 80, y + 7);
    y += 30;

    // Section 2: Desempenho por Pilar ESG
    drawSectionTitle("2. Desempenho por Pilar ESG");

    const axisNamesMap: Record<string, string> = {
      E: "Ambiental (E)",
      B: "Bioeconomia Circular (B)",
      S: "Social (S)",
      G: "Governança (G)",
    };

    model.axisScores?.forEach((item: any) => {
      checkPageBreak(35);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(axisNamesMap[item.axis] || item.axis, margin, y);
      
      doc.setFont("Helvetica", "normal");
      doc.text(
        `Score de Conformidade: ${item.score}%`,
        margin + 75,
        y
      );
      y += 6;

      // Wrapped Analysis text
      const textLines = doc.splitTextToSize(item.interpretation || "", contentWidth);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(textLines, margin, y);
      y += textLines.length * 4.5 + 8;
    });

    // Save supplier PDF and exit early
    doc.save("relatorio-fornecedor-esg.pdf");
    return;
  }

  // ── Company flow ──
  drawSectionTitle("1. Resumo Executivo e Maturidade ESG");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  doc.text("A organização realizou o diagnóstico ESG Bioeconômico na plataforma InoveESG. O nível de maturidade global foi classificado com base nas respostas declaradas e na análise das evidências associadas.", margin, y, { maxWidth: contentWidth });
  y += 15;

  // Highlights Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.rect(margin, y, contentWidth, 22, "F");
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont("Helvetica", "bold");
  doc.text(`Score Geral Declarado: ${scoreGeral}%`, margin + 5, y + 7);
  doc.text(`Score Geral Comprovado (Auditado): ${scoreComprovado}%`, margin + 5, y + 14);
  doc.text(`Classificação de Maturidade: ${classification}`, margin + 85, y + 7);
  y += 30;

  // Maturity Text Details from DOCX
  const details = maturityLevels[levelIndex];
  if (details) {
    checkPageBreak(50);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Descrição Detalhada do Nível:", margin, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    const descLines = doc.splitTextToSize(details.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 4.5 + 6;

    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Recomendação Estratégica Geral:", margin, y);
    y += 6;

    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(6, 95, 70); // emerald-800
    const recLines = doc.splitTextToSize(details.recommendation, contentWidth);
    doc.text(recLines, margin, y);
    y += recLines.length * 4.5 + 8;
  }

  // ── Page 2: Rastreamento da Cadeia de Valor ──
  doc.addPage();
  y = margin;
  drawHeaderFooter();

  drawSectionTitle("2. Rastreamento da Cadeia de Valor");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(
    "O rastreamento da cadeia de fornecedores permite à organização monitorar e gerenciar os riscos socioambientais de seus parceiros comerciais, garantindo a conformidade e promovendo a bioeconomia circular ao longo de todo o ciclo de valor.",
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 15;

  const invitesList = invites || [];
  const totalInvites = invitesList.length;
  const completedInvites = invitesList.filter(
    (i: any) => i.requestedDiagnostics?.[0]?.status === "COMPLETED"
  );
  const completedCount = completedInvites.length;
  
  let sumScore = 0;
  completedInvites.forEach((i: any) => {
    sumScore += i.requestedDiagnostics?.[0]?.score?.overallScore ?? 0;
  });
  const avgScoreStr = completedCount > 0 ? `${Math.round(sumScore / completedCount)}%` : "—";

  // Summary box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, contentWidth, 12, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(`Total de Fornecedores Mapeados: ${totalInvites}`, margin + 5, y + 8);
  doc.text(`Diagnósticos Concluídos: ${completedCount}`, margin + 65, y + 8);
  doc.text(`Média ESG da Cadeia: ${avgScoreStr}`, margin + 120, y + 8);
  y += 20;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Status dos Fornecedores Conectados:", margin, y);
  y += 6;

  if (totalInvites === 0) {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Nenhum fornecedor conectado até o momento. A organização pode convidar seus parceiros comerciais na plataforma para realizar o diagnóstico e rastrear o risco socioambiental de sua cadeia.", margin, y, { maxWidth: contentWidth });
    y += 15;
  } else {
    // Draw Table Headers
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    
    doc.text("Fornecedor", margin + 3, y + 5);
    doc.text("Segmento", margin + 65, y + 5);
    doc.text("Status", margin + 105, y + 5);
    doc.text("Nota ESG", margin + 130, y + 5);
    doc.text("Classificação de Risco", margin + 150, y + 5);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    
    invitesList.forEach((invite: any) => {
      checkPageBreak(12);
      
      // Draw row bottom border
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 8, pageWidth - margin, y + 8);
      
      const completedDiag = invite.requestedDiagnostics?.find((d: any) => d.status === "COMPLETED");
      const overallScore = completedDiag?.score?.overallScore;
      
      let statusStr = "Pendente";
      const diag = invite.requestedDiagnostics?.[0];
      if (diag?.status === "COMPLETED") statusStr = "Respondido";
      else if (diag?.status === "DRAFT") statusStr = "Em andamento";
      else if (invite.status === "ACCEPTED" || invite.status === "SENT") statusStr = "Convidado";
      else if (invite.status === "EXPIRED") statusStr = "Expirado";
      
      let riskClass = "—";
      if (overallScore !== undefined && overallScore !== null) {
        const rawStars = overallScore / 20;
        if (rawStars >= 2.0) riskClass = "Baixo Risco";
        else if (rawStars >= 1.5) riskClass = "Risco Moderado";
        else if (rawStars >= 1.0) riskClass = "Risco Alto";
        else if (rawStars >= 0.5) riskClass = "Risco Muito Alto";
        else riskClass = "Altíssimo Risco";
      }
      
      const supplierName = invite.supplierOrganization?.tradeName 
        || invite.supplierOrganization?.legalName 
        || invite.supplierEmail;
        
      const segmentStr = invite.supplierOrganization?.industrySegment || "—";
      
      const nameLines = doc.splitTextToSize(supplierName, 58);
      doc.text(nameLines, margin + 3, y + 4);
      doc.text(segmentStr, margin + 65, y + 4);
      doc.text(statusStr, margin + 105, y + 4);
      doc.text(overallScore !== undefined && overallScore !== null ? `${Math.round(overallScore)}%` : "—", margin + 130, y + 4);
      doc.text(riskClass, margin + 150, y + 4);
      
      y += 10;
    });
  }

  // ── Page 3: Desempenho por Eixo ESG ──
  doc.addPage();
  y = margin;
  drawHeaderFooter();

  drawSectionTitle("3. Desempenho por Eixo ESG");

  const axisNamesMap: Record<string, string> = {
    E: "Ambiental (E)",
    B: "Bioeconomia Circular (B)",
    S: "Social (S)",
    G: "Governança (G)",
  };

  model.axisScores?.forEach((item: any) => {
    checkPageBreak(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(axisNamesMap[item.axis] || item.axis, margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.text(
      `Score Declarado: ${item.score}%  |  Score Comprovado: ${item.provenScore}%`,
      margin + 75,
      y
    );
    y += 6;

    // Wrapped Analysis text
    const textLines = doc.splitTextToSize(item.interpretation || "", contentWidth);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(textLines, margin, y);
    y += textLines.length * 4.5 + 8;
  });

  // ── Page 4: Pontos Fortes, Gaps, Ações e Evidências ──
  doc.addPage();
  y = margin;
  drawHeaderFooter();

  drawSectionTitle("4. Pontos Fortes e Oportunidades de Melhoria");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text("Pontos Fortes (Destaques Positivos)", margin, y);
  y += 6;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const strengths = [
    "- Comprometimento nítido da Alta Liderança com diretrizes ESG.",
    "- Presença de Código de Conduta e canal de denúncias estruturados.",
    "- Boas práticas de descarte de resíduos e governança de dados.",
  ];

  strengths.forEach((line) => {
    doc.text(line, margin + 4, y);
    y += 5;
  });

  y += 5;
  checkPageBreak(25);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text("Gaps Identificados (Oportunidades de Melhoria)", margin, y);
  y += 6;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const gaps = [
    "- Mapeamento incompleto de emissões de Escopo 3 (cadeia de valor).",
    "- Ausência de auditoria terceira de evidências ambientais.",
    "- Ausência de métricas de impacto de transição energética estruturadas.",
  ];

  gaps.forEach((line) => {
    doc.text(line, margin + 4, y);
    y += 5;
  });

  y += 10;

  // Section 5: Action Plan
  checkPageBreak(60);
  drawSectionTitle("5. Plano de Ação Recomendado (Próximos Passos)");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(
    "Com base nos gaps e pilares mais críticos identificados no diagnóstico, recomendamos as seguintes ações:",
    margin,
    y
  );
  y += 8;

  // Simple Table headers
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  
  doc.text("Ação Recomendada", margin + 3, y + 5);
  doc.text("Eixo", margin + 95, y + 5);
  doc.text("Prioridade", margin + 115, y + 5);
  doc.text("Prazo sugerido", margin + 145, y + 5);
  y += 8;

  const actions = model.actions || [];
  const actionList = actions.slice(0, 3).length > 0 ? actions.slice(0, 3) : [
    { title: "Elaborar plano de transição energética", category: "E", priority: "Alta", deadline: "90 dias" },
    { title: "Definir indicadores de circularidade", category: "B", priority: "Média", deadline: "120 dias" },
    { title: "Treinar equipe em ética e LGPD", category: "G", priority: "Alta", deadline: "60 dias" }
  ];

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  actionList.forEach((act: any) => {
    checkPageBreak(12);
    // Draw row bottom border
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);

    const titleLines = doc.splitTextToSize(act.title || act.description || "", 85);
    doc.text(titleLines, margin + 3, y + 4);
    doc.text(act.category || "ESG", margin + 95, y + 4);
    doc.text(act.priority || "Alta", margin + 115, y + 4);
    doc.text(act.deadline || "90 dias", margin + 145, y + 4);
    
    y += 10;
  });

  y += 5;

  // Section 6: Evidence status / Footer Notes
  checkPageBreak(35);
  drawSectionTitle("6. Status de Homologação de Evidências");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "* Este documento constitui um relatório preliminar de ESG. Evidências detalhadas como laudos ambientais, políticas sociais e licenças corporativas devem ser submetidas na plataforma InoveESG para emissão do Selo ESG Auditado definitivo.",
    margin,
    y,
    { maxWidth: contentWidth }
  );

  // Save the Company PDF
  doc.save("relatorio-empresa-esg.pdf");
}
