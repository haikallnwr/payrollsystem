import { Badge } from "@/components/ui/badge";
import type { JobLevel } from "../job-position.type";

interface JobLevelBadgeProps {
  level: JobLevel;
}

export function JobLevelBadge({ level }: JobLevelBadgeProps) {
  switch (level) {
    case "JUNIOR":
      return (
        <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100">
          Junior
        </Badge>
      );
    case "MIDDLE":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100">
          Middle
        </Badge>
      );
    case "SENIOR":
      return (
        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100">
          Senior
        </Badge>
      );
    case "LEAD":
      return (
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100">
          Lead
        </Badge>
      );
    case "MANAGER":
      return (
        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100">
          Manager
        </Badge>
      );
    default:
      return <Badge variant="outline">{level}</Badge>;
  }
}
