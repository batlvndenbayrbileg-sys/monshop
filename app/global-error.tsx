"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="mn">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#FFF5F5" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ fontSize: "28px", marginBottom: "12px", color: "#1F1F1F" }}>Алдаа гарлаа</h1>
          <p style={{ color: "#6B6B6B", marginBottom: "24px" }}>
            Уучлаарай, ямар нэг зүйл буруу боллоо.
          </p>
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Дахин оролдох
          </button>
        </div>
      </body>
    </html>
  );
}
