"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },

    onSubmit: async ({ value }) => {
      setError("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          },
        );

        const result = await res.json();
        console.log("LOGIN RESPONSE:", result);
        if (!res.ok) {
          setError(result.message || "Login failed");
          return;
        }

        // ✅ Save token
        const token = result?.data?.token;
        const role = result?.data?.user?.role;
        console.log("ROLE", role);

        localStorage.setItem("token", token);

        // ✅ Redirect based on role

        if (role === "student") {
          router.push("/student");
        } else if (role === "teacher") {
          router.push("/teacher");
        } else {
          setError("Invalid user role");
        }
        console.log("FULL RESULT:", result);
        console.log("USER:", result?.data?.user);
        console.log("ROLE:", result?.data?.user?.role);
      } catch (err: unknown) {
        console.log("LOGIN ERROR:", err);

        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
  });

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.auth-root {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* KEEP background image */
.auth-bg {
  position: fixed;
  inset: 0;
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.75);
  z-index: 0;
}
.auth-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(38,81,102,0.55) 0%,
    rgba(84,124,144,0.35) 50%,
    rgba(30,55,69,0.65) 100%);
}

/* BLOBS (updated colors) */
.blob { position: fixed; border-radius: 50%; filter: blur(70px); opacity: 0.4; pointer-events: none; z-index: 1; }
.blob-1 { width: 340px; height: 340px; background: #547C90; top: -80px; left: -60px; }
.blob-2 { width: 260px; height: 260px; background: #1E3745; bottom: -60px; right: -40px; }
.blob-3 { width: 180px; height: 180px; background: #D0F1E6; top: 40%; left: 60%; }

/* CARD */
.auth-card {
  position: relative;
  z-index: 10;
  width: 360px;
  background: rgba(246,250,253,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 28px;
  backdrop-filter: blur(22px) saturate(1.4);
  -webkit-backdrop-filter: blur(22px) saturate(1.4);
  box-shadow: 0 8px 40px rgba(0,0,0,0.3);
  padding: 36px 32px 32px;
  animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* TITLE */
.auth-title {
  color: #F6FAFD;
  font-size: 1.75rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 26px;
}

/* INPUTS */
.auth-field { margin-bottom: 16px; }

.auth-label {
  display: block;
  font-size: .78rem;
  font-weight: 700;
  color: rgba(246,250,253,0.85);
  margin-bottom: 6px;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.auth-input {
  width: 100%;
  padding: 11px 14px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(186,207,218,0.5);
  border-radius: 12px;
  color: #F6FAFD;
  font-size: .95rem;
  font-weight: 600;
  outline: none;
  transition: all .2s;
}

.auth-input::placeholder { 
  color: rgba(246,250,253,0.5); 
}

.auth-input:focus {
  border-color: #547C90;
  background: rgba(255,255,255,0.18);
  box-shadow: 0 0 0 3px rgba(84,124,144,0.25);
}

/* BUTTON */
.auth-submit {
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  background: linear-gradient(90deg, #265166, #547C90);
  border: none;
  border-radius: 14px;
  color: #F6FAFD;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 4px 20px rgba(38,81,102,0.4);
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(38,81,102,0.5);
}

.auth-submit:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* ERROR */
.auth-error {
  color: #CA4C44;
  font-size: .8rem;
  margin-bottom: 6px;
}

/* SIGNUP */
.signup-link {
  text-align: center;
  margin-top: 16px;
  font-size: .83rem;
  color: rgba(246,250,253,0.7);
}

.signup-link a { 
  color: #D0F1E6;
  font-weight: 700;
  text-decoration: none;
}

.signup-link a:hover { 
  text-decoration: underline;
}
`}</style>

      <div className="auth-root">
        {/* Background */}
        <div className="auth-bg"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        {/* Card */}
        <div className="auth-card">
          <h2 className="auth-title">Sign in</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            {/* Password */}
            <form.Field name="password">
              {(field) => (
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter your password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            {/* Error */}
            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: ".8rem",
                  marginBottom: "6px",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="signup-link text-white/85">
            Don’t have an account? <a href="/auth/register">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
}
