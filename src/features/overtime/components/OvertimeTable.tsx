import type { Overtime } from "../overtime.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Edit, Trash2, Lock, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface OvertimeTableProps {
  overtimes: Overtime[];
  isLoading: boolean;
  onEdit: (item: Overtime) => void;
  onDelete: (id: number) => void;
}

export function OvertimeTable({
  overtimes,
  isLoading,
  onEdit,
  onDelete,
}: OvertimeTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  if (overtimes.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No overtime records</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No overtime hours logged for employees yet.
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
            <TableHead className="text-xs font-bold uppercase tracking-wider">Employee</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Hours</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Calculated Pay</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Notes</TableHead>
            <TableHead className="w-16 text-right text-xs font-bold uppercase tracking-wider"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overtimes.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <TableCell className="font-mono text-xs text-slate-500 font-semibold">
                #{item.id}
              </TableCell>

              <TableCell>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {item.employee_name}
                </div>
                <div className="text-xs text-slate-500 font-mono">{item.employee_code}</div>
              </TableCell>

              <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                {formatDate(item.date)}
              </TableCell>

              <TableCell>
                <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                  {item.hours} hrs
                </span>
              </TableCell>

              <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(item.amount)}
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">
                    {item.notes || "No notes"}
                  </span>
                  {item.is_locked && (
                    <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">
                      <Lock className="w-3 h-3 mr-1" />
                      Processed
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {!item.is_locked && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="w-3.5 h-3.5 mr-2 text-slate-500" />
                          <span>Edit Log</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-rose-600">
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
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
