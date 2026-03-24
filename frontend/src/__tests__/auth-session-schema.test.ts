import { describe, expect, it } from "vitest";

import { AuthUserSchema } from "../schemas/auth-session-schema";

describe("AuthUserSchema", () => {
  it("有効なSupabaseユーザー情報の場合、検証に成功する", () => {
    const result = AuthUserSchema.safeParse({
      id: "user-id",
      email: "user@example.com"
    });

    expect(result.success).toBe(true);
  });

  it("emailが不正な場合、検証に失敗する", () => {
    const result = AuthUserSchema.safeParse({
      id: "user-id",
      email: "invalid-email"
    });

    expect(result.success).toBe(false);
  });
});
