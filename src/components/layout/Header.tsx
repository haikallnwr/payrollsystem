import { Menu, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Breadcrumbs } from "./Breadcrumbs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "HR":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
      {/* Left Area: Mobile Drawer Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <Breadcrumbs />
      </div>

      {/* Right Area: Role Badge & Profile Dropdown */}
      <div className="flex items-center space-x-3">
        {user?.role && (
          <Badge
            variant="outline"
            className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 border ${getRoleBadgeVariant(
              user.role
            )}`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {user.role}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Avatar className="h-8 w-8 bg-blue-600 text-white font-semibold text-xs">
              <AvatarFallback>
                {getInitials(user?.employee?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.employee?.full_name || user?.email}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon className="w-4 h-4 mr-2" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
