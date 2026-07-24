import type { JobPosition } from "../job-position.type";
import { JobLevelBadge } from "./JobLevelBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Edit, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobPositionTableProps {
  jobPositions: JobPosition[];
  isLoading: boolean;
  onEdit: (jobPosition: JobPosition) => void;
}

export function JobPositionTable({
  jobPositions,
  isLoading,
  onEdit,
}: JobPositionTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (jobPositions.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No job positions found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Create job positions to assign roles and default salary tiers to employees.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
          <TableRow>
            <TableHead className="w-20 text-xs font-bold uppercase tracking-wider">ID</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Position Title</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Level</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Division</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Default Salary</TableHead>
            <TableHead className="w-16 text-right text-xs font-bold uppercase tracking-wider"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPositions.map((pos) => (
            <TableRow key={pos.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <TableCell className="font-mono text-xs text-slate-500 font-semibold">
                #{pos.id}
              </TableCell>
              <TableCell>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {pos.position_name}
                </div>
                {pos.description && (
                  <div className="text-xs text-slate-500 mt-0.5">{pos.description}</div>
                )}
              </TableCell>
              <TableCell>
                <JobLevelBadge level={pos.level} />
              </TableCell>
              <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {pos.division_name}
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(pos.default_salary)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(pos)}>
                      <Edit className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      <span>Edit Position</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
