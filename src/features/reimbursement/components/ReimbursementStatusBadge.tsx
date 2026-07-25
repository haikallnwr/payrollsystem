import { Badge } from "@/components/ui/badge";
import type { ReimbursementStatus } from "../reimbursement.type";

interface ReimbursementStatusBadgeProps {
  status: ReimbursementStatus;
}

export function ReimbursementStatusBadge({ status }: ReimbursementStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-amber-600 border-amber-600 text-white hover:bg-amber-700">
          Pending Review
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700">
          Approved
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
