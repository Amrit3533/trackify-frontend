/* eslint-disable no-unused-vars */
import API from "../api/api";
import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";

const SettingsPage = ({
  t,
  setToastMessage,
  setShowToast,
  isDark,
  setIsDark,
  profile,
  setProfile,
}) => {
  const [name, setName] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result;

        // instant preview
        setAvatarPreview(base64);

        // persist to backend
        const res = await API.put("/auth/profile", {
          avatarUrl: base64,
        });

        setProfile(res.data);

        setToastMessage("Avatar updated successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        setToastMessage("Failed to update avatar");
        setShowToast(true);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleUpdateName = async () => {
    try {
      const res = await API.put("/auth/profile", { name });
      // console.log(name);
      setProfile(res.data);
      setToastMessage("Name updated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setToastMessage("Failed to update name");
      setShowToast(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete("/auth/delete-account");

      localStorage.removeItem("token");

      setShowDeleteConfirm(false);
      setToastMessage("Account deleted permanently");
      setShowToast(true);

      // hard reset app state
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setToastMessage("Failed to delete account");
      setShowToast(true);
    }
  };

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div style={{ display: "flex", background: t.bg }}>
      <div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "32px",
          maxWidth: "100%",
          // overflow: "auto",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "8px",
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: "14px", color: t.textSecondary }}>
              Manage your profile and preferences
            </p>
          </div>

          {/* Profile Section */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: isMobile ? "24px" : "32px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>👤</span> Profile
            </h2>

            {/* Avatar Upload */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "flex-start",
                gap: "24px",
                marginBottom: "32px",
                paddingBottom: "32px",
                // borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: isMobile ? "100px" : "120px",
                    height: isMobile ? "100px" : "120px",
                    borderRadius: "50%",
                    backgroundImage: avatarPreview
                      ? `url(${avatarPreview})`
                      : undefined,
                    backgroundColor: avatarPreview ? undefined : t.gradient1,
                    backgroundSize: "cover",
                    background: "darkslategray",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: isMobile ? "40px" : "48px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    border: `3px solid ${t.border}`,
                  }}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "8px 16px",
                    background: t.primary,
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Upload Avatar
                </button>
              </div>

              <div style={{ flex: 1, width: "100%",minWidth: 0 }}>
                {/* Full Name */}
                <div style={{ marginBottom: "20px" }}>
                  <label
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        background: isDark ? t.bg : "#F8FAFC",
                        border: `1px solid ${t.border}`,
                        borderRadius: "8px",
                        color: t.text,
                        fontSize: "15px",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={!name || name === profile?.name}
                      style={{
                        background: t.success,
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        opacity: name === profile?.name ? 0.6 : 1,
                        padding: isMobile ? "14px" : "12px 24px",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: t.text,
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile?.email}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.03)",
                      border: `1px solid ${t.border}`,
                      overflow: "hidden",
                      borderRadius: "8px",
                      color: t.textSecondary,
                      fontSize: "15px",
                      cursor: "not-allowed",
                    }}
                  />
                </div>

                {/* Member Since */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: t.text,
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={memberSince}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.03)",
                      border: `1px solid ${t.border}`,
                      overflow: "hidden",
                      borderRadius: "8px",
                      color: t.textSecondary,
                      fontSize: "15px",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: isMobile ? "24px" : "32px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🎨</span> Appearance
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? "12px" : "0",
                justifyContent: "space-between",
                padding: "16px",
                background: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: t.text,
                    marginBottom: "4px",
                  }}
                >
                  Theme Mode
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: t.textSecondary,
                  }}
                >
                  {isDark ? "Dark mode is enabled" : "Light mode is enabled"}
                </div>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  padding: "10px 20px",
                  background: t.gradient1,
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "Light" : "Dark"} Mode
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            style={{
              background: t.cardBg,
              border: `2px solid ${t.danger}`,
              borderRadius: "16px",
              padding: isMobile ? "24px" : "32px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span> Danger Zone
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: t.textSecondary,
                marginBottom: "20px",
              }}
            >
              Deleting your account is permanent. All habits, routines, and
              history will be removed forever.
            </p>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: "14px",
                width: isMobile ? "100%" : "auto",
                background: t.danger,
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Delete Account
            </button>
          </div>

          {showDeleteConfirm && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 3000,
              }}
            >
              <div
                style={{
                  background: t.cardBg,
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "32px",
                  maxWidth: "420px",
                  width: "90%",
                  border: `1px solid ${t.border}`,
                  margin: isMobile? "20px" : ""
                }}
              >
                <h3 style={{ marginBottom: "12px", color: t.text }}>
                  Confirm Account Deletion
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: t.textSecondary,
                    marginBottom: "24px",
                  }}
                >
                  This action cannot be undone. Are you absolutely sure?
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "transparent",
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      color: t.text,
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: t.danger,
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
