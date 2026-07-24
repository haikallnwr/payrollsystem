import { Badge } from "@/components/ui/badge";
import type { EmploymentStatus } from "../employee.type";

interface EmployeeStatusBadgeProps {
  status: EmploymentStatus;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          Active
        </Badge>
      );
    case "RESIGNED":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100">
          Resigned
        </Badge>
      );
    case "TERMINATED":
      return (
        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100">
          Terminated
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
