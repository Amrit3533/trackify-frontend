import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Activity } from "lucide-react";
const HomePage = ({ t, isDark, handleLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Login
  const loginUser = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("rememberedEmail", formData.email);
      handleLogin(res.data);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Register
  const registerUser = async () => {
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully. Please login.");

      // ✅ move user to login tab
      setActiveTab("login");

      // ✅ clear sensitive fields
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "login") {
      const rememberedEmail = localStorage.getItem("rememberedEmail");

      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail || "",
        password: "",
        name: "",
        confirmPassword: "",
      }));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "register") {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [activeTab]);

  const handleSubmit = () => {
    if (activeTab === "login") loginUser();
    else registerUser();
  };

  return (
    <div
      style={{
        background: t.bg,
        minHeight: "100vh",
        // height: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px" : "32px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: t.gradient1,
          borderRadius: "50%",
          opacity: "0.1",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background: t.gradient2,
          borderRadius: "50%",
          opacity: "0.1",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "32px" : "40px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ order: isMobile ? 2 : 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: isMobile ? "48px" : "56px",
                height: isMobile ? "48px" : "56px",
                background: t.gradient1,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={isMobile ? 28 : 32} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: isMobile ? "32px" : "40px",
                fontWeight: "800",
                color: t.text,
                margin: 0,
              }}
            >
              Trackify
            </h1>
          </div>

          <h2
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "700",
              marginBottom: "16px",
              lineHeight: "1.2",
              color: t.text,
            }}
          >
            Build Better Habits,
            <br />
            <span
              key={isDark ? "dark" : "light"}
              style={{
                background: t.gradient1,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: t.primary,
                WebkitTextFillColor: "unset",

                display: "inline-block",
              }}
            >
              One Day at a Time
            </span>
          </h2>

          <p
            style={{
              color: t.textSecondary,
              fontSize: isMobile ? "15px" : "16px",
              lineHeight: "1.6",
              marginBottom: "32px",
            }}
          >
            Track your daily habits, visualize your progress, and achieve your
            goals with powerful analytics and insights.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            {[
              { icon: "📊", text: "Weekly Analytics" },
              { icon: "🔥", text: "Streak Tracking" },
              { icon: "📅", text: "Monthly Reports" },
              { icon: "✨", text: "Custom Habits" },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  padding: isMobile ? "8px 12px" : "10px 16px",
                  background: isDark ? "#2A2F3F" : "#F8FAFC",
                  border: `1px solid ${t.border}`,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: isMobile ? "16px" : "18px" }}>
                  {feature.icon}
                </span>
                <span
                  style={{
                    color: t.text,
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex" }}>
              {[
                {
                  letter: "J",
                  bg: "linear-gradient(135deg, #A05AFF, #8B4DE8)",
                },
                {
                  letter: "S",
                  bg: "linear-gradient(135deg, #1BCFB4, #0EA885)",
                },
                {
                  letter: "M",
                  bg: "linear-gradient(135deg, #FE9496, #FC6B6D)",
                },
                {
                  letter: "A",
                  bg: "linear-gradient(135deg, #4BCBEB, #3AB5D9)",
                },
              ].map((avatar, idx) => (
                <div
                  key={idx}
                  style={{
                    width: isMobile ? "36px" : "44px",
                    height: isMobile ? "36px" : "44px",
                    borderRadius: "50%",
                    background: avatar.bg,
                    border: `3px solid ${t.bg}`,
                    marginLeft: idx > 0 ? "-12px" : "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                >
                  {avatar.letter}
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  color: t.text,
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: "600",
                }}
              >
                Join 10,000+ users
              </div>
              <div
                style={{
                  color: t.textSecondary,
                  fontSize: isMobile ? "12px" : "13px",
                }}
              >
                building better habits
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: t.cardBg,
            padding: isMobile ? "32px 24px" : "40px",
            borderRadius: "20px",
            border: `1px solid ${t.border}`,
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.3)"
              : "0 20px 60px rgba(0,0,0,0.08)",
            order: isMobile ? 2 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "32px",
              background: isDark ? t.bg : "#F8FAFC",
              padding: "4px",
              borderRadius: "10px",
            }}
          >
            {/* Sign In btn */}
            <button
              onClick={() => setActiveTab("login")}
              style={{
                flex: 1,
                padding: isMobile ? "10px" : "12px",
                background: activeTab === "login" ? t.gradient1 : "transparent",
                border: "none",
                borderRadius: "8px",
                color: activeTab === "login" ? "#fff" : t.textSecondary,
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Sign In
            </button>
            {/* Sign up btn  */}
            <button
              onClick={() => setActiveTab("register")}
              style={{
                flex: 1,
                padding: isMobile ? "10px" : "12px",
                background:
                  activeTab === "register" ? t.gradient1 : "transparent",
                border: "none",
                borderRadius: "8px",
                color: activeTab === "register" ? "#fff" : t.textSecondary,
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Sign Up
            </button>
          </div>

          <h2
            style={{
              fontSize: isMobile ? "22px" : "24px",
              fontWeight: "600",
              color: t.text,
              marginBottom: "24px",
            }}
          >
            {activeTab === "login" ? "Welcome Back!" : "Create Account"}
          </h2>

          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}

          {/* Full Name – ONLY for Register */}
          {activeTab === "register" && (
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="fullName"
                style={{
                  display: "block",
                  color: t.text,
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? "10px 14px" : "12px 16px",
                  background: isDark ? t.bg : "#F8FAFC",
                  border: `1px solid ${t.border}`,
                  borderRadius: "8px",
                  color: t.text,
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                color: t.text,
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              id="email"
              autoComplete="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: isMobile ? "10px 14px" : "12px 16px",
                background: isDark ? t.bg : "#F8FAFC",
                border: `1px solid ${t.border}`,
                borderRadius: "8px",
                color: t.text,
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: t.text,
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: isMobile ? "10px 14px" : "12px 16px",
                background: isDark ? t.bg : "#F8FAFC",
                border: `1px solid ${t.border}`,
                borderRadius: "8px",
                color: t.text,
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Confirm Password – ONLY for Register */}
          {activeTab === "register" && (
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  color: t.text,
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? "10px 14px" : "12px 16px",
                  background: isDark ? t.bg : "#F8FAFC",
                  border: `1px solid ${t.border}`,
                  borderRadius: "8px",
                  color: t.text,
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: isMobile ? "12px" : "14px",
              background: t.gradient1,
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {loading
              ? "Please wait..."
              : activeTab === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
