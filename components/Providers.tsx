"use client";

import { Toaster } from "react-hot-toast";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = { id: string; email: string; name: string | null; role: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
}>({ user: null, loading: true, refresh: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await r.json();
      setUser(j.user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0E0E0E",
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />
    </AuthContext.Provider>
  );
}
