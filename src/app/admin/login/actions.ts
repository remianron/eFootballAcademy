"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth/session";
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";

export type LoginState = { error: string | null };

const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials.";

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  let user: { id: string; passwordHash: string } | null;
  try {
    user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
  } catch (error) {
    if (isDataSourceUnavailableError(error)) {
      return { error: DATABASE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }

  if (!user) {
    return { error: INVALID_CREDENTIALS_MESSAGE };
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    return { error: INVALID_CREDENTIALS_MESSAGE };
  }

  const token = await createSessionToken(user.id);
  if (!token) {
    return {
      error: "Authentication is not configured. Set AUTH_SECRET in the environment.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}