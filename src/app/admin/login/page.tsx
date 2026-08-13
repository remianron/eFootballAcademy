import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLogo mode="full" />
        </div>
        <div className="rounded-card border border-border bg-card p-6 shadow-card sm:p-8">
          <h1 className="font-display text-display-md font-semibold text-foreground">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Access the eFootball Academy content management area. Accounts
            are created in the database by the site owner.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}