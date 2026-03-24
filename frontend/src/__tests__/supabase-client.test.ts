import { describe, expect, it } from "vitest";

import { getSupabaseConfigError } from "../services/supabase-client";

describe("getSupabaseConfigError", () => {
  it("必要な環境変数が揃っていれば null を返す", () => {
    expect(
      getSupabaseConfigError({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toBeNull();
  });

  it("環境変数が不足していれば説明付きエラーを返す", () => {
    expect(getSupabaseConfigError({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toContain(
      "VITE_SUPABASE_URL"
    );
  });
});
