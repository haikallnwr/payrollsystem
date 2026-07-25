import { useAuth } from "@/providers/auth-provider";
import { useDashboardQuery } from "../hooks/useDashboardQuery";
import { Users, Banknote, Receipt, Clock, ArrowUpRight, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useDashboardQuery();

  const userName = user?.employee?.full_name || user?.email || "User";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100">
            {status}
          </Badge>
        );
      case "PENDING":
      case "DRAFT":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400">
            {status}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-rose-600 border-rose-300 dark:text-rose-400">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statCards = [
    {
      title: "Total Employees",
      value: isLoading ? "..." : (stats?.totalEmployees ?? 0).toString(),
      change: "Active in database",
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Monthly Payroll",
      value: isLoading ? "..." : formatRupiah(stats?.monthlyPayroll.amount ?? 0),
      change: stats?.monthlyPayroll.periodLabel || "Latest period",
      icon: Banknote,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      title: "Pending Claims",
      value: isLoading ? "..." : `${stats?.pendingClaims ?? 0} Requests`,
      change: "Awaiting review",
      icon: Receipt,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      title: "Overtime Hours",
      value: isLoading ? "..." : `${stats?.overtimeHours ?? 0} hrs`,
      change: "Total logged hours",
      icon: Clock,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-500/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">Overview</span>
            <span className="text-xs text-blue-100">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">Welcome back, {userName}!</h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">Live system statistics and payroll summary for your organization.</p>
        </div>

        <div className="flex items-center space-x-3">
          {(user?.role === "ADMIN" || user?.role === "HR") && (
            <Button onClick={() => navigate("/payrolls")} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Generate Payroll
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.title}</span>
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Payroll Runs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Recent Payrolls</CardTitle>
                <CardDescription>Latest generated payroll records</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/payrolls")} className="text-xs">
                View All
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-slate-500">Loading payroll summary...</div>
              ) : isError || !stats?.recentPayrolls || stats.recentPayrolls.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400">No payroll records generated yet.</div>
              ) : (
                <div className="space-y-3">
                  {stats.recentPayrolls.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${p.status === "PAID" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"}`}>
                          {p.status === "PAID" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {monthNames[p.month - 1]} {p.year} — {p.employeeName}
                          </p>
                          <p className="text-xs text-slate-500">{formatRupiah(p.netSalary)}</p>
                        </div>
                      </div>
                      <div>{getStatusBadge(p.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reimbursement Requests */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Recent Reimbursements</CardTitle>
                <CardDescription>Latest claim submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/reimbursements")} className="text-xs">
                View All
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-slate-500">Loading claims...</div>
              ) : isError || !stats?.recentReimbursements || stats.recentReimbursements.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400">No reimbursement claims submitted yet.</div>
              ) : (
                <div className="space-y-3">
                  {stats.recentReimbursements.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {r.title} — {r.employeeName}
                          </p>
                          <p className="text-xs text-slate-500">{formatRupiah(r.amount)}</p>
                        </div>
                      </div>
                      <div>{getStatusBadge(r.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Quick Shortcuts */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <CardDescription>Shortcuts to key system functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(user?.role === "ADMIN" || user?.role === "HR") && (
                <button type="button" onClick={() => navigate("/employees")} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">Employee Directory</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              )}

              <button type="button" onClick={() => navigate("/reimbursements")} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium">Claim Reimbursement</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button type="button" onClick={() => navigate("/overtimes")} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium">Log Overtime</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button type="button" onClick={() => navigate("/payrolls")} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium">Payroll Records</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
