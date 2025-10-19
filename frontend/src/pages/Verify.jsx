import React, { useEffect, useState } from "react";

function Verify() {
  const [state, setState] = useState({ loading: true, ok: false, message: "" });

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");
        if (!token) {
          setState({ loading: false, ok: false, message: "Missing token" });
          return;
        }
        const base = import.meta.env?.VITE_API_BASE || "/api";
        const resp = await fetch(`${base}/waitlist/verify?token=${encodeURIComponent(token)}`);
        const ok = resp.ok;
        const text = await resp.text();
        setState({ loading: false, ok, message: ok ? "Verified!" : text || "Verification failed" });
      } catch (e) {
        setState({ loading: false, ok: false, message: e?.message || "Verification failed" });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {state.loading ? (
          <div>Verifying...</div>
        ) : state.ok ? (
          <div className="text-green-700">{state.message}</div>
        ) : (
          <div className="text-red-700">{state.message}</div>
        )}
      </div>
    </div>
  );
}

export default Verify;


