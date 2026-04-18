"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Home,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: Building },
  { name: "Unit Types", href: "/admin/unit-types", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-72 flex-col border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="font-bold text-lg text-foreground">
            Nairobi City County
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Housing Administration
        </p>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.name === "Projects" && (
                <Badge variant="secondary" className="ml-auto">
                  New
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>© 2025 Nairobi City County</p>
      </div>
    </aside>
  );
}
