import { useState } from "react";
import { useDivisionsQuery } from "../hooks/useDivisionsQuery";
import { DivisionTable } from "../components/DivisionTable";
import { DivisionFormDialog } from "../components/DivisionFormDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function DivisionPage() {
  const { user } = useAuth();
  const { data: divisions = [], isLoading } = useDivisionsQuery();
  const [isOpen, setIsOpen] = useState(false);

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Divisions Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage company divisions and department groupings.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Division
          </Button>
        )}
      </div>

      {/* Main Table */}
      <DivisionTable divisions={divisions} isLoading={isLoading} />

      {/* Create Dialog */}
      <DivisionFormDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}
