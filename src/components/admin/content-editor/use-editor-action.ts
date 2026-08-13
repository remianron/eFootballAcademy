"use client";

import { useState } from "react";

type EditorActionResult =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

export function useEditorAction() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  async function runAction(action: () => Promise<EditorActionResult>) {
    setPending(true);
    setErrors({});
    setActionError(null);
    try {
      const result = await action();
      if (result && "ok" in result && !result.ok) {
        if ("errors" in result && result.errors) {
          setErrors(result.errors);
        } else if ("error" in result && result.error) {
          setActionError(result.error);
        }
      }
    } finally {
      setPending(false);
    }
  }

  return { pending, errors, actionError, runAction };
}

export function errorsForKey(
  prefix: string,
  errors: Record<string, string>
): Record<number, string> {
  const result: Record<number, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(`${prefix}.`)) {
      const index = Number(key.slice(prefix.length + 1));
      if (Number.isInteger(index)) result[index] = message;
    }
  }
  return result;
}