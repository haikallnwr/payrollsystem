import { Badge } from "@/components/ui/badge";
import type { PayrollStatus } from "../payroll.type";

interface PayrollStatusBadgeProps {
  status: PayrollStatus;
}

export function PayrollStatusBadge({ status }: PayrollStatusBadgeProps) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge className="bg-slate-600 border-slate-600 text-white hover:bg-slate-700">
          Draft
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700">
          Approved
        </Badge>
      );
    case "PAID":
      return (
        <Badge className="bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700">
          Paid
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-rose-600 border-rose-600 text-white hover:bg-rose-700">
          Rejected
        </Badge>
      );
    default:
      return <Badge className="bg-slate-700 border-slate-700 text-white">{status}</Badge>;
  }
}
