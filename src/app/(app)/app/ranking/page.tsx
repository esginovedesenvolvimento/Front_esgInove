"use client";

import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Leaf, 
  Heart, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Sparkles, 
  Award,
  ChevronRight,
  TrendingDown,
  Recycle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RankedSupplier {
  rank: number;
  name: string;
  tradeName: string;
  sector: string;
  overallScore: number;
  environmentalScore: number;
  bioeconomyScore: number;
  socialScore: number;
  governanceScore: number;
  status: "verified" | "declared";
  maturityLevel: string;
}

const mockSuppliers: RankedSupplier[] = [
  {
    rank: 1,
    name: "EcoLogística S.A.",
    tradeName: "EcoLogística",
    sector: "Logística",
    overallScore: 94,
    environmentalScore: 96,
    bioeconomyScore: 92,
    socialScore: 92,
    governanceScore: 96,
    status: "verified",
    maturityLevel: "Nível 5 — Excelente",
  },
  {
    rank: 2,
    name: "Metais Sustentáveis do Brasil Ltda.",
    tradeName: "Metais Sustentáveis",
    sector: "Indústria",
    overallScore: 89,
    environmentalScore: 92,
    bioeconomyScore: 86,
    socialScore: 88,
    governanceScore: 90,
    status: "verified",
    maturityLevel: "Nível 4 — Avançado",
  },
  {
    rank: 3,
    name: "Papel & Embalagens Circular S/A",
    tradeName: "Papel & Embalagens Circular",
    sector: "Embalagens",
    overallScore: 85,
    environmentalScore: 88,
    bioeconomyScore: 85,
    socialScore: 82,
    governanceScore: 85,
    status: "declared",
    maturityLevel: "Nível 4 — Avançado",
  },
  {
    rank: 4,
    name: "TechGreen Soluções Digitais",
    tradeName: "TechGreen",
    sector: "Tecnologia",
    overallScore: 78,
    environmentalScore: 72,
    bioeconomyScore: 75,
    socialScore: 82,
    governanceScore: 83,
    status: "verified",
    maturityLevel: "Nível 3 — Gerencial",
  },
  {
    rank: 5,
    name: "BioEnergia Nordeste S.A.",
    tradeName: "BioEnergia Nordeste",
    sector: "Energia",
    overallScore: 75,
    environmentalScore: 84,
    bioeconomyScore: 80,
    socialScore: 68,
    governanceScore: 68,
    status: "verified",
    maturityLevel: "Nível 3 — Gerencial",
  },
  {
    rank: 6,
    name: "Serviços de Limpeza & Conservação LimpaMais",
    tradeName: "LimpaMais",
    sector: "Serviços",
    overallScore: 71,
    environmentalScore: 68,
    bioeconomyScore: 64,
    socialScore: 78,
    governanceScore: 74,
    status: "declared",
    maturityLevel: "Nível 3 — Gerencial",
  },
  {
    rank: 7,
    name: "Química Verde Industrial",
    tradeName: "Química Verde",
    sector: "Indústria",
    overallScore: 66,
    environmentalScore: 70,
    bioeconomyScore: 68,
    socialScore: 62,
    governanceScore: 64,
    status: "declared",
    maturityLevel: "Nível 3 — Gerencial",
  },
  {
    rank: 8,
    name: "Transportes Carbono Zero S.A.",
    tradeName: "Transportes Carbono Zero",
    sector: "Logística",
    overallScore: 63,
    environmentalScore: 72,
    bioeconomyScore: 60,
    socialScore: 58,
    governanceScore: 62,
    status: "verified",
    maturityLevel: "Nível 2 — Em Desenvolvimento",
  },
];

export default function RankingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'declared'>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'overall' | 'environmental' | 'social' | 'governance'>('overall');

  // Available sectors for filtering
  const sectors = useMemo(() => {
    const list = new Set(mockSuppliers.map(s => s.sector));
    return Array.from(list);
  }, []);

  // Filtered and sorted list of suppliers
  const filteredSuppliers = useMemo(() => {
    return mockSuppliers
      .filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
        const matchesSector = sectorFilter === 'all' || supplier.sector === sectorFilter;
        return matchesSearch && matchesStatus && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'environmental') return b.environmentalScore - a.environmentalScore;
        if (sortBy === 'social') return b.socialScore - a.socialScore;
        if (sortBy === 'governance') return b.governanceScore - a.governanceScore;
        return b.overallScore - a.overallScore;
      });
  }, [searchTerm, statusFilter, sectorFilter, sortBy]);

  // Top 3 suppliers based on filtered & sorted list
  const topThree = useMemo(() => {
    // Return top 3 from the base mock list sorted by overallScore to keep the podium stable
    const sortedBase = [...mockSuppliers].sort((a, b) => b.overallScore - a.overallScore);
    return {
      first: sortedBase[0],
      second: sortedBase[1],
      third: sortedBase[2],
    };
  }, []);

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold tracking-wider uppercase mb-1">
            <Trophy className="h-4.5 w-4.5" />
            <span>Cadeia de Fornecedores</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Ranking de Fornecedores ESG</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe e compare o desempenho de sustentabilidade e conformidade da sua cadeia de valor.
          </p>
        </div>
      </div>

      {/* Podium Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Destaques da Cadeia (Top 3)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 2nd Place */}
          {topThree.second && (
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm relative flex flex-col justify-between order-2 md:order-1 pt-8 border-t-slate-300 border-t-4">
              <div className="absolute top-0 right-5 transform -translate-y-1/2 bg-slate-300 text-slate-800 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                2º
              </div>
              <div>
                <span className="text-[10px] bg-slate-200/60 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  {topThree.second.sector}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2 line-clamp-1">{topThree.second.tradeName}</h3>
                <p className="text-xs text-slate-400">{topThree.second.maturityLevel}</p>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-extrabold text-slate-800">{topThree.second.overallScore}%</span>
                  <span className="text-xs text-slate-400">Score ESG</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div>
                  <div className="font-semibold text-emerald-600 flex items-center justify-center gap-0.5"><Leaf className="w-3 h-3" /> {topThree.second.environmentalScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Amb</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 flex items-center justify-center gap-0.5"><Heart className="w-3 h-3" /> {topThree.second.socialScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Soc</div>
                </div>
                <div>
                  <div className="font-semibold text-violet-600 flex items-center justify-center gap-0.5"><Scale className="w-3 h-3" /> {topThree.second.governanceScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Gov</div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree.first && (
            <div className="bg-gradient-to-b from-amber-50/40 to-white border border-amber-200 rounded-xl p-5 shadow-md relative flex flex-col justify-between order-1 md:order-2 pt-9 md:-translate-y-2 border-t-amber-400 border-t-4">
              <div className="absolute top-0 right-5 transform -translate-y-1/2 bg-amber-400 text-white text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                👑 1º
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    {topThree.first.sector}
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-2 line-clamp-1">{topThree.first.tradeName}</h3>
                <p className="text-xs text-amber-700/80 font-medium">{topThree.first.maturityLevel}</p>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black text-slate-800">{topThree.first.overallScore}%</span>
                  <span className="text-xs text-slate-400">Score ESG</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-100/50 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div>
                  <div className="font-semibold text-emerald-600 flex items-center justify-center gap-0.5"><Leaf className="w-3 h-3" /> {topThree.first.environmentalScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Amb</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 flex items-center justify-center gap-0.5"><Heart className="w-3 h-3" /> {topThree.first.socialScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Soc</div>
                </div>
                <div>
                  <div className="font-semibold text-violet-600 flex items-center justify-center gap-0.5"><Scale className="w-3 h-3" /> {topThree.first.governanceScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Gov</div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree.third && (
            <div className="bg-gradient-to-b from-orange-50/20 to-white border border-slate-200 rounded-xl p-5 shadow-sm relative flex flex-col justify-between order-3 md:order-3 pt-8 border-t-amber-600 border-t-4">
              <div className="absolute top-0 right-5 transform -translate-y-1/2 bg-amber-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                3º
              </div>
              <div>
                <span className="text-[10px] bg-amber-100/40 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {topThree.third.sector}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2 line-clamp-1">{topThree.third.tradeName}</h3>
                <p className="text-xs text-slate-400">{topThree.third.maturityLevel}</p>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-extrabold text-slate-800">{topThree.third.overallScore}%</span>
                  <span className="text-xs text-slate-400">Score ESG</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div>
                  <div className="font-semibold text-emerald-600 flex items-center justify-center gap-0.5"><Leaf className="w-3 h-3" /> {topThree.third.environmentalScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Amb</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 flex items-center justify-center gap-0.5"><Heart className="w-3 h-3" /> {topThree.third.socialScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Soc</div>
                </div>
                <div>
                  <div className="font-semibold text-violet-600 flex items-center justify-center gap-0.5"><Scale className="w-3 h-3" /> {topThree.third.governanceScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Gov</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tabela de Classificação</h3>
            
            {/* Sorting Tabs */}
            <div className="flex bg-slate-200/60 p-1 rounded-lg text-xs gap-1 self-start">
              <button 
                onClick={() => setSortBy('overall')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${sortBy === 'overall' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Geral
              </button>
              <button 
                onClick={() => setSortBy('environmental')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${sortBy === 'environmental' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Ambiental
              </button>
              <button 
                onClick={() => setSortBy('social')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${sortBy === 'social' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Social
              </button>
              <button 
                onClick={() => setSortBy('governance')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${sortBy === 'governance' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Governança
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
              >
                <option value="all">Todos os Status</option>
                <option value="verified">Verificado</option>
                <option value="declared">Declarado</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sector Select */}
            <div className="relative">
              <select 
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
              >
                <option value="all">Todos os Setores</option>
                {sectors.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5 text-center w-16">Pos</th>
                <th className="px-6 py-3.5">Fornecedor</th>
                <th className="px-6 py-3.5">Setor</th>
                <th className="px-6 py-3.5 text-center">Score Geral</th>
                <th className="px-6 py-3.5 text-center">Ambiental (E)</th>
                <th className="px-6 py-3.5 text-center">Social (S)</th>
                <th className="px-6 py-3.5 text-center">Governança (G)</th>
                <th className="px-6 py-3.5 text-center">Maturidade</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, idx) => {
                  const displayRank = idx + 1;
                  const isTopThree = displayRank <= 3;
                  
                  return (
                    <tr 
                      key={supplier.name}
                      className="hover:bg-slate-50/50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4.5 text-center font-bold">
                        {isTopThree ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs
                            ${displayRank === 1 ? "bg-amber-100 text-amber-800" : ""}
                            ${displayRank === 2 ? "bg-slate-100 text-slate-800" : ""}
                            ${displayRank === 3 ? "bg-amber-50 text-amber-700" : ""}
                          `}>
                            {displayRank}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">{displayRank}</span>
                        )}
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {supplier.tradeName}
                          </span>
                          <span className="text-xs text-slate-400 line-clamp-1">{supplier.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                          {supplier.sector}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{supplier.overallScore}%</span>
                            {supplier.status === 'verified' ? (
                              <span title="Pontuação Homologada e Auditada">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                              </span>
                            ) : (
                              <span title="Informações Declaradas pela Empresa">
                                <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                              </span>
                            )}
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div 
                              className={`h-full rounded-full ${supplier.status === 'verified' ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                              style={{ width: `${supplier.overallScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className="font-semibold text-emerald-600">{supplier.environmentalScore}%</span>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className="font-semibold text-blue-600">{supplier.socialScore}%</span>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className="font-semibold text-violet-600">{supplier.governanceScore}%</span>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className="text-xs text-slate-500 font-medium">{supplier.maturityLevel.split(' — ')[1]}</span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Detalhes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Nenhum fornecedor encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
