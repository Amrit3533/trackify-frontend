import React, { useState } from "react";

const FeaturesPage = ({ t, isDark }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    {
      icon: "🧩",
      title: "Custom Workflow Engine",
      desc: "Design your own routine structure instead of following predefined task templates. Trackify adapts to your workflow — not the other way around.",
      color: "#10B981",
    },
    {
      icon: "⚡",
      title: "Real-Time Auto Persistence",
      desc: "Every update is automatically saved in the background using a smart debounce mechanism, ensuring zero data loss even during accidental refreshes.",
      color: "#F59E0B",
    },
    {
      icon: "📊",
      title: "Weekly Execution Overview",
      desc: "Get a structured week-level view of your routine execution to identify consistency patterns, productivity gaps, and behavioral trends.",
      color: "#3B82F6",
    },
    {
      icon: "🔐",
      title: "Secure Stateless Authentication",
      desc: "Built with JWT-based authentication to ensure secure, scalable, and session-independent user access across devices.",
      color: "#8B5CF6",
    },
    {
      icon: "🧠",
      title: "Intelligent State Management",
      desc: "Clear separation between configuration, execution, and visualization states ensures predictable behavior and a smooth user experience.",
      color: "#EC4899",
    },
    {
      icon: "🎯",
      title: "Focus on Process, Not Tasks",
      desc: "Trackify emphasizes how consistently you follow your workflow, rather than just checking off completed items.",
      color: "#06B6D4",
    },
    {
      icon: "🖥️",
      title: "Responsive & Minimal UI",
      desc: "A clean, distraction-free interface built with modern UI principles that works seamlessly across desktop and mobile devices.",
      color: "#14B8A6",
    },
    {
      icon: "🧱",
      title: "Scalable System Design",
      desc: "Architected with extensibility in mind, allowing future enhancements such as analytics dashboards, progress scoring, and insights.",
      color: "#F97316",
    },
  ];

  return (
    <div
      style={{
        background: t.bg,
        padding: isMobile ? "40px 20px 80px" : "80px 20px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          background: t.gradient1,
          borderRadius: "50%",
          opacity: "0.08",
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "-200px",
          width: "500px",
          height: "500px",
          background: t.gradient2,
          borderRadius: "50%",
          opacity: "0.08",
          filter: "blur(120px)",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "50px" : "70px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "700",
              color: t.text,
              marginBottom: "16px",
              lineHeight: "1.2",
            }}
          >
            Powerful Features for
            <br />
            <span
              style={{
                background: t.gradient1,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Smarter Habit Tracking
            </span>
          </h1>
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.textSecondary,
              lineHeight: "1.6",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Discover what makes Trackify the most intelligent and flexible habit
            tracking system
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: t.cardBg,
                padding: isMobile ? "28px" : "32px",
                borderRadius: "16px",
                border: `2px solid ${
                  hoveredFeature === idx ? feature.color : t.border
                }`,
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "pointer",
                transform:
                  hoveredFeature === idx ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredFeature === idx
                    ? isDark
                      ? `0 20px 40px ${feature.color}40`
                      : `0 20px 40px ${feature.color}30`
                    : isDark
                    ? "0 4px 16px rgba(0,0,0,0.2)"
                    : "0 4px 16px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "150px",
                  height: "150px",
                  background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05)`,
                  borderRadius: "50%",
                  transform:
                    hoveredFeature === idx
                      ? "translate(25%, -25%) scale(1.3)"
                      : "translate(40%, -40%)",
                  transition: "all 0.4s ease",
                }}
              />

              <div
                style={{
                  fontSize: isMobile ? "48px" : "56px",
                  marginBottom: "20px",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform:
                    hoveredFeature === idx
                      ? "scale(1.2) rotate(5deg)"
                      : "scale(1) rotate(0deg)",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "600",
                  color: hoveredFeature === idx ? feature.color : t.text,
                  marginBottom: "12px",
                  position: "relative",
                  zIndex: 1,
                  transition: "color 0.3s",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: isMobile ? "14px" : "15px",
                  color: t.textSecondary,
                  lineHeight: "1.6",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
