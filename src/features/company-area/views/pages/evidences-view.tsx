"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { getEvidencesViewModel } from "../../controllers/evidences.controller";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";
import { ChevronDown, ChevronUp, Upload, File, Trash2, Send, Paperclip } from "lucide-react";

type EvidencesViewModel = ReturnType<typeof getEvidencesViewModel>;

interface FileMock {
  name: string;
  size: string;
  uploadedAt: string;
}

export function EvidencesView({ model }: { model: EvidencesViewModel }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Mock files attached to each evidence using title as key
  const [evidenceFiles, setEvidenceFiles] = useState<Record<string, FileMock[]>>({
    "Relatório de consumo energético": [{ name: "energia_q1_2026.pdf", size: "2.4 MB", uploadedAt: "15 abr 2026" }],
    "Política de SST": [{ name: "politica_sst_v3.pdf", size: "1.1 MB", uploadedAt: "13 abr 2026" }],
    "Plano preliminar de emissões": [], // Pending
  });

  const toggleRow = (title: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleFileChange = (title: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: "Hoje",
      };
      setEvidenceFiles((prev) => ({
        ...prev,
        [title]: [...(prev[title] || []), newFile],
      }));
    }
  };

  const handleDeleteFile = (title: string, fileName: string) => {
    setEvidenceFiles((prev) => ({
      ...prev,
      [title]: prev[title].filter((f) => f.name !== fileName),
    }));
  };

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Documentação"
        title="Biblioteca de evidências"
        description="Gerencie anexos por pergunta para auditoria e rastreabilidade do diagnóstico."
        action={<Button className="bg-emerald-600 hover:bg-emerald-700 text-white"><Upload className="h-4 w-4 mr-2" /> Novo upload</Button>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Evidências totais</p>
          <p className="mt-2 text-3xl font-semibold">{model.total}</p>
        </article>
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Pendentes de envio</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{model.pendingReview}</p>
        </article>
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Enviadas</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{model.total - model.pendingReview}</p>
        </article>
      </section>

      {/* Mobile Card List */}
      <section className="space-y-4 md:hidden">
        {model.items.map((item) => {
          const isExpanded = expandedRows[item.title];
          const files = evidenceFiles[item.title] || [];
          const isCompleted = item.status === "validado";

          return (
            <div key={item.id} className="bg-white/75 border border-border rounded-lg shadow-sm p-4 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500">Eixo: {item.axis}</p>
                </div>
                <div className="flex-shrink-0">
                  <StatusPill status={isCompleted ? "concluido" : "pendente"} />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Arquivos: {files.length}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRow(item.title)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8"
                >
                  {isExpanded ? (
                    <>Recolher <ChevronUp className="ml-1 h-3.5 w-3.5" /></>
                  ) : (
                    <>Ver <ChevronDown className="ml-1 h-3.5 w-3.5" /></>
                  )}
                </Button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="pt-3 border-t border-border space-y-3">
                  {/* File List */}
                  {files.length > 0 ? (
                    <div className="space-y-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded-md shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-emerald-50 rounded-md">
                              <Paperclip className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{file.name}</p>
                              <p className="text-[10px] text-slate-400">{file.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(item.title, file.name)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white border border-dashed border-slate-300 rounded-md">
                      <Paperclip className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Nenhum arquivo anexado ainda.</p>
                    </div>
                  )}

                  {/* Upload and Submit Actions */}
                  <div className="flex flex-col space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="file"
                        id={`file-upload-mobile-${item.id}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(item.title, e)}
                        accept=".pdf,.docx,.xlsx"
                      />
                      <Button
                        size="sm"
                        onClick={() => document.getElementById(`file-upload-mobile-${item.id}`)?.click()}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        Selecionar
                      </Button>
                      <span className="text-[10px] text-slate-400">PDF, DOCX, XLSX</span>
                    </div>

                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white w-full text-xs"
                      disabled={files.length === 0}
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Desktop Table */}
      <section className="hidden md:block overflow-x-auto border border-border bg-white/75 rounded-lg shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="border-b border-border bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-foreground/55">
            <tr>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Eixo</th>
              <th className="px-6 py-4 hidden md:table-cell">Responsável</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {model.items.map((item) => {
              const isExpanded = expandedRows[item.title];
              const files = evidenceFiles[item.title] || [];
              const isCompleted = item.status === "validado";

              return (
                <React.Fragment key={item.id}>
                  <tr className={`border-b border-border/70 hover:bg-slate-50/50 transition-colors ${isExpanded ? "bg-slate-50/50" : ""}`}>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.title}</td>
                    <td className="px-6 py-4 text-slate-600">{item.axis}</td>
                    <td className="px-6 py-4 text-slate-600 hidden md:table-cell">{item.owner}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={isCompleted ? "concluido" : "pendente"} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(item.title)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        {isExpanded ? (
                          <>Recolher <ChevronUp className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>Ver ({files.length}) <ChevronDown className="ml-1 h-4 w-4" /></>
                        )}
                      </Button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-slate-50/30 border-b border-border/70">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="space-y-4">
                          {/* File List */}
                          {files.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arquivos Anexados</p>
                              {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-emerald-50 rounded-md">
                                      <Paperclip className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                      <p className="text-xs text-slate-400">{file.size} • Upload em {file.uploadedAt}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteFile(item.title, file.name)}
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-white border border-dashed border-slate-300 rounded-md">
                              <Paperclip className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">Nenhum arquivo anexado ainda.</p>
                              <p className="text-xs text-slate-400">Suba os arquivos necessários para esta evidência.</p>
                            </div>
                          )}

                          {/* Upload and Submit Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                id={`file-upload-desktop-${item.id}`}
                                className="hidden"
                                onChange={(e) => handleFileChange(item.title, e)}
                                accept=".pdf,.docx,.xlsx"
                              />
                              <Button
                                size="sm"
                                onClick={() => document.getElementById(`file-upload-desktop-${item.id}`)?.click()}
                                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                              >
                                <Upload className="h-4 w-4 mr-2 text-slate-500" />
                                Selecionar
                              </Button>
                              <span className="text-xs text-slate-400">PDF, DOCX, XLSX</span>
                            </div>

                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              disabled={files.length === 0}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Enviar
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
