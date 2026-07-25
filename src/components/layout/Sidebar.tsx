import { NavLink } from "react-router";
import { LayoutDashboard, Users, Building2, Briefcase, Receipt, Clock, Banknote, UserCheck, LogOut, ChevronLeft, ChevronRight, UserCog } from "lucide-react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  roles?: string[];
}

const mainNavItems: NavItem[] = [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }];

const managementNavItems: NavItem[] = [
  { title: "Users", href: "/users", icon: UserCog, roles: ["ADMIN"] },
  { title: "Employees", href: "/employees", icon: Users, roles: ["ADMIN", "HR"] },
  { title: "Divisions", href: "/divisions", icon: Building2, roles: ["ADMIN"] },
  { title: "Job Positions", href: "/job-positions", icon: Briefcase, roles: ["ADMIN"] },
];

const financeNavItems: NavItem[] = [
  { title: "Payrolls", href: "/payrolls", icon: Banknote },
  { title: "Reimbursements", href: "/reimbursements", icon: Receipt },
  { title: "Overtimes", href: "/overtimes", icon: Clock },
];

const userNavItems: NavItem[] = [{ title: "Profile", href: "/profile", icon: UserCheck }];

export function Sidebar({ collapsed, setCollapsed, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const userRole = user?.role || "EMPLOYEE";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const filterByRole = (items: NavItem[]) => {
    return items.filter((item) => !item.roles || item.roles.includes(userRole));
  };

  const renderNavGroup = (label: string, items: NavItem[]) => {
    const visibleItems = filterByRole(items);
    if (visibleItems.length === 0) return null;

    return (
      <div className="py-2">
        {!collapsed && <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{label}</h3>}
        <ul className="space-y-1 px-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  onClick={onNavigate}
                  className={({ isActive }) => cn("flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group", isActive ? "bg-emerald-800 text-white shadow-sm shadow-emerald-900/30 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100", collapsed && "justify-center px-2")}
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
  };

  return (
    <aside className={cn("h-screen py-2 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 relative select-none z-20 overflow-hidden", collapsed ? "w-20" : "w-64")}>
      {/* Top Brand Header & Scrollable Nav */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-none">PayPulse</span>
                <span className="text-[10px] font-medium text-slate-400 mt-1 block">Payroll Platform</span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-3">
          {renderNavGroup("Overview", mainNavItems)}
          {renderNavGroup("Management", managementNavItems)}
          {renderNavGroup("Finance & Ops", financeNavItems)}
          {renderNavGroup("User", userNavItems)}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-2" : "")}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <Avatar className="h-9 w-9 bg-emerald-800 text-emerald-800 font-semibold text-xs shrink-0">
              <AvatarFallback>{getInitials(user?.employee?.full_name || user?.email)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.employee?.full_name || user?.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role.toLowerCase()}</p>
              </div>
            )}
          </div>

          <button type="button" onClick={logout} title="Sign out" className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
