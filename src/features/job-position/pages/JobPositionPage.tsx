import { useState } from "react";
import { useJobPositionsQuery } from "../hooks/useJobPositionsQuery";
import type { JobPosition } from "../job-position.type";
import { JobPositionTable } from "../components/JobPositionTable";
import { JobPositionFormDialog } from "../components/JobPositionFormDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function JobPositionPage() {
  const { user } = useAuth();
  const { data: jobPositions = [], isLoading } = useJobPositionsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);

  const handleCreate = () => {
    setSelectedPosition(null);
    setIsOpen(true);
  };

  const handleEdit = (jobPosition: JobPosition) => {
    setSelectedPosition(jobPosition);
    setIsOpen(true);
  };

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Job Positions & Titles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage position levels, division mappings, and default base salary tiers.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
        )}
      </div>

      {/* Main Table */}
      <JobPositionTable
        jobPositions={jobPositions}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      {/* Form Dialog */}
      <JobPositionFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        jobPosition={selectedPosition}
      />
    </div>
  );
}
