import type { Division } from "../division.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DivisionTableProps {
  divisions: Division[];
  isLoading: boolean;
}

export function DivisionTable({ divisions, isLoading }: DivisionTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (divisions.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No divisions found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Create your first organization division to group job positions and employees.
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
            <TableHead className="text-xs font-bold uppercase tracking-wider">Division Name</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisions.map((div) => (
            <TableRow key={div.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <TableCell className="font-mono text-xs text-slate-500 font-semibold">
                #{div.id}
              </TableCell>
              <TableCell className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {div.name}
              </TableCell>
              <TableCell className="text-xs text-slate-500">
                {div.description || "No description provided."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
