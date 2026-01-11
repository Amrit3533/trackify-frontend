import React, { useState } from "react";

const ContactPage = ({t}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredCard, setHoveredCard] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contactLinks = [
    {
      icon: "📧",
      title: "Email",
      value: "amritsinghofficial3533@gmail.com",
      link: "mailto:amritsinghofficial3533@gmail.com",
      color: "#A05AFF",
      bgEmoji: "@",
    },
    {
      icon: "💻",
      title: "GitHub",
      value: "github.com/your-username",
      link: "https://github.com/your-username",
      color: "#8B5CF6",
      bgEmoji: "💻",
    },
    {
      icon: "🌐",
      title: "LinkedIn",
      value: "linkedin.com/in/your-profile",
      link: "https://linkedin.com/in/your-profile",
      color: "#A05AFF",
      bgEmoji: "🌐",
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
          top: "-100px",
          left: "-100px",
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
          right: "-150px",
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
          maxWidth: "1000px",
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
              fontSize: isMobile ? "36px" : "56px",
              fontWeight: "700",
              color: t.text,
              marginBottom: "20px",
              lineHeight: "1.2",
            }}
          >
            Get in Touch
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: t.gradient1,
              margin: "0 auto 28px",
              borderRadius: "2px",
            }}
          />
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.textSecondary,
              lineHeight: "1.7",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            Have questions, feedback, or feature suggestions?
            <br />
            We're always open to improving Trackify and would love to hear from
            you.
          </p>
        </div>

        {/* Contact Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          {contactLinks.map((contact, idx) => (
            <a
              key={idx}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: t.cardBg,
                borderRadius: "20px",
                border: `2px solid ${
                  hoveredCard === idx ? contact.color : t.border
                }`,
                padding: isMobile ? "32px 24px" : "40px 28px",
                textAlign: "center",
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform:
                  hoveredCard === idx ? "translateY(-12px)" : "translateY(0)",
                boxShadow:
                  hoveredCard === idx
                    ? isDark
                      ? `0 24px 48px ${contact.color}50`
                      : `0 24px 48px ${contact.color}40`
                    : isDark
                    ? "0 4px 16px rgba(0,0,0,0.2)"
                    : "0 4px 16px rgba(0,0,0,0.06)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "140px",
                  height: "140px",
                  background: `linear-gradient(135deg, ${contact.color}25, ${contact.color}08)`,
                  borderRadius: "50%",
                  transform:
                    hoveredCard === idx
                      ? "translate(15%, -15%) scale(1.3)"
                      : "translate(35%, -35%)",
                  transition: "all 0.4s ease",
                }}
              />

              <div
                style={{
                  fontSize: isMobile ? "56px" : "64px",
                  marginBottom: "20px",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.3s",
                  transform: hoveredCard === idx ? "scale(1.1)" : "scale(1)",
                }}
              >
                {contact.icon}
              </div>

              <h3
                style={{
                  fontSize: isMobile ? "20px" : "22px",
                  fontWeight: "600",
                  color: t.text,
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.3s",
                }}
              >
                {contact.title}
              </h3>

              <p
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: hoveredCard === idx ? contact.color : t.textSecondary,
                  wordBreak: "break-word",
                  position: "relative",
                  zIndex: 1,
                  fontWeight: "500",
                  transition: "all 0.3s",
                }}
              >
                {contact.value}
              </p>
            </a>
          ))}
        </div>

        {/* Footer Message */}
        <div
          style={{
            background: t.cardBg,
            borderRadius: "20px",
            border: `1px solid ${t.border}`,
            padding: isMobile ? "32px 28px" : "40px 48px",
            textAlign: "center",
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.2)"
              : "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: t.text,
              lineHeight: "1.8",
              marginBottom: 0,
            }}
          >
            Whether you're exploring Trackify for{" "}
            <strong style={{ color: t.primary, fontWeight: "600" }}>
              personal productivity
            </strong>{" "}
            or{" "}
            <strong style={{ color: t.primary, fontWeight: "600" }}>
              technical curiosity
            </strong>
            , feel free to reach out. We're here to help and always excited to
            connect with our users!
          </p>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;