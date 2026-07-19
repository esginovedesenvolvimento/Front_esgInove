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
    description: "O presente diagnóstico indica que a organização se encontra em estágio inicial de maturidade em sustentabilidade, apresentando práticas ainda incipientes relacionadas aos critérios ambientais, sociais, de governança e bioeconomia.\n\nNeste nível, observa-se predominância do atendimento a requisitos regulatórios mínimos, quando aplicáveis, ou ações pontuais ainda não estruturadas de forma sistêmica dentro do modelo de gestão organizacional.\n\nEmbora os critérios ESG e bioeconômicos ainda não estejam plenamente incorporados às operações, este estágio representa uma fase estratégica de sensibilização e construção de bases institucionais para evolução sustentável do negócio. A organização demonstra potencial para iniciar processos estruturados de fortalecimento da governança, mitigação de riscos socioambientais e ampliação da capacidade adaptativa frente às transformações do mercado.\n\nSob a perspectiva da bioeconomia, recomenda-se iniciar o reconhecimento dos principais impactos associados à cadeia produtiva, à origem de matérias-primas, ao uso de recursos naturais, aos resíduos gerados e às oportunidades de circularidade, rastreabilidade e eficiência operacional. Mesmo em modelos de negócio não diretamente vinculados ao setor biotecnológico, a incorporação gradual de princípios bioeconômicos pode contribuir para maior resiliência e inovação organizacional.\n\nNeste estágio, a organização poderá se beneficiar do desenvolvimento de um diagnóstico interno mais aprofundado, com identificação de lacunas, riscos e oportunidades materiais relacionadas aos critérios ESG e bioeconômicos. A definição inicial de prioridades, responsabilidades e metas progressivas tende a favorecer maior organização dos processos internos e melhor alinhamento às demandas emergentes de consumidores, investidores, cadeias produtivas e ambientes de inovação.\n\nÀ medida que a maturidade evolui, empresas neste perfil podem ampliar sua preparação para acessar novos mercados, programas de aceleação, editais de inovação, cadeias de fornecimento sustentáveis e mecanismos de financiamento voltados ao desenvolvimento de soluções de impacto socioambiental. Ressalta-se, contudo, que tais oportunidades dependem do nível de estruturação organizacional, aderência regulatória, setor de atuação e evolução consistente das práticas implementadas.",
    recommendation: "Priorizar a estruturação inicial de políticas, responsabilidades e mecanismos básicos de acompanhamento ESG, bem como iniciar o mapeamento dos impactos socioambientais e bioeconômicos relacionados ao modelo de negócio, cadeia de valor e relacionamento com stakeholders."
  },
  2: {
    name: "Nível 2 – Estruturante",
    description: "O presente diagnóstico indica que a organização se encontra em uma fase de estruturação inicial dos critérios ESG e bioeconômicos, apresentando iniciativas relevantes, porém ainda fragmentadas, sem integração sistêmica ao modelo de gestão e à estratégia organizacional.\n\nNeste estágio, observam-se ações pontuais relacionadas à sustentabilidade, conformidade regulatória, responsabilidade social ou melhoria operacional, mas ainda sem mecanismos consistentes de governança, monitoramento e mensuração de resultados.\n\nA organização demonstra avanço em relação ao estágio elementar, evidenciando maior conscientização sobre os impactos ambientais, sociais, econômicos e reputacionais associados às suas operações. Entretanto, as iniciativas existentes ainda tendem a ocorrer de forma descentralizada, muitas vezes dependentes de esforços isolados, sem definição clara de indicadores, metas estruturadas ou responsabilidades institucionais formalizadas.\n\nSob a perspectiva da bioeconomia, este estágio representa uma oportunidade estratégica para aprofundar a compreensão sobre os fluxos de recursos utilizados no modelo de negócio, origem de matérias-primas, eficiência produtiva, geração de resíduos, potencial de circularidade e impactos territoriais relacionados às atividades da organização. Empresas que iniciam esse mapeamento tendem a desenvolver maior capacidade de adaptação às exigências emergentes relacionadas à rastreabilidade, sustentabilidade produtiva e inovação orientada à transição ecológica.\n\nA organização poderá se beneficiar da construção de mecanismos iniciais de gestão ESG, incluindo definição de responsabilidades, desenvolvimento de políticas internas, estabelecimento de objetivos progressivos e implementação de indicadores básicos de acompanhamento. O fortalecimento dessa estrutura tende a favorecer maior previsibilidade operacional, mitigação de riscos e melhor alinhamento às exigências de cadeias produtivas, programas de inovação, ambientes de aceleração e oportunidades associadas à economia sustentável.\n\nÀ medida que a maturidade evolui, organizações neste nível podem ampliar gradualmente sua competitividade em mercados que valorizam transparência, sustentabilidade e inovação responsável, fortalecendo sua elegibilidade para parcerias estratégicas, editais de fomento, investimentos orientados a impacto e mecanismos de financiamento vinculados à inovação sustentável, conforme setor de atuação e grau de maturidade alcançado.",
    recommendation: "Priorizar a integração das práticas ESG e bioeconômicas ao modelo de gestão, estabelecendo metas, indicadores e mecanismos de monitoramento contínuo, além de fortalecer processos internos relacionados à governança, gestão de riscos, cadeia de valor e tomada de decisão sustentável."
  },
  3: {
    name: "Nível 3 – Gerencial",
    description: "O presente diagnóstico indica que a organização apresenta um nível gerencial de maturidade ESG e bioeconômica, demonstrando integração progressiva dos princípios de sustentabilidade ao modelo de gestão e às operações organizacionais.\n\nNeste estágio, observam-se processos mais estruturados, mecanismos de controle definidos e uma compreensão ampliada sobre os impactos ambientais, sociais, econômicos e de governança relacionados ao negócio e à cadeia de valor.\n\nA organização evidencia maior capacidade de planejamento e execução de práticas sustentáveis, incorporando progressivamente critérios ESG nos processos de tomada de decisão, gestão de pessoas, relacionamento com stakeholders, cadeia produtiva e monitoramento de riscos e oportunidades. Este estágio representa um marco relevante de maturidade, uma vez que as ações deixam de ocorrer de forma isolada e passam a compor uma lógica organizacional mais integrada e orientada à melhoria contínua.\n\nSob a perspectiva da bioeconomia, observa-se potencial para consolidação de estratégias voltadas ao uso mais eficiente de recursos, valorização de ativos biológicos, redução de desperdícios, rastreabilidade de processos e fortalecimento de práticas relacionadas à circularidade, regeneração e inovação sustentável. Empresas neste nível tendem a desenvolver maior capacidade de adaptação às demandas emergentes por modelos produtivos mais resilientes, eficientes e alinhados às transformações da economia verde.\n\nA organização poderá se beneficiar da ampliação de mecanismos de monitoramento e mensuração de desempenho ESG e bioeconômico, incluindo definição de indicadores-chave, estabelecimento de metas progressivas e fortalecimento de instrumentos de transparência, como relatórios internos ou demonstrações periódicas de resultados. A consolidação desses mecanismos favorece maior previsibilidade organizacional, mitigação de riscos operacionais e reputacionais, além de fortalecer a credibilidade institucional perante parceiros estratégicos.\n\nÀ medida que a maturidade evolui, empresas neste nível tendem a ampliar sua competitividade e capacidade de inserção em mercados que demandam maior conformidade socioambientais, rastreabilidade e inovação responsável. Esse avanço pode fortalecer o acesso a ambientes de aceleração, programas de inovação, cadeias produtivas sustentáveis, investimentos orientados à sustentabilidade e oportunidades vinculadas à transição para modelos econômicos de menor impacto socioambiental.",
    recommendation: "Fortalecer a integração dos critérios ESG e bioeconômicos à estratégia organizacional, ampliando a gestão de riscos e oportunidades, consolidando indicadores de desempenho e promovendo maior alinhamento entre sustentabilidade, inovação e geração de valor para stakeholders e cadeia de valor."
  },
  4: {
    name: "Nível 4 – Estratégico",
    description: "O presente diagnóstico indica que a organização apresenta um nível estratégico de maturidade ESG e bioeconômica, incorporando de maneira consistente princípios ambientais, sociais, de governança e sustentabilidade produtiva aos processos decisórios e ao direcionamento do negócio.\n\nNeste estágio, a sustentabilidade deixa de representar apenas um conjunto de práticas operacionais e passa a constituir um elemento estratégico relevante para geração de valor, mitigação de riscos e fortalecimento da competitividade organizacional.\n\nA organização demonstra capacidade de integrar critérios ESG à gestão de riscos e oportunidades, considerando impactos positivos e negativos associados às suas operações, cadeia de suprimentos, stakeholders e contexto territorial em que está inserida. Observa-se maior alinhamento entre propósito organizacional, desempenho econômico e responsabilidade socioambiental, favorecendo tomadas de decisão mais resilientes e orientadas ao longo prazo.\n\nSob a perspectiva da bioeconomia, este estágio evidencia potencial para fortalecimento de estratégias relacionadas ao uso eficiente de recursos biológicos, valorização da biodiversidade, circularidade produtiva, rastreabilidade, inovação regenerativa e desenvolvimento de soluções alinhadas à transição para modelos econômicos de menor impacto ambiental. Organizações neste nível tendem a demonstrar maior capacidade de adaptação às exigências emergentes de mercados sustentáveis, especialmente aqueles vinculados à agricultura sustentável, biotecnologia, economia circular, carbono, bioinsumos e cadeias produtivas regenerativas.\n\nA consolidação de mecanismos de monitoramento, metas e indicadores permite maior previsibilidade sobre resultados socioambientais e econômicos, fortalecendo a governança organizacional, a transparência e a capacidade de resposta diante de transformações regulatórias e mercadológicas. Neste estágio, observa-se maior potencial para geração de inovação orientada à sustentabilidade, desenvolvimento de diferenciais competitivos e fortalecimento da reputação institucional perante clientes, investidores, parceiros e ecossistemas de inovação.\n\nÀ medida que a maturidade evolui, organizações neste nível tendem a ampliar sua inserção em mercados de maior valor agregado, cadeias globais mais exigentes e oportunidades associadas à inovação sustentável, incluindo programas de aceleração, investimentos de impacto, instrumentos financeiros voltados à transição verde, parcerias estratégicas e mecanismos de reconhecimento em sustentabilidade, conforme aderência setorial e evolução do modelo de gestão.",
    recommendation: "Consolidar a sustentabilidade como eixo estruturante do modelo de negócio, ampliando a influência positiva sobre stakeholders, cadeia de valor e ecossistemas de inovação, bem como fortalecer práticas regenerativas, métricas de impacto e mecanismos de colaboração interinstitucional para geração de valor compartilhado."
  },
  5: {
    name: "Nível 5 – Transformador",
    description: "O presente diagnóstico indica que a organização apresenta um nível transformador de maturidade ESG e bioeconômica, posicionando a sustentabilidade como elemento estruturante do modelo de negócio, da cultura organizacional e da estratégia de longo prazo.\n\nNeste estágio, os princípios ambientais, sociais, de governança e bioeconomia encontram-se amplamente integrados às operações, à tomada de decisão, à inovação e às relações estabelecidas ao longo da cadeia de valor.\n\nA organização demonstra elevada capacidade de antecipação frente a riscos emergentes, mudanças regulatórias, transformações climáticas e novas exigências de mercado, utilizando os critérios ESG não apenas como instrumento de conformidade, mas como mecanismo de geração de valor, diferenciação competitiva e fortalecimento da resiliência organizacional. Observa-se uma atuação orientada ao impacto positivo, com práticas estruturadas de monitoramento, transparência, governança e melhoria contínua, associadas à geração de benefícios compartilhados para stakeholders e territórios de atuação.\n\nSob a perspectiva da bioeconomia, este estágio reflete uma integração avançada de princípios relacionados ao uso sustentável e regenerativo de recursos biológicos, inovação baseada em biodiversidade, circularidade, rastreabilidade, eficiência produtiva e valorização dos ativos naturais e territoriais. Organizações neste nível tendem a desenvolver soluções capazes de contribuir para novos modelos produtivos, promovendo não apenas redução de impactos negativos, mas também restauração, regeneração e fortalecimento de ecossistemas econômicos, sociais e ambientais.\n\nA organização apresenta potencial para exercer influência positiva sobre fornecedores, parceiros, clientes, comunidades, ambientes de inovação e demais atores do ecossistema, estimulando a adoção de práticas sustentáveis e ampliando a geração de valor compartilhado. Nesse estágio, a sustentabilidade tende a ser percebida como vantagem competitiva estratégica e elemento central para expansão organizacional, reputação institucional e consolidação de liderança em mercados emergentes associados à transição verde, economia circular, bioeconomia, agricultura regenerativa, biotecnologia e soluções climáticas.\n\nÀ medida que consolida sua maturidade, a organização pode ampliar sua capacidade de inserção em cadeias globais de maior valor agregado, programas internacionais de inovação, investimentos orientados à sustentabilidade, instrumentos financeiros vinculados a impacto, certificações avançadas e parcerias multissetoriais voltadas à transformação sistêmica. Ressalta-se que tais oportunidades variam conforme o setor de atuação, contexto regulatório, capacidade operacional e consistência das evidências relacionadas ao desempenho ESG e bioeconômico.",
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

  const scoreGeral = model.globalScore ?? 0;
  const scoreComprovado = model.globalProvenScore ?? 0;
  const hasVerifiedScore = scoreComprovado > 0;
  const isPreDiagnostic = model.isPreDiagnostic ?? false;

  // Maturity classification helper
  let classification = "";
  let levelIndex = 1;
  if (scoreGeral >= 90) {
    classification = "Nível 5 – Transformador";
    levelIndex = 5;
  } else if (scoreGeral >= 80) {
    classification = "Nível 4 – Estratégico";
    levelIndex = 4;
  } else if (scoreGeral >= 60) {
    classification = "Nível 3 – Gerencial";
    levelIndex = 3;
  } else if (scoreGeral >= 40) {
    classification = "Nível 2 – Estruturante";
    levelIndex = 2;
  } else {
    classification = "Nível 1 – Elementar";
    levelIndex = 1;
  }

  // Helper to add a new page and reset Y coordinate
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 25) {
      doc.addPage();
      y = 25;
      drawHeaderFooter();
    }
  };

  // Helper to draw clean header and footer decoration
  const drawHeaderFooter = () => {
    const pageCount = doc.internal.pages.length - 1;
    if (pageCount <= 1) return; // Skip cover page (page 1)

    // Header thin green line
    doc.setDrawColor(5, 150, 105); // emerald-600
    doc.setLineWidth(0.5);
    doc.line(margin, 15, pageWidth - margin, 15);

    // Header Title
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Relatório de Maturidade ESG & Bioeconomia", margin, 11);
    doc.text(companyName, pageWidth - margin - doc.getTextWidth(companyName), 11);

    // Footer page number
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.text(
      `InoveESG - Relatório de Desempenho | Página ${pageCount}`,
      margin,
      pageHeight - 9
    );
    doc.text(
      "Confidencial",
      pageWidth - margin - doc.getTextWidth("Confidencial"),
      pageHeight - 9
    );
  };

  const startNewPage = () => {
    doc.addPage();
    y = 25;
    drawHeaderFooter();
  };

  const drawSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text(title, margin, y);
    
    // Line below section title
    doc.setDrawColor(209, 250, 229); // emerald-100
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2.5, pageWidth - margin, y + 2.5);
    y += 10;
  };

  const drawParagraphs = (text: string, fontSize: number = 9.5, textColor: [number, number, number] = [71, 85, 105]) => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const paragraphs = text.split(/\n\s*\n/);
    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      const lines = doc.splitTextToSize(trimmed, contentWidth);
      const needed = lines.length * 4.5 + 6;
      checkPageBreak(needed);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 6;
    });
  };

  // 1. Draw Cover
  const drawCover = () => {
    // Primary Header Background (emerald banner)
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.rect(0, 0, pageWidth, 55, "F");

    // Title inside the banner
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    const titleText = isSupplierOrg 
      ? "RELATÓRIO DE AVALIAÇÃO ESG DO FORNECEDOR"
      : "RELATÓRIO DE SUSTENTABILIDADE & MATURIDADE ESG";
    doc.text(titleText, margin, 24, { maxWidth: contentWidth });

    // Subtitle inside the banner
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("Metodologia de Classificação e Diagnóstico de Impacto", margin, 42);

    y = 75;

    // Beautiful central card/graphic
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(1);
    doc.rect(margin, y, contentWidth, 65, "FD");

    // Title inside the central box
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text("DIAGNÓSTICO CORPORATIVO INOVE ESG", margin + 10, y + 15);

    // Decorative text
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600
    const infoText = isSupplierOrg 
      ? "Este documento consolida as informações socioambientais do fornecedor para fins de homologação e análise de risco na cadeia de suprimentos."
      : "Este documento apresenta a análise de conformidade, classificação de maturidade e plano estratégico da organização em relação aos pilares de Sustentabilidade Ambiental, Social, Governança e Bioeconomia Circular.";
    doc.text(
      infoText,
      margin + 10,
      y + 25,
      { maxWidth: contentWidth - 20 }
    );

    // Badge
    if (hasVerifiedScore) {
      doc.setFillColor(209, 250, 229); // emerald-100
      doc.setDrawColor(5, 150, 105); // emerald-600
      doc.rect(margin + 10, y + 45, contentWidth - 20, 12, "FD");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text("✓ STATUS: RELATÓRIO AUDITADO E VERIFICADO", margin + 15, y + 52.5);
    } else {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(217, 119, 6); // amber-600
      doc.rect(margin + 10, y + 45, contentWidth - 20, 12, "FD");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(146, 64, 14); // amber-800
      
      let badgeText = "⚠ STATUS: PRÉ-DIAGNÓSTICO DECLARATÓRIO";
      if (isSupplierOrg) {
        badgeText = "⚠ STATUS: RELATÓRIO DECLARATÓRIO";
      } else if (!isPreDiagnostic) {
        badgeText = "⚠ STATUS: DIAGNÓSTICO DECLARATÓRIO";
      }
      doc.text(badgeText, margin + 15, y + 52.5);
    }

    y = 160;

    // Organization details metadata box
    doc.setFillColor(255, 255, 255); 
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(margin, y, contentWidth, 50, "D");

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(isSupplierOrg ? "Fornecedor:" : "Organização:", margin + 8, y + 10);
    doc.setFont("Helvetica", "normal");
    doc.text(companyName, margin + 45, y + 10);

    doc.setFont("Helvetica", "bold");
    doc.text("CNPJ:", margin + 8, y + 18);
    doc.setFont("Helvetica", "normal");
    doc.text(cnpj, margin + 45, y + 18);

    doc.setFont("Helvetica", "bold");
    doc.text("Segmento:", margin + 8, y + 26);
    doc.setFont("Helvetica", "normal");
    doc.text(segment, margin + 45, y + 26);

    doc.setFont("Helvetica", "bold");
    doc.text("Data de Emissão:", margin + 8, y + 34);
    doc.setFont("Helvetica", "normal");
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(dateStr, margin + 45, y + 34);

    doc.setFont("Helvetica", "bold");
    doc.text("Emitido por:", margin + 8, y + 42);
    doc.setFont("Helvetica", "normal");
    doc.text("Plataforma InoveESG (InoveESG S.A.)", margin + 45, y + 42);
  };

  // Start PDF Creation with Cover
  drawCover();

  if (isSupplierOrg) {
    // ── Supplier flow ──
    startNewPage();
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

  // PAGE 2: Metodologia (Dimensões)
  startNewPage();
  drawSectionTitle("1. Metodologia de Classificação da Maturidade ESG e Bioeconômica");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Como a INOVE ESG determina seu nível de maturidade?", margin, y);
  y += 6;

  const methodologyText = `A avaliação de maturidade da INOVE ESG foi desenvolvida para mensurar, de forma estruturada, objetiva e comparável, o estágio de desenvolvimento das práticas de sustentabilidade das organizações, tendo como referência os princípios da ABNT PR 2030 – Conceitos, Diretrizes e Modelo de Avaliação ESG para Organizações, complementados por critérios técnicos relacionados à bioeconomia, gestão organizacional, cadeia de valor e melhoria contínua.

O resultado apresentado neste relatório não representa uma percepção subjetiva sobre a organização, mas sim a aplicação de uma metodologia técnica baseada nas informações fornecidas durante o ${isPreDiagnostic ? "Pré-Diagnóstico" : "Diagnóstico"} de Sustentabilidade.

A avaliação considera o desempenho da organização em quatro dimensões fundamentais:`;

  drawParagraphs(methodologyText, 9.5, [71, 85, 105]);

  const dimensions = [
    { name: "Ambiental (E)", desc: "Gestão dos impactos ambientais, eficiência no uso de recursos naturais, mudanças climáticas, resíduos, emissões, biodiversidade e conformidade ambiental." },
    { name: "Social (S)", desc: "Pessoas, saúde e segurança, direitos humanos, diversidade, relacionamento com colaboradores, clientes, fornecedores e comunidades." },
    { name: "Governança (G)", desc: "Estrutura de gestão, ética, conformidade, transparência, gestão de riscos, controles internos e tomada de decisão." },
    { name: "Bioeconomia (B)", desc: "Uso sustentável de recursos biológicos, inovação, circularidade, rastreabilidade, regeneração, valorização da biodiversidade e desenvolvimento de soluções sustentáveis." }
  ];

  dimensions.forEach((dim) => {
    const nameLines = doc.splitTextToSize(dim.name, 40);
    const descLines = doc.splitTextToSize(dim.desc, contentWidth - 45);
    const maxLines = Math.max(nameLines.length, descLines.length);
    const needed = maxLines * 4.5 + 6;
    checkPageBreak(needed);
    
    let color = [100, 116, 139]; 
    if (dim.name.startsWith("Ambiental")) color = [5, 150, 105]; // Emerald
    else if (dim.name.startsWith("Social")) color = [37, 99, 235]; // Blue
    else if (dim.name.startsWith("Governança")) color = [124, 58, 237]; // Violet
    else if (dim.name.startsWith("Bioeconomia")) color = [217, 119, 6]; // Amber
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(1.2);
    doc.line(margin, y, margin, y + needed - 4);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(nameLines, margin + 4, y + 3.5);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(descLines, margin + 42, y + 3.5);
    
    y += needed;
  });

  // PAGE 3: Metodologia (Processo e Interpretação)
  startNewPage();
  drawSectionTitle("1. Metodologia de Classificação (Continuação)");

  const methodologyText2 = `Cada resposta do questionário é analisada segundo critérios técnicos de maturidade organizacional, refletindo o grau de desenvolvimento das práticas existentes na empresa.

A classificação final é obtida por meio da metodologia proprietária da INOVE ESG, que considera, entre outros fatores:`;

  drawParagraphs(methodologyText2, 9.5, [71, 85, 105]);

  const factors = [
    "Nível de estruturação das práticas implementadas;",
    "Grau de formalização dos processos;",
    "Consistência entre os diferentes critérios avaliados;",
    "Equilíbrio entre os quatro pilares da sustentabilidade;",
    "Integração das práticas à gestão e à estratégia organizacional;",
    "Capacidade de evolução e melhoria contínua."
  ];

  factors.forEach((f) => {
    const lines = doc.splitTextToSize(`•  ${f}`, contentWidth - 10);
    const needed = lines.length * 4.5 + 2;
    checkPageBreak(needed);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(lines, margin + 4, y + 3.5);
    y += needed;
  });

  y += 4;

  const methodologyText3 = `O resultado é consolidado em um Índice Geral de Maturidade ESG e Bioeconômica, representado por uma escala evolutiva composta por cinco níveis de maturidade.

Mais do que atribuir uma classificação, a metodologia busca identificar oportunidades de desenvolvimento, permitindo que a organização compreenda seu estágio atual e estabeleça um plano estruturado de evolução em direção a níveis mais elevados de desempenho sustentável.

O nível apresentado neste relatório representa exclusivamente a situação observada no momento da avaliação, considerando as informações disponibilizadas pela organização durante o ${isPreDiagnostic ? "Pré-Diagnóstico" : "Diagnóstico"}. A evolução do índice dependerá da implementação de melhorias, da consolidação de processos e da apresentação de evidências que demonstrem a maturidade das práticas adotadas.`;

  drawParagraphs(methodologyText3, 9.5, [71, 85, 105]);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Como interpretar sua pontuação?", margin, y);
  y += 6;

  const interpretText = `Cada um dos quatro pilares avaliados possui critérios específicos que analisam diferentes aspectos da gestão organizacional.

Os gráficos apresentados neste relatório demonstram o percentual de maturidade alcançado em cada pilar, permitindo visualizar os pontos fortes da organização e identificar áreas prioritárias para evolução.

O Índice Geral de Maturidade ESG e Bioeconômica corresponde à consolidação dos resultados obtidos nos quatro pilares avaliados e representa o nível global de desenvolvimento da organização em sustentabilidade.

A análise individual de cada dimensão possibilita direcionar investimentos, priorizar ações de melhoria e fortalecer processos capazes de gerar maior competitividade, redução de riscos e criação de valor para clientes, investidores, parceiros e demais stakeholders.`;

  drawParagraphs(interpretText, 9.5, [71, 85, 105]);

  // PAGE 4: Escala de Maturidade
  startNewPage();
  drawSectionTitle("1. Escala de Maturidade e Nota Metodológica");

  const rows = [
    { nivel: "Nível 1", estagio: "Elementar", caracteristica: "Sensibilização inicial e atendimento aos requisitos básicos de sustentabilidade." },
    { nivel: "Nível 2", estagio: "Estruturante", caracteristica: "Existência de iniciativas relevantes, porém ainda parcialmente integradas à gestão organizacional." },
    { nivel: "Nível 3", estagio: "Gerencial", caracteristica: "Processos estruturados, gestão organizada e integração progressiva dos princípios ESG às operações." },
    { nivel: "Nível 4", estagio: "Estratégico", caracteristica: "Sustentabilidade incorporada ao planejamento estratégico e à geração de valor para o negócio." },
    { nivel: "Nível 5", estagio: "Transformador", caracteristica: "Liderança em sustentabilidade, inovação regenerativa e influência positiva sobre a cadeia de valor e os ecossistemas em que atua." }
  ];

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); 
  doc.text("ESCALA DE MATURIDADE ESG E BIOECONÔMICA", margin, y);
  y += 6;

  // Table Headers
  doc.setFillColor(5, 150, 105); // emerald-600
  doc.rect(margin, y, contentWidth, 8, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Nível", margin + 3, y + 5.5);
  doc.text("Estágio", margin + 28, y + 5.5);
  doc.text("Característica predominante", margin + 63, y + 5.5);
  y += 8;

  // Table Rows
  rows.forEach((row, idx) => {
    const textLines = doc.splitTextToSize(row.caracteristica, 102);
    const rowHeight = Math.max(textLines.length * 4 + 4, 8);
    checkPageBreak(rowHeight);

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(row.nivel, margin + 3, y + 5);
    doc.text(row.estagio, margin + 28, y + 5);

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(textLines, margin + 63, y + 5);

    y += rowHeight;
  });

  y += 12;

  // Nota Metodológica Box
  const noteText = "Nota Metodológica: A metodologia de classificação da INOVE ESG constitui propriedade intelectual da organização e foi desenvolvida com base em princípios de avaliação de maturidade organizacional alinhados à ABNT PR 2030 e a referências nacionais e internacionais em sustentabilidade corporativa.";
  const noteLines = doc.splitTextToSize(noteText, contentWidth - 10);
  const noteBoxHeight = noteLines.length * 4 + 8;
  checkPageBreak(noteBoxHeight);

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.rect(margin, y, contentWidth, noteBoxHeight - 2, "FD");

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(noteLines, margin + 5, y + 4.5);
  y += noteBoxHeight + 5;


  // PAGE 5: Resultados (Nota Geral e Maturidade)
  startNewPage();
  drawSectionTitle("2. Resultados da Avaliação e Pontuação Geral");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    "A pontuação geral representa o índice consolidado alcançado pela organização nos quatro pilares do diagnóstico.",
    margin,
    y
  );
  y += 10;

  // Draw Dynamic Result Box (Verified vs Declarative)
  // Draw Dynamic Result Box (Verified vs Declarative)
  if (hasVerifiedScore) {
    // Verified Unified Box (Premium Green)
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(5, 150, 105); // emerald-600
    doc.rect(margin, y, contentWidth, 34, "FD");
    
    // Left Score Column
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SCORE COMPROVADO", margin + 6, y + 9);
    
    doc.setFontSize(32);
    doc.text(`${scoreComprovado}%`, margin + 6, y + 24);

    // Vertical Divider
    doc.setDrawColor(167, 243, 208); // emerald-200
    doc.setLineWidth(0.5);
    doc.line(margin + 44, y + 6, margin + 44, y + 28);

    // Right Info Column
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("✓ RELATÓRIO AUDITADO E VERIFICADO (SELO ESG)", margin + 50, y + 9);
    
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`Score Declarado Original: ${scoreGeral}%`, margin + 50, y + 15);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      "As práticas de sustentabilidade e as respectivas evidências foram homologadas e auditadas em conformidade com as diretrizes e metodologia da INOVE ESG.",
      margin + 50,
      y + 21,
      { maxWidth: contentWidth - 56 }
    );

    y += 42;

  } else {
    // Declaratório Unified Box (Amber warning)
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(217, 119, 6); // amber-600
    doc.rect(margin, y, contentWidth, 34, "FD");
    
    // Left Score Column
    doc.setTextColor(146, 64, 14); // amber-800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SCORE DECLARADO", margin + 6, y + 9);
    
    doc.setFontSize(32);
    doc.text(`${scoreGeral}%`, margin + 6, y + 24);

    // Vertical Divider
    doc.setDrawColor(251, 191, 36); // amber-400
    doc.setLineWidth(0.5);
    doc.line(margin + 44, y + 6, margin + 44, y + 28);

    // Right Info Column
    doc.setTextColor(146, 64, 14); // amber-800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      isPreDiagnostic
        ? "⚠ PRÉ-DIAGNÓSTICO DECLARATÓRIO"
        : "⚠ DIAGNÓSTICO COMPLETO DECLARATÓRIO",
      margin + 50,
      y + 9
    );
    
    doc.setTextColor(185, 28, 28); // red-700
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("PONTUAÇÃO DECLARATÓRIA (SEM COMPROVAÇÃO DE EVIDÊNCIAS)", margin + 50, y + 15);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 90, 40);
    doc.text(
      "Esta pontuação foi declarada pela própria empresa e não passou por processo de auditoria. Envie evidências formais na plataforma InoveESG para certificar seu score.",
      margin + 50,
      y + 21,
      { maxWidth: contentWidth - 56 }
    );

    y += 42;
  }

  // Pillar scores
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); 
  doc.text("Desempenho por Eixo ESG & Bioeconomia", margin, y);
  y += 8;

  const axisConfigMap = {
    E: { name: "Ambiental (E)", color: [5, 150, 105] as [number, number, number] }, // Emerald
    B: { name: "Bioeconomia Circular (B)", color: [217, 119, 6] as [number, number, number] }, // Amber
    S: { name: "Social (S)", color: [37, 99, 235] as [number, number, number] }, // Blue
    G: { name: "Governança (G)", color: [124, 58, 237] as [number, number, number] } // Violet
  };

  const drawProgressBar = (label: string, score: number, proven: number, barColor: [number, number, number], hasProven: boolean) => {
    checkPageBreak(25);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(label, margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    let valuesStr = `Declarado: ${score}%`;
    if (hasProven) {
      valuesStr += `  |  Comprovado: ${proven}%`;
    }
    doc.text(valuesStr, pageWidth - margin - doc.getTextWidth(valuesStr), y);
    y += 3.5;
    
    // Declared Bar Track
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 2.5, "F");
    // Declared Bar Fill
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.rect(margin, y, (score / 100) * contentWidth, 2.5, "F");
    y += 4;

    // Proven Bar (if applicable)
    if (hasProven) {
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(margin, y, contentWidth, 2.5, "F");
      doc.setFillColor(5, 150, 105); // emerald green
      doc.rect(margin, y, (proven / 100) * contentWidth, 2.5, "F");
      y += 4;
    }
    y += 4; 
  };

  model.axisScores?.forEach((item: any) => {
    const cfg = axisConfigMap[item.axis as keyof typeof axisConfigMap] || { name: item.axis, color: [100, 116, 139] as [number, number, number] };
    drawProgressBar(cfg.name, item.score, item.provenScore, cfg.color, hasVerifiedScore);
  });


  // PAGE 6: Detalhamento do Nível Constatado
  startNewPage();
  drawSectionTitle("3. Análise do Nível de Maturidade Constatado");

  // Nível Constatado Big Header Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, 14, "FD");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`Classificação Obtida: ${classification}`, margin + 5, y + 9);
  y += 22;

  // Level Details paragraphs
  const details = maturityLevels[levelIndex];
  if (details) {
    drawParagraphs(details.description, 9.5, [71, 85, 105]);

    y += 6;

    // Recommendation Strategic Box
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); 
    doc.text("Recomendação Estratégica para Evolução:", margin, y);
    y += 6;

    const recText = details.recommendation;
    const recLines = doc.splitTextToSize(recText, contentWidth - 10);
    const recBoxH = recLines.length * 4.5 + 8;
    checkPageBreak(recBoxH);

    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(167, 243, 208); // emerald-200
    doc.rect(margin, y, contentWidth, recBoxH - 2, "FD");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text("Foco Estratégico sugerido:", margin + 5, y + 5);
    
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(6, 95, 70); 
    // Shift slightly right to accommodate focus title
    doc.text(recLines, margin + 5, y + 11);
    
    y += recBoxH + 5;
  }


  // PAGE 7: Rastreamento da Cadeia de Valor
  startNewPage();
  drawSectionTitle("4. Rastreamento da Cadeia de Valor");

  const invitesList = invites || [];
  const totalInvites = invitesList.length;

  if (totalInvites === 0) {
    // Mapeamento não ativo box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(margin, y, contentWidth, 48, "FD");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Rastreamento da Cadeia de Fornecedores Indisponível", margin + 6, y + 10);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(115, 115, 115);
    const noInvText = "A organização não possui rastreamento da cadeia de valor ativo neste relatório. O mapeamento da cadeia de suprimentos permite monitorar e gerenciar os riscos socioambientais de seus parceiros comerciais, garantindo a conformidade e promovendo a bioeconomia circular ao longo de todo o ciclo de valor.\n\nPara iniciar o monitoramento, adquira convites na plataforma InoveESG e convide seus fornecedores para realizarem o diagnóstico corporativo gratuito.";
    const noInvLines = doc.splitTextToSize(noInvText, contentWidth - 12);
    doc.text(noInvLines, margin + 6, y + 18);
    
    y += 60;
  } else {
    // Mapeamento ativo
    const completedInvites = invitesList.filter(
      (i: any) => i.requestedDiagnostics?.[0]?.status === "COMPLETED"
    );
    const completedCount = completedInvites.length;
    
    let sumScore = 0;
    completedInvites.forEach((i: any) => {
      sumScore += i.requestedDiagnostics?.[0]?.score?.overallScore ?? 0;
    });
    const avgScoreStr = completedCount > 0 ? `${Math.round(sumScore / completedCount)}%` : "—";

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      "O rastreamento da cadeia de fornecedores permite à organização monitorar e gerenciar os riscos socioambientais de seus parceiros comerciais, garantindo a conformidade e promovendo a bioeconomia circular ao longo de todo o ciclo de valor.",
      margin,
      y,
      { maxWidth: contentWidth }
    );
    y += 14;

    // Summary box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, y, contentWidth, 12, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(`Total Mapeados: ${totalInvites}`, margin + 5, y + 8);
    doc.text(`Diagnósticos Concluídos: ${completedCount}`, margin + 62, y + 8);
    doc.text(`Média ESG da Cadeia: ${avgScoreStr}`, margin + 115, y + 8);
    y += 20;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); 
    doc.text("Status dos Fornecedores Conectados:", margin, y);
    y += 6;

    // Draw Table Headers
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    
    doc.text("Fornecedor", margin + 3, y + 5.5);
    doc.text("Segmento", margin + 65, y + 5.5);
    doc.text("Status", margin + 105, y + 5.5);
    doc.text("Nota ESG", margin + 128, y + 5.5);
    doc.text("Classificação de Risco", margin + 148, y + 5.5);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    
    invitesList.forEach((invite: any) => {
      checkPageBreak(12);
      
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
      
      doc.text(nameLines, margin + 3, y + 4.5);
      doc.text(segmentStr, margin + 65, y + 4.5);
      doc.text(statusStr, margin + 105, y + 4.5);
      doc.text(overallScore !== undefined && overallScore !== null ? `${Math.round(overallScore)}%` : "—", margin + 128, y + 4.5);
      doc.text(riskClass, margin + 148, y + 4.5);
      
      y += 10;
    });
  }


  // PAGE 8: Assinaturas
  startNewPage();
  drawSectionTitle("5. Validação e Assinaturas");

  const signIntro = "Este documento atesta a realização da avaliação de maturidade ESG e Bioeconômica pela organização, em conformidade com as informações e evidências declaradas na plataforma de sustentabilidade corporativa InoveESG S.A.";
  drawParagraphs(signIntro, 9.5, [71, 85, 105]);

  y += 15;

  checkPageBreak(65);

  const colW = contentWidth / 2 - 8;

  // Left Block (InoveESG)
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.line(margin, y + 30, margin + colW, y + 30);
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("INOVE ESG TECNOLOGIAS SUSTENTÁVEIS S.A.", margin, y + 35);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Assinatura Eletrônica Registrada", margin, y + 40);
  doc.text("Validador Automático de Conformidade", margin, y + 44);

  // Right Block (Representative)
  const rx = margin + colW + 16;
  doc.line(rx, y + 30, rx + colW, y + 30);
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("REPRESENTANTE LEGAL DA ORGANIZAÇÃO", rx, y + 35);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(companyName, rx, y + 40);
  doc.text("Nome: _________________________________", rx, y + 45);
  doc.text("Cargo: _________________________________", rx, y + 49);

  y += 65;

  // Footer notes at the bottom of signature page
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    "* O relatório constitui declaração de boas práticas da organização, baseando-se nos dados inseridos de forma exclusiva pela mesma durante o período avaliativo.",
    margin,
    pageHeight - 25,
    { maxWidth: contentWidth }
  );

  // Save the Company PDF
  doc.save("relatorio-empresa-esg.pdf");
}
