import { LogOut, ShieldCheck } from "lucide-react";

import { AppShell } from "../components/AppShell";
import { useAuthContext } from "../components/auth-context";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function SettingsPage() {
  const authState = useAuthContext();

  return (
    <AppShell>
      <Card className="rounded-[32px] bg-[var(--surface-strong)]/95">
        <CardHeader>
          <Badge className="w-fit">Account Panel</Badge>
          <CardTitle>設定とアカウント</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 rounded-[24px] border border-[var(--line)] bg-white/80 p-5">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="grid gap-1">
                <p className="text-sm text-[var(--muted-foreground)]">現在のアカウント</p>
                <p className="text-lg font-semibold">{authState.user?.email}</p>
                <p className="text-sm text-[var(--muted-foreground)]">セッションソース: Supabase Auth</p>
              </div>
            </div>
          </div>
          <Button
            className="min-w-44"
            size="lg"
            variant="secondary"
            type="button"
            onClick={() => void authState.signOut()}
            disabled={authState.isSubmitting}
          >
            <LogOut className="h-4 w-4" />
            {authState.isSubmitting ? "ログアウト中..." : "ログアウト"}
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
