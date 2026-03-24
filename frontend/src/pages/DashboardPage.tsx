import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, BrainCircuit, CalendarRange } from "lucide-react";

import { AppShell } from "../components/AppShell";
import { useAuthContext } from "../components/auth-context";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function DashboardPage() {
  const authState = useAuthContext();

  return (
    <AppShell>
      <Card className="rounded-[32px] bg-[var(--surface-strong)]/95">
        <CardContent className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div className="grid gap-5">
            <Badge className="w-fit">Dashboard</Badge>
            <div className="grid gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {authState.user?.email?.split("@")[0]}さん、今日も進めましょう。
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-base">
                ログイン状態は復元済みです。認証基盤はここで完了し、次の実装では日報入力と可視化カードを具体化していきます。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/editor">
                <Button size="lg">
                  今日の日報を開く
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button size="lg" variant="secondary">
                  設定を確認
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              { label: "次の改善アクション", value: "未実装", icon: BrainCircuit },
              { label: "直近の日報入力", value: "保護済み", icon: BookOpenText },
              { label: "今週の復習導線", value: "次 issue", icon: CalendarRange }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.label} className="rounded-[24px] bg-white/85 shadow-none">
                  <CardContent className="flex items-center gap-4 px-5 py-5">
                    <div className="rounded-2xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.label}</p>
                      <p className="text-lg font-semibold">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
