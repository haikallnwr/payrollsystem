import { Badge } from "@/components/ui/badge";
import type { ReimbursementStatus } from "../reimbursement.type";

interface ReimbursementStatusBadgeProps {
  status: ReimbursementStatus;
}

export function ReimbursementStatusBadge({ status }: ReimbursementStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400">
          Pending Review
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          Approved
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
