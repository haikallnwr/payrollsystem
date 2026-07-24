import { Outlet } from "react-router";
import { ShieldCheck, Banknote, Users, Sparkles } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* Left Branding Panel - Visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12 select-none border-r border-slate-800">
        {/* Subtle Ambient Glowing Backgrounds */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              PayPulse
            </span>
            <span className="text-xs font-medium text-slate-400">
              Enterprise Payroll & HR Suite
            </span>
          </div>
        </div>

        {/* Hero Value Props */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-blue-400 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Generation Payroll Engine</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Streamline your workforce payroll with total precision.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Manage salary components, track overtime requests, process tax deductions, and approve reimbursements seamlessly in one central platform.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Bank-Grade Security</h4>
              <p className="text-xs text-slate-400 mt-1">HttpOnly session security & role privileges.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <Users className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Employee Portal</h4>
              <p className="text-xs text-slate-400 mt-1">Transparent payslip viewing & claim management.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
          <span>&copy; {new Date().getFullYear()} PayPulse Inc. All rights reserved.</span>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-medium">System Operational</span>
          </span>
        </div>
      </div>

      {/* Right Content / Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block">
              PayPulse
            </span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
