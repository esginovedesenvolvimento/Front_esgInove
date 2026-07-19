"use client";

import { ArrowDownRight, ArrowUpRight, Banknote, Package, ReceiptText, ShoppingCart } from "lucide-react";
import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import { AdminStatusBadge } from "@/features/admin/shared/components/admin-status-badge";
import type { AdminFinanceBoardModel } from "@/features/admin/shared/types";

function orderStatusTone(status: string): "emerald" | "amber" | "rose" | "slate" {
  switch (status) {
    case "PAID":
      return "emerald";
    case "PENDING_PAYMENT":
    case "PARTIALLY_PAID":
      return "amber";
    case "FAILED":
    case "CANCELED":
    case "REFUNDED":
      return "rose";
    default:
      return "slate";
  }
}

function orderStatusLabel(status: string) {
  switch (status) {
    case "PAID":
      return "Pago";
    case "PENDING_PAYMENT":
      return "Aguardando";
    case "PARTIALLY_PAID":
      return "Parcial";
    case "FAILED":
      return "Falhou";
    case "CANCELED":
      return "Cancelado";
    case "REFUNDED":
      return "Estornado";
    default:
      return status;
  }
}

function productTone(active: boolean) {
  return active ? "emerald" : "slate";
}

export function AdminFinanceView({ model }: { model: AdminFinanceBoardModel }) {
  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Financeiro"
        title="Compras, vendas e produtos"
        description="Visão direta da operação financeira do admin, com pedidos, pagamentos confirmados e catálogo de produtos em uma leitura única."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Compras</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Pedidos recebidos</h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {model.purchases.paidOrders} pagos / {model.purchases.pendingOrders} pendentes
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Total</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{model.purchases.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Pagos</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">{model.purchases.paidOrders}</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Pendentes</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-amber-900">{model.purchases.pendingOrders}</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Produtos</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {model.purchases.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{order.organizationName}</div>
                        <div className="text-xs text-slate-500">{order.legalName}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{order.orderType}</td>
                      <td className="px-4 py-4">
                        <div className="max-w-[280px] space-y-1">
                          {order.products.length ? (
                            order.products.slice(0, 3).map((product) => (
                              <p key={product} className="text-sm text-slate-700">{product}</p>
                            ))
                          ) : (
                            <p className="text-sm text-slate-400">Sem itens</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <AdminStatusBadge label={orderStatusLabel(order.status)} tone={orderStatusTone(order.status)} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-semibold text-slate-900">{order.totalValue}</div>
                        <div className="text-xs text-slate-500">{order.paidAt}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Vendas</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Receita confirmada</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              Ticket médio {model.sales.averageTicket}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Banknote className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Receita</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{model.sales.grossRevenue}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <ReceiptText className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Pagamentos</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{model.sales.totalPayments}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Em aberto</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{model.sales.pendingRevenue}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {model.sales.recentPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{payment.organizationName}</p>
                    <p className="text-sm text-slate-300">{payment.method} · {payment.provider}</p>
                    <p className="mt-1 text-xs text-slate-400">Pedido {payment.orderType} · {payment.orderStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{payment.amountValue}</p>
                    <AdminStatusBadge
                      label={orderStatusLabel(payment.status)}
                      tone={orderStatusTone(payment.status)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Produtos</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Catálogo e desempenho</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {model.products.activeProducts} ativos · {model.products.activeSubscriptions} assinaturas
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Pedidos</th>
                  <th className="px-4 py-3 text-right">Receita</th>
                  <th className="px-4 py-3 text-right">Último pedido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {model.products.recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{product.kind}</td>
                    <td className="px-4 py-4 text-center">
                      <AdminStatusBadge
                        label={product.active ? "Ativo" : "Inativo"}
                        tone={productTone(product.active)}
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">
                      {product.orderCount} ({product.paidOrderCount} pagos)
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">{product.grossValue}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{product.lastOrderAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
