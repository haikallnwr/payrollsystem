import { useState } from "react";
import type { Division } from "../division.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DivisionTableProps {
  divisions: Division[];
  isLoading: boolean;
  onEdit?: (division: Division) => void;
  onDelete?: (division: Division) => void;
}

export function DivisionTable({ divisions, isLoading, onEdit, onDelete }: DivisionTableProps) {
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(null);

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
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
            <TableRow>
              <TableHead className="w-20 text-xs font-bold uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Division Name</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Description</TableHead>
              <TableHead className="w-16 text-right text-xs font-bold uppercase tracking-wider"></TableHead>
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
                <TableCell className="text-right">
                  {(onEdit || onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(div)}>
                            <Edit className="w-3.5 h-3.5 mr-2 text-slate-500" />
                            <span>Edit Division</span>
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            {onEdit && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              onClick={() => setDivisionToDelete(div)}
                              className="text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Delete Division</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!divisionToDelete} onOpenChange={(open) => !open && setDivisionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Soft Delete Division?</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Are you sure you want to remove division <strong>{divisionToDelete?.name}</strong>? The division will be soft-deleted and hidden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDivisionToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (divisionToDelete && onDelete) {
                  onDelete(divisionToDelete);
                }
                setDivisionToDelete(null);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
