"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) {
      router.push("/");
      router.refresh();
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border border-white/15 text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
