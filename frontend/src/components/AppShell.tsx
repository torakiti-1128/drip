import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChartNoAxesColumn, FileText, Settings } from "lucide-react";

import { useAuthContext } from "./auth-context";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";

const navigationItems = [
  { to: "/", label: "ダッシュボード", icon: ChartNoAxesColumn },
  { to: "/editor", label: "日報入力", icon: FileText },
  { to: "/settings", label: "設定", icon: Settings }
];

export function AppShell({ children }: PropsWithChildren) {
  const authState = useAuthContext();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 md:px-8 md:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Card className="rounded-[32px] bg-[var(--surface-strong)]/90">
          <CardContent className="grid gap-5 px-6 py-6 md:grid-cols-[1.4fr_auto_auto] md:items-center md:px-8">
            <Link className="flex flex-col gap-2" to="/">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold tracking-[0.28em] text-[var(--brand)]">
                  DRIP
                </div>
                <Badge variant="outline">Auth Active</Badge>
              </div>
              <div>
                <p className="text-lg font-semibold md:text-xl">Daily Report Insights Pipeline</p>
                <p className="text-sm text-[var(--muted-foreground)]">日報を振り返りではなく、翌日の行動変化につなげる。</p>
              </div>
            </Link>
            <nav aria-label="Global" className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                        isActive
                          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                          : "border-[var(--line)] bg-white/80 text-[var(--muted-foreground)] hover:bg-white hover:text-[var(--foreground)]"
                      )
                    }
                    to={item.to}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <Card className="rounded-[24px] border-none bg-[var(--brand-soft)] shadow-none">
              <CardHeader className="gap-2 p-4">
                <CardDescription>ログイン中アカウント</CardDescription>
                <CardTitle className="text-base md:text-lg">{authState.user?.email}</CardTitle>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
        <section className="grid gap-5">{children}</section>
      </div>
    </div>
  );
}
