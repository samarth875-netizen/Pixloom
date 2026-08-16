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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogle = async () => {
    setError(null);
    setSuccess(null);

    if (!configured) {
      setError(
        "Supabase is not configured yet. Add your environment variables to enable Google sign-in."
      );
      return;
    }

    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setGoogleLoading(false);
    if (error) {
      setError(error.message);
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

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full inline-flex items-center justify-center gap-2.5 bg-white text-black font-semibold text-sm rounded-full px-6 py-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
          Continue with Google
        </button>
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
