"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type AuthUser = {
  id: string;
  email?: string;
};

type AuthContextValue = {
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/me", {
        cache: "no-store"
      });

      if (!response.ok) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const body = (await response.json()) as {
        data?: {
          isAdmin: boolean;
          user: AuthUser | null;
        };
      };

      setUser(body.data?.user ?? null);
      setIsAdmin(Boolean(body.data?.isAdmin));
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", {
      method: "POST"
    });
    setUser(null);
    setIsAdmin(false);
  }

  useEffect(() => {
    if (!pathname.startsWith("/admin") || PUBLIC_ADMIN_PATHS.has(pathname)) {
      setIsLoading(false);
      return;
    }

    void refresh();
  }, [pathname]);

  const value = useMemo(
    () => ({
      isAdmin,
      isLoading,
      logout,
      refresh,
      user
    }),
    [isAdmin, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
