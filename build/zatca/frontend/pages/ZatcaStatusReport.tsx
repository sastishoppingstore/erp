import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import {
  Activity, Search, RefreshCw, Loader2, CheckCircle2, XCircle,
  AlertTriangle, Clock, FileText, Eye, Download, ChevronDown, ChevronUp
} from "lucide-react";
import { ZATCA_STATUS_LABELS, ZATCA_STATUS_COLORS } from "../types/zatca";

export default function ZatcaStatusReport() {
  const { data, refetch, isLoading } = trpc.zatca.statusReport.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const toggleRow = (id: number) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedRows(next);
  };

  const filteredRows = (data?.rows || []).filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        String(row.invoiceId).includes(term) ||
        (row.invoiceUuid || "").toLowerCase().includes(term) ||
        (row.invoiceHash || "").toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term)
      );
    }
    return true;
  });

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;

  const statuses = ["all", "draft", "signed", "pending", "submitted", "cleared", "reported", "rejected", "failed"];
  const counts: Record<string, number> = {};
  (data?.rows || []).forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  counts["all"] = (data?.rows || []).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="size-6 text-emerald-600" />
            ZATCA Invoice Status
          </h2>
          <p className="text-slate-500">Track ZATCA clearance and reporting status for all invoices</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="size-4" />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s && s !== "all" ? ZATCA_STATUS_COLORS[s] || "" : ""}
          >
            {ZATCA_STATUS_LABELS[s] || s}
            {counts[s] > 0 && <span className="ml-1 text-xs opacity-70">({counts[s]})</span>}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by invoice ID, UUID, or hash..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-slate-500">{filteredRows.length} of {data?.rows.length || 0} invoices</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="p-3 font-medium text-slate-600 w-8"></th>
                  <th className="p-3 font-medium text-slate-600">Invoice ID</th>
                  <th className="p-3 font-medium text-slate-600">UUID</th>
                  <th className="p-3 font-medium text-slate-600">Counter</th>
                  <th className="p-3 font-medium text-slate-600">Status</th>
                  <th className="p-3 font-medium text-slate-600">Hash (first 16)</th>
                  <th className="p-3 font-medium text-slate-600">Updated</th>
                  <th className="p-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-400">No invoices found</td></tr>
                ) : (
                  filteredRows.map((row) => (
                    <>
                      <tr key={row.id} className="border-b hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <Button variant="ghost" size="icon" className="size-6" onClick={() => toggleRow(row.id)}>
                            {expandedRows.has(row.id) ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </Button>
                        </td>
                        <td className="p-3 font-mono text-xs">{row.invoiceId}</td>
                        <td className="p-3 font-mono text-xs text-slate-500 max-w-[120px] truncate">{row.invoiceUuid || "-"}</td>
                        <td className="p-3">{row.invoiceCounter}</td>
                        <td className="p-3">
                          <Badge className={ZATCA_STATUS_COLORS[row.status] || "bg-slate-100"}>
                            {ZATCA_STATUS_LABELS[row.status] || row.status}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-xs text-slate-500 max-w-[100px] truncate">{row.invoiceHash?.slice(0, 16) || "-"}</td>
                        <td className="p-3 text-xs text-slate-500">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="size-7" title="View details">
                              <Eye className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7" title="Download response">
                              <Download className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(row.id) && (
                        <tr key={`detail-${row.id}`} className="bg-slate-50/80">
                          <td colSpan={8} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <h4 className="font-medium text-slate-700 mb-2">Submission Info</h4>
                                <div className="space-y-1 text-xs">
                                  <div><span className="text-slate-400">Invoice UUID:</span> <span className="font-mono">{row.invoiceUuid || "-"}</span></div>
                                  <div><span className="text-slate-400">Counter:</span> <span>{row.invoiceCounter}</span></div>
                                  <div><span className="text-slate-400">Full Hash:</span> <span className="font-mono text-[10px]">{row.invoiceHash || "-"}</span></div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-700 mb-2">Error Details</h4>
                                {row.errorCode ? (
                                  <div className="space-y-1">
                                    <Badge variant="destructive" className="text-xs">{row.errorCode}</Badge>
                                    <p className="text-xs text-red-600 mt-1">{row.errorMessage || "No details"}</p>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400">No errors</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-700 mb-2">Actions</h4>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline" className="text-xs h-8">Sync Status</Button>
                                  <Button size="sm" variant="outline" className="text-xs h-8">Resubmit</Button>
                                  <Button size="sm" variant="outline" className="text-xs h-8">Download XML</Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><FileText className="size-5" />Recent API Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="p-2 font-medium text-slate-600">Action</th>
                  <th className="p-2 font-medium text-slate-600">Invoice</th>
                  <th className="p-2 font-medium text-slate-600">Environment</th>
                  <th className="p-2 font-medium text-slate-600">Status</th>
                  <th className="p-2 font-medium text-slate-600">HTTP</th>
                  <th className="p-2 font-medium text-slate-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {(data?.logs || []).slice(0, 50).map((log) => (
                  <tr key={log.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-2 font-medium">{log.action.replace(/_/g, " ")}</td>
                    <td className="p-2 font-mono">{log.invoiceId || "-"}</td>
                    <td className="p-2"><Badge variant="outline" className="text-[10px]">{log.environment}</Badge></td>
                    <td className="p-2">
                      {log.status === "success" ? <CheckCircle2 className="size-3.5 text-emerald-600" /> :
                       log.status === "failed" ? <XCircle className="size-3.5 text-red-600" /> :
                       <Clock className="size-3.5 text-amber-500" />}
                    </td>
                    <td className="p-2 font-mono">{log.httpStatus || "-"}</td>
                    <td className="p-2 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {(data?.logs || []).length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-400">No API activity logged yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
