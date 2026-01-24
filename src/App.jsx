import { useEffect, useState } from "react";
import API from "./api/api";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import ExecutionHubPage from "./pages/ExecutionHubPage";
import FeaturesPage from "./pages/FeaturesPage";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import TemplatePage from "./pages/TemplatePage";

const App = () => {
  // global toast (used by many pages)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDark, setIsDark] = useState(true);
  // theme
  const theme = {
    dark: {
      bg: "#0F1419",
      cardBg: "#1A1F2E",
      text: "#E8EAED",
      textSecondary: "#9BA1A6",
      border: "#2D3748",
      primary: "#A05AFF",
      success: "#10B981",
      danger: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
      gradient1: "linear-gradient(135deg, #A05AFF 0%, #8B4DE8 100%)",
      gradient2: "linear-gradient(135deg, #1BCFB4 0%, #0EA885 100%)",
    },
    light: {
      bg: "#F7F9FC",
      cardBg: "#FFFFFF",
      text: "#1A202C",
      textSecondary: "#718096",
      border: "#E2E8F0",
      primary: "#A05AFF",
      success: "#10B981",
      danger: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
      gradient1: "linear-gradient(135deg, #A05AFF 0%, #C589FF 100%)",
      gradient2: "linear-gradient(135deg, #1BCFB4 0%, #4BDFC4 100%)",
    },
  };

  const t = isDark ? theme.dark : theme.light;
  // eslint-disable-next-line no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // auth
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  //avatar
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile in navbar", err);
      }
    };

    fetchProfile();
  }, [isLoggedIn]);

  // navigation
  const [currentPage, setCurrentPage] = useState("home");
  // console.log("APP STATE", {
  //   currentPage,
  //   setCurrentPage,
  // });

  const handleLogin = ({ token, user }) => {
    localStorage.setItem("token", token);
    setUser(user);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLogoutMessage(true);
    setCurrentPage("home");
    setTimeout(() => setShowLogoutMessage(false), 3000);
  };

  {
    showLogoutMessage && (
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "24px",
          background: t.success,
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontWeight: "500",
          fontSize: "14px",
          zIndex: 1001,
        }}
      >
        ✓ Successfully logged out!
      </div>
    );
  }

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    API.get("/routine/dashboard")
      .then((res) => setDashboardData(res.data))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const renderPage = () => {
    if (!isLoggedIn) {
      if (currentPage === "home")
        return <HomePage t={t} isDark={isDark} handleLogin={handleLogin} />;
      if (currentPage === "features") return <FeaturesPage t={t} />;
      if (currentPage === "about") return <AboutPage t={t} isDark={isDark} />;
      if (currentPage === "contact") return <ContactPage t={t} />;
      return <HomePage t={t} isDark={isDark} />;
    }

    if (currentPage === "dashboard")
      return <DashboardPage t={t} isDark={isDark} setIsDark={setIsDark} />;
    if (currentPage === "reports") return <ReportsPage t={t} isDark={isDark} />;

    if (currentPage === "execution")
      return (
        <ExecutionHubPage
          t={t}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          isDark={isDark}
        />
      );

    if (currentPage === "template")
      return (
        <TemplatePage
          t={t}
          isDark={isDark}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
        />
      );

    if (currentPage === "settings")
      return (
        <SettingsPage
          t={t}
          isDark={isDark}
          setIsDark={setIsDark}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          onLogout={handleLogout}
          setIsLoggedIn={setIsLoggedIn}
          profile={profile}
          setProfile={setProfile}
        />
      );

    return <DashboardPage t={t} />;
  };

  return (
    // Container
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        overscrollBehavior: "none",
      }}
    >
      {/* Navbar  */}
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navigation
          t={t}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isDark={isDark}
          setIsDark={setIsDark}
          setShowLogoutMessage={setShowLogoutMessage}
          isMobile={isMobile}
          profile={profile}
          setProfile={setProfile}
          handleLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Sidebar */}
        {(isMobile || isLoggedIn) && (
          <Sidebar
            isDark={isDark}
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setSidebarOpen(false);
            }}
            isMobile={isMobile}
            isLoggedIn={isLoggedIn}
            isOpen={isMobile ? sidebarOpen : true}
            handleLogout={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          />
        )}

        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1100,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            marginLeft: isLoggedIn && !isMobile ? 240 : 0,
            background: t.bg,
            overflowX: "hidden",
          }}
        >
          {/* Page Content  */}
          <div style={{ flex: 1, marginTop: "60px" }}>{renderPage()}</div>
          {/* Footer  */}
          <Footer t={t} isMobile={isMobile} />
        </div>

        {showToast && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#1A1F2E",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              zIndex: 9999,
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
