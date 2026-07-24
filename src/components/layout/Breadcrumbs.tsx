import { useLocation, Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  employees: "Employees",
  create: "Create",
  divisions: "Divisions",
  "job-positions": "Job Positions",
  reimbursements: "Reimbursements",
  overtimes: "Overtimes",
  payrolls: "Payrolls",
  profile: "Profile",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || value;

        return (
          <div key={to} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors capitalize"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
