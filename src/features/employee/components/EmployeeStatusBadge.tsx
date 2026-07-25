import { Badge } from "@/components/ui/badge";
import type { EmploymentStatus } from "../employee.type";

interface EmployeeStatusBadgeProps {
  status: EmploymentStatus;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700">
          Active
        </Badge>
      );
    case "RESIGNED":
      return (
        <Badge className="bg-amber-600 border-amber-600 text-white hover:bg-amber-700">
          Resigned
        </Badge>
      );
    case "TERMINATED":
      return (
        <Badge className="bg-rose-600 border-rose-600 text-white hover:bg-rose-700">
          Terminated
        </Badge>
      );
    default:
      return <Badge className="bg-slate-700 border-slate-700 text-white">{status}</Badge>;
  }
}
