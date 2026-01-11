import React, { useState } from "react";
import { LogOut } from "lucide-react";

const Sidebar = ({
  isDark,
  currentPage,
  setCurrentPage,
  isMobile,
  isOpen,
  isLoggedIn,
  handleLogout,
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  /* -------------------- THEME -------------------- */
  const theme = {
    dark: {
      bg: "#0F1419",
      text: "#E8EAED",
      textSecondary: "#9BA1A6",
      border: "#2D3748",
      primary: "#A05AFF",
      danger: "#EF4444",
    },
    light: {
      bg: "#F7F9FC",
      text: "#1A202C",
      textSecondary: "#718096",
      border: "#E2E8F0",
      primary: "#A05AFF",
      danger: "#EF4444",
    },
  };

  const t = isDark ? theme.dark : theme.light;

  /* -------------------- MENUS -------------------- */

  const publicMenu = [
    { id: "features", label: "Features", icon: "✨", color: "#F59E0B" },
    { id: "about", label: "About", icon: "ℹ️", color: "#3B82F6" },
    { id: "home", label: "Login / Signup", icon: "🔐", color: "#10B981" },
  ];

  const appMenu = [
    { id: "dashboard", label: "Dashboard", icon: "📊", color: t.primary },
    { id: "execution", label: "Execution Hub", icon: "⚡", color: "#F59E0B" },
    { id: "template", label: "Template", icon: "📋", color: "#3B82F6" },
    { id: "reports", label: "Reports", icon: "📈", color: "#10B981" },
    { id: "settings", label: "Settings", icon: "⚙️", color: "#EF4444" },
  ];

  /* -------------------- SOURCE OF TRUTH -------------------- */
  const menuItems = isLoggedIn ? appMenu : publicMenu;

  /* -------------------- LAYOUT -------------------- */
  const sidebarWidth = isMobile ? "70%" : "240px";

  return (
    <aside
      style={{
        position: "fixed",
        top: "60px",
        left: isOpen ? 0 : `-${sidebarWidth}`,
        width: sidebarWidth,
        height: "calc(100vh - 60px)",
        background: t.bg,
        borderRight: `1px solid ${t.border}`,
        transition: "left 0.3s ease",
        zIndex: 1200,
        overflowX: "hidden",
        padding: "16px",
      }}
    >
      {/* -------------------- MENU ITEMS -------------------- */}
      {menuItems.map((item, idx) => {
        const isActive = currentPage === item.id;
        const isHovered = hoveredItem === idx;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            onMouseEnter={() => setHoveredItem(idx)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              marginBottom: "10px",
              borderRadius: "12px",
              border: "none",
              background:
                isActive || isHovered ? `${item.color}22` : "transparent",
              color: isActive || isHovered ? item.color : t.text,
              fontSize: "15px",
              fontWeight: isActive ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* -------------------- MOBILE LOGOUT -------------------- */}
      {isMobile && isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px 16px",
            background: "transparent",
            border: `1px solid ${t.danger}`,
            borderRadius: "8px",
            color: t.danger,
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
