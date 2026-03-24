import { CircleDashed, PencilLine } from "lucide-react";

import { AppShell } from "../components/AppShell";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function EditorPage() {
  return (
    <AppShell>
      <Card className="rounded-[32px] bg-[var(--surface-strong)]/95">
        <CardHeader>
          <Badge className="w-fit">Protected Route</Badge>
          <CardTitle className="flex items-center gap-3">
            <PencilLine className="h-6 w-6 text-[var(--brand)]" />
            日報入力画面
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            この画面は認証済みでないと到達できません。issue #13 では、認証通過後の遷移先として editor を保護状態で用意しています。
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "下書き保存と復元は issue #4 で追加",
              "予実時間の集計とタスク行追加も issue #4 で追加"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[24px] border border-[var(--line)] bg-white/80 p-5">
                <CircleDashed className="mt-0.5 h-5 w-5 text-[var(--brand)]" />
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
