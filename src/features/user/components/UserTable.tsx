import { useState } from "react";
import type { UserItem } from "../user.type";
import { Badge } from "@/components/ui/badge";
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
import { Shield, ShieldAlert, User, CheckCircle2, XCircle, Trash2 } from "lucide-react";

interface UserTableProps {
  users: UserItem[];
  isLoading: boolean;
  onDelete?: (user: UserItem) => void;
}

export function UserTable({ users, isLoading, onDelete }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-600 border-purple-600 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <ShieldAlert className="w-3 h-3 mr-1 text-white" />
            <span>ADMIN</span>
          </Badge>
        );
      case "HR":
        return (
          <Badge className="bg-emerald-800 border-emerald-800 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <Shield className="w-3 h-3 mr-1 text-white" />
            <span>HR</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-700 border-slate-700 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <User className="w-3 h-3 mr-1 text-white" />
            <span>EMPLOYEE</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500">Loading user accounts...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <User className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Users Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          No registered user accounts match your criteria. Create a new user account to grant login access.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">User ID</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Account Email</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Role</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Linked Employee</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Department / Position</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Link Status</TableHead>
              <TableHead className="w-16 text-right font-semibold text-slate-700 dark:text-slate-300"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <TableCell className="font-mono text-xs font-semibold text-slate-500">
                  #{u.id}
                </TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  {u.email}
                </TableCell>
                <TableCell>{getRoleBadge(u.role)}</TableCell>
                <TableCell>
                  {u.employee ? (
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 block">
                        {u.employee.full_name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {u.employee.employee_code}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-400">Unlinked (System User)</span>
                  )}
                </TableCell>
                <TableCell>
                  {u.employee ? (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {u.employee.position_name}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {u.employee.division_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {u.employee ? (
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Linked</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                      <XCircle className="w-4 h-4" />
                      <span>Standalone</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUserToDelete(u)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Soft Delete User Account?</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Are you sure you want to remove user account <strong>{userToDelete?.email}</strong>? The account will be soft-deleted and prevented from logging in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (userToDelete && onDelete) {
                  onDelete(userToDelete);
                }
                setUserToDelete(null);
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
