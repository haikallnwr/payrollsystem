import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Receipt,
  Clock,
  Banknote,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const managementNavItems: NavItem[] = [
  { title: "Employees", href: "/employees", icon: Users },
  { title: "Divisions", href: "/divisions", icon: Building2 },
  { title: "Job Positions", href: "/job-positions", icon: Briefcase },
];

const financeNavItems: NavItem[] = [
  { title: "Payrolls", href: "/payrolls", icon: Banknote },
  { title: "Reimbursements", href: "/reimbursements", icon: Receipt },
  { title: "Overtimes", href: "/overtimes", icon: Clock },
];

const userNavItems: NavItem[] = [
  { title: "Profile", href: "/profile", icon: UserCheck },
];

export function Sidebar({ collapsed, setCollapsed, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const renderNavGroup = (label: string, items: NavItem[]) => (
    <div className="py-2">
      {!collapsed && (
        <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          {label}
        </h3>
      )}
      <ul className="space-y-1 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100",
                    collapsed && "justify-center px-2"
                  )
                }
                title={collapsed ? item.title : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside
      className={cn(
        "h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 relative select-none z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                  PayPulse
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                  Payroll Platform
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="py-3 overflow-y-auto max-h-[calc(100vh-140px)]">
          {renderNavGroup("Overview", mainNavItems)}
          {renderNavGroup("Management", managementNavItems)}
          {renderNavGroup("Finance & Ops", financeNavItems)}
          {renderNavGroup("User", userNavItems)}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 mb-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-2" : "")}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <Avatar className="h-9 w-9 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-xs shrink-0">
              <AvatarFallback>
                {getInitials(user?.employee?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.employee?.full_name || user?.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
