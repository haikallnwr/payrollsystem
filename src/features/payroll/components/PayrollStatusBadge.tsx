import { Badge } from "@/components/ui/badge";
import type { PayrollStatus } from "../payroll.type";

interface PayrollStatusBadgeProps {
  status: PayrollStatus;
}

export function PayrollStatusBadge({ status }: PayrollStatusBadgeProps) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge variant="outline" className="text-slate-600 border-slate-300 dark:text-slate-400">
          Draft
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100">
          Approved
        </Badge>
      );
    case "PAID":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          Paid
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100">
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
