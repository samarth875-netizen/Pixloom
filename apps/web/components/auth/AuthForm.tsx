"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface AuthFormProps {
  mode: "login" | "signup";
}

function AuthFormInner({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const configured = isSupabaseConfigured();
  const next = searchParams.get("next") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!configured) {
      setError(
        "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
      );
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        if (data.session) {
          router.push("/editor");
          router.refresh();
        } else {
          setSuccess(
            "Check your email for a confirmation link to activate your account."
          );
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#171717] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-5"
      >
        {/* Field: Email */}
        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547] focus:ring-1 focus:ring-[#F5F547]/40 transition-colors"
            />
          </div>
        </div>

        {/* Field: Password */}
        <div className="space-y-1.5">
          <label htmlFor="auth-password" className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              id="auth-password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Your password" : "At least 8 characters"}
              className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547] focus:ring-1 focus:ring-[#F5F547]/40 transition-colors"
            />
          </div>
        </div>

        {/* Field: Confirm Password (signup only) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label htmlFor="auth-confirm" className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547] focus:ring-1 focus:ring-[#F5F547]/40 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {error && (
          <div className="flex items-start gap-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3.5 py-2.5">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="yellow"
          size="lg"
          disabled={loading}
          className="w-full font-bold"
        >
          {loading
            ? "Please wait…"
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </Button>
      </form>

      {/* Switch Mode Link */}
      <p className="text-center text-sm text-[#9CA3AF] mt-6">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-[#F5F547] hover:underline">
              Sign up free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-[#F5F547] hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function AuthForm(props: AuthFormProps) {
  return (
    <Suspense fallback={<div className="text-center text-sm text-[#9CA3AF]">Loading…</div>}>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
