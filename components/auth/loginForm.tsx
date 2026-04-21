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

        if (!res.ok) {
          setError(result.message || "Login failed");
          return;
        }

        // ✅ Save token
        localStorage.setItem("token", result.token);

        // ✅ Redirect based on role
        if (result.user.role === "student") {
          router.push("/student");
        } else if (result.user.role === "teacher") {
          router.push("/teacher");
        }
      } catch (err) {
        setError("Something went wrong");
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

  .auth-bg {
    position: fixed;
    inset: 0;
    background-image: url('/background.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(0.72) saturate(1.1);
    z-index: 0;
  }
  .auth-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(0,128,128,0.35) 0%,
      rgba(32,178,170,0.18) 50%,
      rgba(0,80,90,0.45) 100%);
  }

  .blob { position: fixed; border-radius: 50%; filter: blur(70px); opacity: 0.45; pointer-events: none; z-index: 1; }
  .blob-1 { width: 340px; height: 340px; background: #2dd4bf; top: -80px; left: -60px; }
  .blob-2 { width: 260px; height: 260px; background: #0e7490; bottom: -60px; right: -40px; }
  .blob-3 { width: 180px; height: 180px; background: #99f6e4; top: 40%; left: 60%; }

  .auth-card {
    position: relative;
    z-index: 10;
    width: 360px;
    background: rgba(255,255,255,0.13);
    border: 1px solid rgba(255,255,255,0.28);
    border-radius: 28px;
    backdrop-filter: blur(22px) saturate(1.6);
    -webkit-backdrop-filter: blur(22px) saturate(1.6);
    box-shadow: 0 8px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.3);
    padding: 36px 32px 32px;
    animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-title {
    color: #fff;
    font-size: 1.75rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 26px;
    letter-spacing: -0.3px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }

  .auth-field { margin-bottom: 16px; }

  .auth-label {
    display: block;
    font-size: .78rem;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    margin-bottom: 6px;
    letter-spacing: .5px;
    text-transform: uppercase;
  }

  .auth-input {
    width: 100%;
    padding: 11px 14px;
    background: rgba(255,255,255,0.14);
    border: 1.5px solid rgba(255,255,255,0.32);
    border-radius: 12px;
    color: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: .95rem;
    font-weight: 600;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.45); font-weight: 400; }
  .auth-input:focus {
    border-color: #2dd4bf;
    background: rgba(255,255,255,0.2);
    box-shadow: 0 0 0 3px rgba(45,212,191,0.22);
  }

  .forgot-link {
    display: block;
    text-align: right;
    font-size: .78rem;
    font-weight: 700;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    margin-top: 6px;
    transition: color .2s;
  }
  .forgot-link:hover { color: #2dd4bf; }

  .auth-submit {
    width: 100%;
    padding: 13px;
    margin-top: 8px;
    background: linear-gradient(90deg, #2dd4bf, #0891b2);
    border: none;
    border-radius: 14px;
    color: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: .3px;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(45,212,191,0.4);
  }
  .auth-submit:hover:not(:disabled) {
    opacity: .92;
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(45,212,191,0.5);
  }
  .auth-submit:active:not(:disabled) { transform: translateY(0); }
  .auth-submit:disabled { opacity: .6; cursor: not-allowed; }

  .signup-link {
    text-align: center;
    margin-top: 16px;
    font-size: .83rem;
    color: rgba(255,255,255,0.65);
  }
  .signup-link a { 
   color: #2dd4bf;
     font-weight: 700;
        text-decoration: none; } 
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
