import React from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", width: "100vw", background: "var(--color-bg)",
      fontFamily: "var(--font-sans)"
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", padding: "var(--space-8)",
        background: "var(--color-surface)", borderRadius: "var(--radius-lg)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)", border: "1px solid var(--color-border-light)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "var(--color-accent)", margin: "0 auto var(--space-4)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>R</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-text-primary)" }}>Welcome back</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px", marginTop: "4px" }}>Ritchy Private Label Platform</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>EMAIL ADDRESS</label>
            <input type="email" className="ds-input" style={{ width: "100%" }} placeholder="name@company.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>PASSWORD</label>
            <input type="password" className="ds-input" style={{ width: "100%" }} />
          </div>
          <button type="submit" className="ds-btn ds-btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }}>Sign In</button>
          <div style={{ textAlign: "center", fontSize: "12px", color: "var(--color-text-muted)" }}>
            Demo: sign in with any credentials
          </div>
        </form>

        <div style={{ marginTop: "var(--space-6)", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)" }}>
          Don't have an account? <span style={{ color: "var(--color-accent)", cursor: "pointer", fontWeight: 500 }}>Contact support</span>
        </div>
      </div>
    </div>
  );
}
