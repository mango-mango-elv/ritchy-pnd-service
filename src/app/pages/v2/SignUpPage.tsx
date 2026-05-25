import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

export function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@")) { setError("Enter a valid email address."); return; }
    if (form.password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setError("");
    sessionStorage.setItem("ritchy-v2-user", JSON.stringify({ email: form.email }));
    navigate("/v2/compliance");
  };

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 3 of 5
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Save &amp; Sign Up</h1>
          <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Create an account to save your design and track your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
          display: "grid", gap: "var(--space-4)",
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Email
            </label>
            <input
              className="ds-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Password
            </label>
            <input
              className="ds-input"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Confirm Password
            </label>
            <input
              className="ds-input"
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: "var(--space-3)",
              background: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px", color: "#dc2626",
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "var(--space-1)" }}>
            <Link to="/login" style={{ fontSize: "13px", color: "var(--color-text-secondary)", textDecoration: "none" }}>
              Already have an account?
            </Link>
            <button type="submit" className="ds-btn ds-btn-primary">
              Create Account →
            </button>
          </div>
        </form>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button onClick={() => navigate("/v2/design")} className="ds-btn ds-btn-secondary">← Back to Design</button>
        </div>
      </div>
    </div>
  );
}
