import { Activity, LogOut, Moon, Sun } from "lucide-react";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
const Navigation = ({
  t,
  isMobile,
  isLoggedIn,
  currentPage,
  setCurrentPage,
  isDark,
  setIsDark,
  profile,
  handleLogout,
  setSidebarOpen,
}) => {
  const navStyle = {
    position: "fixed",
    left: 0,
    right: 0,
    height: "60px",
    top: 0,
    zIndex: 1000,
    background: t.cardBg,
    borderBottom: `1px solid ${t.border}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: isMobile ? "8px 16px" : "9px 24px",
  };

  const flexCenterStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  };

  const logoIconStyle = {
    width: "36px",
    height: "36px",
    background: t.gradient1,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  };

  const authButtonStyle = {
    padding: "10px 20px",
    background: currentPage === "home" ? t.primary : "none",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={flexCenterStyle}>
          {/* Logo */}
          <div
            onClick={() => setCurrentPage(isLoggedIn ? "dashboard" : "home")}
            style={logoStyle}
          >
            <div style={logoIconStyle}>
              <Activity size={20} color="#fff" />
            </div>
            <span
              style={{ fontSize: "18px", fontWeight: "700", color: t.text }}
            >
              Trackify
            </span>
          </div>

          <div style={buttonGroupStyle}>
            {/* Mobile Hamburger – always visible */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: t.text,
                }}
                aria-label="Open menu"
              >
                ☰
              </button>
            )}
            {isLoggedIn ? (
              <>
                {/* Avatar (always visible) */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "darkslategray",
                    backgroundImage: profile?.avatarUrl
                      ? `url(${profile.avatarUrl})`
                      : undefined,
                    backgroundColor: profile?.avatarUrl
                      ? undefined
                      : t.gradient1,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentPage("settings")}
                >
                  {!profile?.avatarUrl &&
                    profile?.name?.charAt(0)?.toUpperCase()}
                </div>
                {!isMobile && (
                  <>
                    {/* Dark Mode /Light Mode  */}
                    <button
                      onClick={() => setIsDark(!isDark)}
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: `1px solid ${t.border}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {isDark ? (
                        <Sun size={16} color={t.text} />
                      ) : (
                        <Moon size={16} color={t.text} />
                      )}
                    </button>
                    {/* Logout Button  */}
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: "8px 16px",
                        background: "transparent",
                        border: `1px solid ${t.danger}`,
                        borderRadius: "6px",
                        color: t.danger,
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = t.danger;
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = t.danger;
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {!isMobile && (
                  <>
                    <button
                      onClick={() => setCurrentPage("features")}
                      style={{
                        background:
                          currentPage === "features" ? t.primary : "none",
                        border: "none",
                        color: currentPage === "features" ? "#fff" : t.text,
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        transition: "all 0.3s",
                      }}
                    >
                      Features
                    </button>
                    <button
                      onClick={() => setCurrentPage("about")}
                      style={{
                        background:
                          currentPage === "about" ? t.primary : "none",
                        border: "none",
                        color: currentPage === "about" ? "#fff" : t.text,
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        transition: "all 0.3s",
                      }}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setCurrentPage("home")}
                      style={authButtonStyle}
                    >
                      Login / Register
                    </button>
                    <button
                      onClick={() => setIsDark(!isDark)}
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: `1px solid ${t.border}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginLeft: "8px",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.3s",
                      }}
                    >
                      {isDark ? (
                        <Sun size={16} color={t.text} />
                      ) : (
                        <Moon size={16} color={t.text} />
                      )}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
