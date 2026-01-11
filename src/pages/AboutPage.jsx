import React from "react";

const AboutPage = ({ t, isDark }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: t.gradient1,
          borderRadius: "50%",
          opacity: "0.08",
          filter: "blur(100px)",
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
          opacity: "0.08",
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "40px" : "60px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "36px" : "56px",
              fontWeight: "700",
              color: t.text,
              marginBottom: "16px",
              lineHeight: "1.2",
            }}
          >
            About Trackify
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: t.gradient1,
              margin: "0 auto",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Content Card */}
        <div
          style={{
            background: t.cardBg,
            borderRadius: "20px",
            border: `1px solid ${t.border}`,
            padding: isMobile ? "32px 24px" : "48px 40px",
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.3)"
              : "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          {/* Intro */}
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: t.text,
              lineHeight: "1.8",
              marginBottom: "24px",
              fontWeight: "500",
            }}
          >
            <strong style={{ color: t.primary }}>Trackify</strong> is a
            productivity platform built around one simple idea —{" "}
            <strong>consistency matters more than perfection</strong>.
          </p>

          {/* Paragraph 1 */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.textSecondary,
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Most habit and task trackers focus on what you complete in a single
            day. Trackify takes a different approach by focusing on{" "}
            <strong style={{ color: t.text }}>
              how reliably you follow your routine over time
            </strong>
            . This helps you understand real behavior patterns instead of
            chasing checklists or short-lived streaks.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.textSecondary,
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            With Trackify, you design your own workflow based on how you
            actually live and work. There are no rigid templates forcing you
            into unnatural routines. Your daily actions are saved automatically
            in real time, removing friction and making consistency effortless.
          </p>

          {/* Paragraph 3 */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.textSecondary,
              lineHeight: "1.8",
              marginBottom: "32px",
            }}
          >
            Over time, Trackify transforms your routine into{" "}
            <strong style={{ color: t.text }}>
              clear and meaningful insights
            </strong>
            . Weekly summaries highlight what’s working, where momentum drops,
            and which habits deserve more attention — so you can improve with
            confidence instead of guesswork.
          </p>

          {/* Feature Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "20px",
              paddingTop: "32px",
              borderTop: `1px solid ${t.border}`,
            }}
          >
            {[
              {
                icon: "⚙️",
                title: "Flexible Workflows",
                desc: "Design routines that fit your real life, not generic templates.",
              },
              {
                icon: "💾",
                title: "Auto Save",
                desc: "Every action is saved instantly without manual effort.",
              },
              {
                icon: "📊",
                title: "Actionable Insights",
                desc: "Weekly summaries that reveal patterns and improvement areas.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: isMobile ? "20px" : "24px",
                  background: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: "14px",
                  border: `1px solid ${t.border}`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 12px 30px rgba(0,0,0,0.4)"
                    : "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "32px" : "40px",
                    marginBottom: "12px",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: t.text,
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: t.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
