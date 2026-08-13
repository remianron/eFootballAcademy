"use client";

import { useActionState } from "react";
import { Button } from "@/components";
import { TextField } from "@/components/admin/form/fields";
import { loginAction } from "./actions";

/**
 * Admin sign-in form. Server action results (validation, invalid
 * credentials, database unavailable) render as an error banner above
 * the fields.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {state.error}
        </div>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="admin@example.com"
        inputMode="email"
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}