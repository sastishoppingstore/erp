import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import {
  FileText, CheckCircle2, Clock, XCircle, Receipt, Shield,
  AlertTriangle, BarChart3, TrendingUp
} from "lucide-react";

export function ZatcaDashboardWidgets() {
  const { data, isLoading } = trpc.zatca.dashboard.useQuery();

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="size-5 animate-spin text-slate-400" />
    </div>
  );
  if (!data) return null;

  const widgets = [
    {
      label: "Total Invoices",
      value: data.totalInvoices,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Cleared",
      value: data.clearedInvoices,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: data.pendingInvoices,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Failed",
      value: data.failedInvoices,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <Card className="border-emerald-100">
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-emerald-600" />
          <h3 className="font-semibold">ZATCA Phase 2 Summary</h3>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
          {data.apiStatus}
        </Badge>
      </div>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {widgets.map((w) => (
            <div key={w.label} className={`${w.bg} rounded-lg p-3 border border-slate-100`}>
              <div className="flex items-center justify-between mb-1">
                <w.icon className={`size-4 ${w.color}`} />
              </div>
              <div className="text-2xl font-bold">{w.value}</div>
              <div className="text-xs text-slate-500">{w.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="size-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">VAT Summary</span>
            </div>
            <div className="text-lg font-bold text-emerald-700">
              {new Intl.NumberFormat("en-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 2 }).format(data.vatSummary)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="size-4 text-amber-600" />
              <span className="text-xs font-medium text-slate-600">Certificate Status</span>
            </div>
            <div className={`text-xs font-medium ${data.certificateExpiryWarning?.includes("expires") ? "text-red-600" : "text-emerald-600"}`}>
              {data.certificateExpiryWarning || "N/A"}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="size-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-600">Clearance Rate</span>
            </div>
            <div className="text-lg font-bold text-blue-700">
              {data.totalInvoices > 0
                ? `${((data.clearedInvoices / data.totalInvoices) * 100).toFixed(1)}%`
                : "0%"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ZatcaMiniWidget() {
  const { data, isLoading } = trpc.zatca.dashboard.useQuery();

  if (isLoading || !data) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100 text-xs">
      <Shield className="size-4 text-emerald-600 shrink-0" />
      <div className="flex gap-3">
        <span className="text-slate-600">
          ZATCA: <strong className="text-emerald-700">{data.clearedInvoices}</strong> cleared /
          <strong className="text-amber-700"> {data.pendingInvoices}</strong> pending
        </span>
        <span className="text-slate-400">|</span>
        <span className={data.failedInvoices > 0 ? "text-red-600" : "text-slate-600"}>
          <strong>{data.failedInvoices}</strong> failed
        </span>
      </div>
    </div>
  );
}
