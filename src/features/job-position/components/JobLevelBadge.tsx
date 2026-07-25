import { Badge } from "@/components/ui/badge";
import type { JobLevel } from "../job-position.type";

interface JobLevelBadgeProps {
  level: JobLevel;
}

export function JobLevelBadge({ level }: JobLevelBadgeProps) {
  switch (level) {
    case "JUNIOR":
      return (
        <Badge className="bg-teal-800 border-teal-800 text-white hover:bg-teal-900">
          Junior
        </Badge>
      );
    case "MIDDLE":
      return (
        <Badge className="bg-indigo-800 border-indigo-800 text-white hover:bg-indigo-900">
          Middle
        </Badge>
      );
    case "SENIOR":
      return (
        <Badge className="bg-emerald-900 border-emerald-900 text-white hover:bg-emerald-950">
          Senior
        </Badge>
      );
    case "LEAD":
      return (
        <Badge className="bg-purple-900 border-purple-900 text-white hover:bg-purple-950">
          Lead
        </Badge>
      );
    case "MANAGER":
      return (
        <Badge className="bg-rose-900 border-rose-900 text-white hover:bg-rose-950">
          Manager
        </Badge>
      );
    default:
      return <Badge className="bg-slate-800 border-slate-800 text-white">{level}</Badge>;
  }
}
