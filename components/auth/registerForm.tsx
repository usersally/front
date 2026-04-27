"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

export default function RegisterForm() {
  const router = useRouter();

  // ✅ Initialize form with ALL fields (including cvFile + error)
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "student",
      cvFile: null as File | null,
      error: "",
    },

    // ✅ Submit handler
    onSubmit: async ({ value, formApi }) => {
      try {
        // 🔒 Password validation
        if (value.password !== value.confirmPassword) {
          formApi.setFieldValue("error", "Passwords do not match");
          return;
        }

        formApi.setFieldValue("error", "");

        // 📄 Handle CV (only for teacher)
        let cvPath = "";
        if (value.role === "teacher" && value.cvFile) {
          cvPath = value.cvFile.name; // later replace with real upload
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
          formApi.setFieldValue("error", data.message || "Registration failed");
          return;
        }

        // 🚀 Redirect based on role
        router.push(data.role === "teacher" ? "/teacher" : "/student");
      } catch {
        formApi.setFieldValue("error", "Something went wrong");
      }
    },
  });

  return (
    <>
    <style>
  {`
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

/* Background */
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

/* Blobs */
.blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.4;
  pointer-events: none;
  z-index: 1;
}

.blob-1 {
  width: 340px;
  height: 340px;
  background: #547C90;
  top: -80px;
  left: -60px;
}

.blob-2 {
  width: 260px;
  height: 260px;
  background: #1E3745;
  bottom: -60px;
  right: -40px;
}

.blob-3 {
  width: 180px;
  height: 180px;
  background: #D0F1E6;
  top: 40%;
  left: 60%;
}

/* Card */
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
  padding: 20px 28px 22px;
  animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Title */
.auth-title {
  color: #F6FAFD;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 18px;
}

/* Fields */
.auth-field { margin-bottom: 12px; }

.auth-label {
  display: block;
  font-size: .72rem;
  font-weight: 700;
  color: rgba(246,250,253,0.85);
  margin-bottom: 4px;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.auth-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(186,207,218,0.5);
  border-radius: 12px;
  color: #F6FAFD;
  font-size: .9rem;
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

/* Role toggle */
.role-toggle {
  display: flex;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 3px;
  gap: 4px;
  border: 1.5px solid rgba(186,207,218,0.4);
}

.role-btn {
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 7px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: .8rem;
  cursor: pointer;
  background: transparent;
  color: rgba(246,250,253,0.6);
  transition: all .2s;
}

.role-btn.active {
  background: #547C90;
  color: #F6FAFD;
  box-shadow: 0 2px 12px rgba(84,124,144,0.35);
}

/* File upload */
.file-upload-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: rgba(255,255,255,0.12);
  border: 1.5px dashed rgba(186,207,218,0.6);
  border-radius: 12px;
  color: rgba(246,250,253,0.75);
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
}

.file-upload-label:hover {
  border-color: #547C90;
  background: rgba(255,255,255,0.18);
  color: #F6FAFD;
}

.file-name-hint {
  font-size: .78rem;
  color: rgba(246,250,253,0.55);
  margin-top: 5px;
  padding-left: 4px;
}

/* CV animation */
.cv-section {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height .35s ease, opacity .3s ease, margin .3s;
}

.cv-section.visible {
  max-height: 100px;
  opacity: 1;
  margin-bottom: 12px;
}

/* Button */
.auth-submit {
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  background: linear-gradient(90deg, #265166, #547C90);
  border: none;
  border-radius: 14px;
  color: #F6FAFD;
  font-size: .95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 4px 20px rgba(38,81,102,0.4);
}

.auth-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(38,81,102,0.5);
}

/* Link */
.signin-link {
  text-align: center;
  margin-top: 12px;
  font-size: .78rem;
  color: rgba(246,250,253,0.65);
}

.signin-link a {
  color: #D0F1E6;
  font-weight: 700;
  text-decoration: none;
}

.signin-link a:hover {
  text-decoration: underline;
}
`}
</style>;


      <div className="auth-root">
        {/* 🎨 Background effects */}
        <div className="auth-bg" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>

          {/* 🧠 Main Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(); // ✅ trigger TanStack submit
            }}
            style={{ display: "contents" }} // keeps your layout intact
          >
            {/* ================= ROLE ================= */}
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

            {/* ================= INPUTS ================= */}
            {(["firstName", "lastName", "email", "phoneNumber"] as const).map((name) => (
              <form.Field key={name} name={name}>
                {(field) => (
                  <div className="auth-field">
                    <label className="text-white/85">
                      {name.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      className="auth-input"
                      type={name === "email" ? "email" : "text"}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={`Enter ${name}`}
                    />
                  </div>
                )}
              </form.Field>
            ))}

            {/* ================= PASSWORD ================= */}
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

            {/* ================= CONFIRM PASSWORD ================= */}
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
                </div>
              )}
            </form.Field>

            {/* ❗ GLOBAL ERROR (from form state) */}
            <form.Subscribe selector={(state) => state.values.error}>
              {(error) =>
                error ? <p className="error-text">{error}</p> : null
              }
            </form.Subscribe>

            {/* ================= CV (ONLY FOR TEACHER) ================= */}
            <form.Subscribe selector={(state) => state.values.role}>
              {(role) =>
                role === "teacher" ? (
                  <form.Field name="cvFile">
                    {(cvField) => (
                      <div className="auth-field">
                        <label className="text-white/85">CV / Resume</label>

                        {/* custom upload button */}
                        <label htmlFor="cv-input" className="file-upload-label">
                          {cvField.state.value
                            ? "File selected ✓"
                            : "Upload CV"}
                        </label>

                        {/* hidden file input */}
                        <input
                          id="cv-input"
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            cvField.handleChange(e.target.files?.[0] ?? null)
                          }
                        />

                        {/* show selected file */}
                        {cvField.state.value && (
                          <p className="file-name-hint">
                            {cvField.state.value.name}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                ) : null
              }
            </form.Subscribe>

            {/* ================= SUBMIT ================= */}
            <form.Subscribe selector={(state) => state.values}>
              {(values) => (
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={values.role === "teacher" && !values.cvFile}
                >
                  Create account →
                </button>
              )}
            </form.Subscribe>
          </form>

          {/* 🔗 LOGIN LINK */}
          <div className="signin-link">
            Already have an account? <a href="/auth/login">Sign In</a>
          </div>
        </div>
      </div>
    </>
  );
}
