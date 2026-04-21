"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

export default function RegisterForm() {
  const router = useRouter();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },

    onSubmit: async ({ value }) => {
      try {
        // ✅ validation
        if (value.password !== value.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        setError("");

        let cvPath = "";
        if (value.role === "teacher" && cvFile) {
          cvPath = cvFile.name;
        }

        const payload = {
          ...value,
          ...(value.role === "teacher" && { CV: cvPath }),
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Registration failed");
          return;
        }

        if (data.role === "teacher") {
          router.push("/app/teacher/page.tsx");
        } else {
          router.push("/app/student/page.tsx");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    },
  });

  return (
    <>
      <style>
        {` @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
   .auth-root { font-family: 'Nunito', sans-serif; min-height: 100vh; 
    display: flex; align-items: center;
     justify-content: center; overflow: hidden; 
     position: relative;
     } /* Background */ 
     .auth-bg { position: fixed; inset: 0; 
      background-image: url('/background.jpg');
       background-size: cover; background-position: center;
        filter: brightness(0.72) saturate(1.1); z-index: 0; } 
        .auth-bg::after { content: ''; position: absolute; inset: 0; 
          background: linear-gradient(135deg, rgba(0,128,128,0.35) 0%, rgba(32,178,170,0.18) 50%, rgba(0,80,90,0.45) 100%);
         }
          /* Blurred blobs */ 
          .blob { position: fixed; border-radius: 50%; filter: blur(70px); opacity: 0.45; pointer-events: none; z-index: 1; }
           .blob-1 { width: 340px; height: 340px; background: #2dd4bf; top: -80px; left: -60px; } 
           .blob-2 { width: 260px; height: 260px; background: #0e7490; bottom: -60px; right: -40px; } 
           .blob-3 { width: 180px; height: 180px; background: #99f6e4; top: 40%; left: 60%; }
            /* Glass card */ 
            
            .auth-card { position: relative;
               z-index: 10;
                width: 360px;
                 background: rgba(255,255,255,0.13);
                  border: 1px solid rgba(255,255,255,0.28);
                   border-radius: 28px; backdrop-filter: blur(22px) saturate(1.6);
                    -webkit-backdrop-filter: blur(22px) saturate(1.6);
                    box-shadow: 0 8px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.3);
                    padding: 20px 28px 22px;
                    animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
                    @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } } 
                    .auth-title { color: #fff; font-size: 1.5rem;
                     font-weight: 800;
                     text-align: center;
                     margin-bottom: 18px; 
                    letter-spacing: -0.3px;
                     text-shadow: 0 2px 12px rgba(0,0,0,0.25); } 
                   /* Field */ 
                   .auth-field { margin-bottom: 12px; } 
                   .auth-label { display: block;
                     font-size: .72rem;
                     font-weight: 700; 
                    color: rgba(255,255,255,0.85);
                     margin-bottom: 4px;
                     letter-spacing: .5px; 
                    text-transform: uppercase; }
                    .auth-input { width: 100%;
                     padding: 8px 12px;
                     background: rgba(255,255,255,0.14);
                     border: 1.5px solid rgba(255,255,255,0.32);
                     border-radius: 12px;
                     color: #fff;
                     font-family: 'Nunito', sans-serif;
                     font-size: .9rem;
                     font-weight: 600; 
                    outline: none;
                     transition: border-color .2s, background .2s, box-shadow .2s;
                     backdrop-filter: blur(8px);
                     -webkit-backdrop-filter: blur(8px); } .auth-input::placeholder { color: rgba(255,255,255,0.45); 
                    font-weight: 400; } .auth-input:focus { border-color: #2dd4bf;
                     background: rgba(255,255,255,0.2);
                     box-shadow: 0 0 0 3px rgba(45,212,191,0.22); } 
                   /* Role toggle */
                    .role-toggle { display: flex;
                     background: rgba(255,255,255,0.1); 
                    border-radius: 12px;
                     padding: 3px;
                     gap: 4px;
                     border: 1.5px solid rgba(255,255,255,0.2); } 
                   .role-btn { flex: 1; 
                   padding: 6px;
                     border: none;
                     border-radius: 7px;
                     font-family: 'Nunito', sans-serif;
                     font-weight: 700;
                     font-size: .8rem; 
                    cursor: pointer;
                     transition: background .2s, color .2s, box-shadow .2s;
                     background: transparent; 
                    color: rgba(255,255,255,0.6); } 
                   .role-btn.active { background: #2dd4bf;
                     color: #064e3b;
                     box-shadow: 0 2px 12px rgba(45,212,191,0.35); } 
                   /* File upload */ 
                   .file-upload-label { display: flex;
                     align-items: center; 
                    gap: 8px; 
                    width: 100%; 
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.14); 
                    border: 1.5px dashed rgba(255,255,255,0.4);
                     border-radius: 12px;
                     color: rgba(255,255,255,0.75);
                     font-size: .85rem;
                     font-weight: 600;
                    cursor: pointer; 
                    transition: border-color .2s, background .2s; } 
                   .file-upload-label:hover { 
                    border-color: #2dd4bf;
                     background: rgba(255,255,255,0.2);
                     color: #fff; } 
                   .file-name-hint {
                     font-size: .78rem;
                     color: rgba(255,255,255,0.55);
                     margin-top: 5px;
                     padding-left: 4px; } 
                   /* CV slide animation */ 
                   .cv-section { 
                    overflow: hidden;
                     max-height: 0;
                     opacity: 0;
                     transition: max-height .35s ease, opacity .3s ease, margin .3s; } 
                   .cv-section.visible {
                     max-height: 100px;
                     opacity: 1;
                     margin-bottom: 12px; }
                    /* Submit button */
                    .auth-submit {
                     width: 100%;
                     padding: 10px;
                     margin-top: 4px;
                     background: linear-gradient(90deg, #2dd4bf, #0891b2);
                     border: none; 
                    border-radius: 14px; 
                    color: #fff;
                     font-family: 'Nunito', sans-serif; 
                     font-size: .95rem;
                      font-weight: 800; cursor: pointer;
                      letter-spacing: .3px;
                      transition: opacity .2s, transform .15s, box-shadow .2s;
                      box-shadow: 0 4px 20px rgba(45,212,191,0.4); } 
                     .auth-submit:hover { 
                      opacity: .92;
                       transform: translateY(-1px);
                       box-shadow: 0 6px 24px rgba(45,212,191,0.5); } 
                     .auth-submit:active { transform: translateY(0); } 
                     .signin-link { 
                      text-align: center;
                       margin-top: 12px;
                       font-size: .78rem; 
                      color: rgba(255,255,255,0.65);
                     } 
                     .signin-link a { 
                      color: #2dd4bf;
                       font-weight: 700;
                       text-decoration: none; } 
                       .signin-link a:hover { 
                      text-decoration: underline;
                     } 
                    `}
      </style>

      <div className="auth-root">
        <div className="auth-bg" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            style={{ display: "contents" }}
          >
            {/* ROLE */}
            <div className="auth-field">
              <label className="auth-label">I am a</label>

              <form.Field name="role">
                {(field) => (
                  <div className="role-toggle">
                    <button
                      type="button"
                      className={`role-btn ${field.state.value === "student" ? "active" : ""}`}
                      onClick={() => field.handleChange("student")}
                    >
                      🎓 Student
                    </button>

                    <button
                      type="button"
                      className={`role-btn ${field.state.value === "teacher" ? "active" : ""}`}
                      onClick={() => field.handleChange("teacher")}
                    >
                      📚 Teacher
                    </button>
                  </div>
                )}
              </form.Field>
            </div>

            {/* FIRST NAME */}
            <form.Field name="firstName">
              {(field) => (
                <div className="auth-field">
                  <label className="text-white/85">First Name</label>
                  <input
                    className="auth-input"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="First name"
                  />
                </div>
              )}
            </form.Field>

            {/* LAST NAME */}
            <form.Field name="lastName">
              {(field) => (
                <div className="auth-field ">
                  <label className="text-white/85">Last Name</label>
                  <input
                    className="auth-input"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="last name"
                  />
                </div>
              )}
            </form.Field>

            {/* EMAIL */}
            <form.Field name="email">
              {(field) => (
                <div className="auth-field">
                  <label className="text-white/85">Email</label>
                  <input
                    className="auth-input"
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter a valid email"
                  />
                </div>
              )}
            </form.Field>

            {/* PHONE */}
            <form.Field name="phoneNumber">
              {(field) => (
                <div className="auth-field">
                  <label className="text-white/85">Phone Number</label>
                  <input
                    className="auth-input"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter a valid phone number"
                  />
                </div>
              )}
            </form.Field>

            {/* PASSWORD */}
            <form.Field name="password">
              {(field) => (
                <div className="auth-field">
                  <label className="text-white/85">Password</label>
                  <input
                    type="password"
                    className="auth-input"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Password"
                  />
                </div>
              )}
            </form.Field>

            {/* CONFIRM PASSWORD */}
            <form.Field name="confirmPassword">
              {(field) => (
                <div className="auth-field">
                  <label className="text-white/85">Confirm Password</label>
                  <input
                    type="password"
                    className="auth-input"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Repeat password"
                  />

                  {error && <p className="error-text">{error}</p>}
                </div>
              )}
            </form.Field>

            {/* CV */}
            <form.Field name="role">
              {(roleField) =>
                roleField.state.value === "teacher" ? (
                  <div className="auth-field">
                    <label className="text-white/85">CV / Resume</label>

                    <label htmlFor="cv-input" className="file-upload-label">
                      {cvFile ? "File selected ✓" : "Upload CV"}
                    </label>

                    <input
                      id="cv-input"
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    />

                    {cvFile && <p className="file-name-hint">{cvFile.name}</p>}
                  </div>
                ) : null
              }
            </form.Field>

            {/* SUBMIT */}
            <button type="submit" className="auth-submit">
              Create account →
            </button>
          </form>

          <div className="signin-link">
            Already have an account? <a href="/auth/login">Sign In</a>
            </div>
        </div>
      </div>
    </>
  );
}
